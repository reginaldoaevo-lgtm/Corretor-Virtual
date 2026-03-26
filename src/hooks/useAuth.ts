"use client";

import { useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { safeLocalStorage } from '../lib/storage';

export const useAuth = () => {
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'admin-default',
    name: 'Reginaldo Magalhaes',
    email: 'reginaldo@radar.com',
    role: 'admin',
    status: 'Ativo'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
    
    // Load current user from localStorage (session simulation)
    const savedUser = safeLocalStorage.getItem('radar_crm_current_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.warn('Error parsing user from localStorage:', e);
      }
    }
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name');

      if (error) throw error;

      if (data && data.length > 0) {
        setTeamMembers(data as User[]);
        safeLocalStorage.setItem('radar_team_members', JSON.stringify(data));
      } else {
        // Seed initial data if empty
        const initialMembers = [
          { name: 'Ricardo Opus', email: 'ricardo@imobiliaria.com', role: 'premium', status: 'Ativo' }
        ];
        const { data: seededData, error: seedError } = await supabase
          .from('team_members')
          .insert(initialMembers)
          .select();
        
        if (!seedError && seededData) {
          setTeamMembers(seededData as User[]);
          safeLocalStorage.setItem('radar_team_members', JSON.stringify(seededData));
        }
      }
    } catch (error) {
      console.warn('Supabase fetch team members failed, using local storage:', error);
      const localData = safeLocalStorage.getItem('radar_team_members');
      if (localData) {
        try {
          setTeamMembers(JSON.parse(localData));
        } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    safeLocalStorage.setItem('radar_crm_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const addTeamMember = async (newMember: Omit<User, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([newMember])
        .select();

      if (error) throw error;

      if (data) {
        setTeamMembers(prev => [...prev, data[0] as User]);
      }
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTeamMembers(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  return {
    teamMembers,
    setTeamMembers,
    currentUser,
    setCurrentUser,
    addTeamMember,
    deleteTeamMember,
    loading
  };
};
