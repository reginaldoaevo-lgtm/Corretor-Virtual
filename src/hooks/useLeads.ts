"use client";

import React, { useState, useEffect } from 'react';
import { Contact, FunnelStatus, Temperature } from '../types';
import { supabase } from '../lib/supabase';
import { safeLocalStorage } from '../lib/storage';

const mapStatus = (status: string): FunnelStatus => {
  if (status === 'Nova Conversa') return 'Novo Contato';
  if (status === 'Pasta') return 'Proposta';
  const validStatuses: FunnelStatus[] = ['Novo Contato', 'Agendar Visita', 'Visitando', 'Proposta', 'Contrato', 'Venda'];
  return validStatuses.includes(status as any) ? (status as FunnelStatus) : 'Novo Contato';
};

export const useLeads = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    fetchLeads();

    // Subscribe to real-time changes
    let channel: any = null;
    if (typeof window !== 'undefined') {
      try {
        channel = supabase
          .channel('public:contacts')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'contacts' },
            (payload) => {
              console.log('Real-time change received:', payload);
              if (payload.eventType === 'INSERT') {
                const newItem = payload.new as any;
                const mappedContact: Contact = {
                  id: newItem.id,
                  name: newItem.name,
                  phone: newItem.phone,
                  property: newItem.property,
                  propertyImage: newItem.property_image || undefined,
                  budget: newItem.budget || '0',
                  status: mapStatus(newItem.status),
                  temperature: (newItem.temperature as Temperature) || 'Morno',
                  lastInteraction: newItem.last_interaction,
                  createdAt: newItem.created_at,
                  summary: newItem.summary || '',
                  conversationHistory: newItem.conversation_history || '',
                  behavioralAnalysis: newItem.behavioral_analysis || undefined,
                  behavioralHistory: newItem.behavioral_history || []
                };
                setContacts(prev => {
                  // Check if we have an optimistic lead with the same name and phone
                  const optimisticIndex = prev.findIndex(c => 
                    (c.id.length < 20 && c.name === mappedContact.name && c.phone === mappedContact.phone) ||
                    c.id === mappedContact.id
                  );
                  
                  if (optimisticIndex !== -1) {
                    const newArr = [...prev];
                    newArr[optimisticIndex] = mappedContact;
                    return newArr;
                  }
                  
                  return [mappedContact, ...prev];
                });
              } else if (payload.eventType === 'UPDATE') {
                const updatedItem = payload.new as any;
                const mappedContact: Contact = {
                  id: updatedItem.id,
                  name: updatedItem.name,
                  phone: updatedItem.phone,
                  property: updatedItem.property,
                  propertyImage: updatedItem.property_image || undefined,
                  budget: updatedItem.budget || '0',
                  status: mapStatus(updatedItem.status),
                  temperature: (updatedItem.temperature as Temperature) || 'Morno',
                  lastInteraction: updatedItem.last_interaction,
                  createdAt: updatedItem.created_at,
                  summary: updatedItem.summary || '',
                  conversationHistory: updatedItem.conversation_history || '',
                  behavioralAnalysis: updatedItem.behavioral_analysis || undefined,
                  behavioralHistory: updatedItem.behavioral_history || []
                };
                setContacts(prev => prev.map(c => c.id === mappedContact.id ? mappedContact : c));
              } else if (payload.eventType === 'DELETE') {
                setContacts(prev => prev.filter(c => c.id !== payload.old.id));
              }
            }
          )
          .subscribe();
      } catch (e) {
        console.warn('Real-time subscription skipped:', e);
      }
    }

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          console.warn('Error removing channel:', e);
        }
      }
    };
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // Try Supabase first
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setIsSupabaseConnected(true);
        const mappedContacts: Contact[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          phone: item.phone,
          property: item.property,
          propertyImage: item.property_image || undefined,
          budget: item.budget || '0',
          status: mapStatus(item.status),
          temperature: (item.temperature as Temperature) || 'Morno',
          lastInteraction: item.last_interaction,
          createdAt: item.created_at,
          summary: item.summary || '',
          conversationHistory: item.conversation_history || '',
          behavioralAnalysis: item.behavioral_analysis || undefined,
          behavioralHistory: item.behavioral_history || []
        }));
        setContacts(mappedContacts);
        safeLocalStorage.setItem('radar_contacts', JSON.stringify(mappedContacts));
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using local storage:', error);
      setIsSupabaseConnected(false);
      const localData = safeLocalStorage.getItem('radar_contacts');
      if (localData) {
        try {
          setContacts(JSON.parse(localData));
        } catch (e) {
          console.error('Error parsing local contacts:', e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (newLead: any) => {
    const tempId = Date.now().toString();
    const lead: Contact = {
      id: tempId,
      name: newLead.name,
      phone: newLead.phone,
      property: newLead.property,
      propertyImage: newLead.propertyImage,
      budget: newLead.budget,
      status: 'Novo Contato',
      temperature: newLead.temperature,
      lastInteraction: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      summary: `Lead ${newLead.name}`
    };

    // Optimistic update
    const updatedContacts = [lead, ...contacts];
    setContacts(updatedContacts);
    safeLocalStorage.setItem('radar_contacts', JSON.stringify(updatedContacts));
    setIsModalOpen(false);

    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          name: newLead.name,
          phone: newLead.phone,
          property: newLead.property,
          property_image: newLead.propertyImage,
          budget: newLead.budget,
          status: 'Novo Contato',
          temperature: newLead.temperature,
          summary: `Lead ${newLead.name}`,
          conversation_history: ''
        }])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        // Replace temp lead with real one from DB if needed, 
        // but for now we trust the local state for immediate feedback
      }
    } catch (error) {
      console.warn('Error adding lead to Supabase, saved locally:', error);
    }
  };

  const handleDeleteLead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Removed confirm for better iframe compatibility
    // Optimistic update
    const updatedContacts = contacts.filter(c => c.id !== id);
    setContacts(updatedContacts);
    safeLocalStorage.setItem('radar_contacts', JSON.stringify(updatedContacts));
    if (selectedContact?.id === id) setSelectedContact(null);

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.warn('Error deleting lead from Supabase, updated locally:', error);
    }
  };

  const updateLeadStatus = async (id: string, newStatus: FunnelStatus) => {
    // Optimistic update
    const updatedContacts = contacts.map(c => c.id === id ? { ...c, status: newStatus } : c);
    setContacts(updatedContacts);
    safeLocalStorage.setItem('radar_contacts', JSON.stringify(updatedContacts));
    if (selectedContact?.id === id) {
      setSelectedContact(prev => prev ? { ...prev, status: newStatus } : null);
    }

    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.warn('Error updating lead status in Supabase, updated locally:', error);
    }
  };

  const handleUpdateContact = async (updatedContact: Contact) => {
    // Optimistic update
    const updatedContacts = contacts.map(c => c.id === updatedContact.id ? updatedContact : c);
    setContacts(updatedContacts);
    safeLocalStorage.setItem('radar_contacts', JSON.stringify(updatedContacts));
    if (selectedContact?.id === updatedContact.id) {
      setSelectedContact(updatedContact);
    }

    try {
      const { error } = await supabase
        .from('contacts')
        .update({
          name: updatedContact.name,
          phone: updatedContact.phone,
          property: updatedContact.property,
          property_image: updatedContact.propertyImage,
          budget: updatedContact.budget,
          status: updatedContact.status,
          temperature: updatedContact.temperature,
          summary: updatedContact.summary,
          conversation_history: updatedContact.conversationHistory,
          behavioral_analysis: updatedContact.behavioralAnalysis as any,
          behavioral_history: updatedContact.behavioralHistory as any
        })
        .eq('id', updatedContact.id);

      if (error) throw error;
    } catch (error) {
      console.warn('Error updating contact in Supabase, updated locally:', error);
    }
  };

  return {
    contacts,
    setContacts,
    selectedContact,
    setSelectedContact,
    isModalOpen,
    setIsModalOpen,
    isEditing,
    setIsEditing,
    handleAddLead,
    handleDeleteLead,
    updateLeadStatus,
    handleUpdateContact,
    isSupabaseConnected,
    importLeads: async (leads: Contact[]) => {
      try {
        // Add each lead to Supabase (or local storage)
        for (const lead of leads) {
          await handleAddLead(lead);
        }
        return true;
      } catch (e) {
        console.error('Error importing leads:', e);
        return false;
      }
    },
    exportLeads: () => {
      return JSON.stringify(contacts, null, 2);
    }
  };
};
