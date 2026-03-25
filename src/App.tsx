"use client";

import React, { useState, useEffect } from 'react';
import { safeLocalStorage } from './lib/storage';
import { 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core';
import { 
  BrainCircuit, 
  MessageSquare, 
  Users, 
  Sparkles, 
  History as HistoryIcon 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from './hooks/useAuth';
import { useLeads } from './hooks/useLeads';
import { useAI } from './hooks/useAI';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { Layout } from './components/Layout';
import { Kanban } from './components/CRM/Kanban';
import { ContactsList } from './components/CRM/ContactsList';
import { PriorityFeed } from './components/Dashboard/PriorityFeed';
import { TeamManagement } from './components/Team/TeamManagement';
import { AIBrain } from './components/AI/AIBrain';
import { LeadModal } from './components/Modals/LeadModal';
import { BackupModal } from './components/Modals/BackupModal';
import { SwitchUserModal } from './components/Modals/SwitchUserModal';
import { ContactDetailModal } from './components/Modals/ContactDetailModal';
import { Temperature, User } from './types';
import { testSupabaseConnection } from './lib/supabase';
import { testGeminiConnection } from './services/geminiService';

const validateKey = (key: string) => {
  if (!key) return false;
  const trimmed = key.trim();
  return trimmed.length > 10 && 
         trimmed !== 'YOUR_API_KEY' && 
         !trimmed.includes('MY_GEMINI') &&
         !trimmed.includes('PLACEHOLDER');
};

const getApiKey = () => {
  if (typeof window === 'undefined') return '';
  
  const localKey = safeLocalStorage.getItem('ELITE_CRM_GEMINI_KEY') || '';

  // 1. Check manual key first (user intent is strongest here)
  if (localKey && validateKey(localKey)) return localKey.trim();

  // 2. Check environment variables
  const envKey = [
    process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    process.env.GEMINI_API_KEY,
    process.env.NEXT_PUBLIC_API_KEY
  ].find(key => key && key !== 'undefined' && key !== 'null' && key !== '' && validateKey(key));

  return (envKey || localKey || '').trim();
};

export type Tab = 'dashboard' | 'contacts' | 'conversations' | 'ai-brain' | 'team' | 'priority';

export default function App() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [geminiStatus, setGeminiStatus] = useState<'idle' | 'checking' | 'connected' | 'error'>('idle');
  const [manualKey, setManualKey] = useState('');

  console.log('App rendering, isMounted:', isMounted);

  const currentKey = isMounted ? getApiKey() : '';
  const hasValidKey = isMounted ? validateKey(currentKey) : false;

  React.useEffect(() => {
    console.log('App mounting...');
    setIsMounted(true);
    testSupabaseConnection();
  }, []);

  React.useEffect(() => {
    if (isMounted && hasValidKey) {
      const sessionStatus = sessionStorage.getItem('gemini_connection_status');
      if (sessionStatus === 'connected') {
        setGeminiStatus('connected');
        return;
      }

      setGeminiStatus('checking');
      testGeminiConnection().then(success => {
        if (success) {
          console.log("✅ Cérebro de Vendas Elite conectado!");
          setGeminiStatus('connected');
          sessionStorage.setItem('gemini_connection_status', 'connected');
        } else {
          console.warn("⚠️ Falha na conexão inicial com o Cérebro de Vendas. Verifique sua chave.");
          setGeminiStatus('error');
          sessionStorage.removeItem('gemini_connection_status');
        }
      });
    }
  }, [isMounted, hasValidKey]);

  const handleSaveManualKey = () => {
    if (manualKey.trim()) {
      safeLocalStorage.setItem('ELITE_CRM_GEMINI_KEY', manualKey.trim());
      console.log("🔑 Chave manual salva no LocalStorage.");
      window.location.reload();
    }
  };

  const handleClearKey = () => {
    safeLocalStorage.removeItem('ELITE_CRM_GEMINI_KEY');
    console.log("🗑️ Chave manual removida.");
    window.location.reload();
  };
  const { 
    teamMembers, 
    setTeamMembers, 
    currentUser, 
    setCurrentUser, 
    addTeamMember, 
    deleteTeamMember 
  } = useAuth();
  const { 
    contacts, 
    selectedContact, 
    setSelectedContact: setLeadsSelectedContact, 
    isModalOpen, 
    setIsModalOpen, 
    isEditing, 
    setIsEditing,
    handleAddLead,
    handleDeleteLead,
    updateLeadStatus,
    handleUpdateContact,
    isSupabaseConnected,
    importLeads,
    exportLeads
  } = useLeads();

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  const setSelectedContact = (contact: any) => {
    setLeadsSelectedContact(contact);
    if (contact) {
      setConversation(contact.conversationHistory || '');
      setAiResponse(contact.behavioralAnalysis || null);
    } else {
      setConversation('');
      setAiResponse(null);
    }
  };
  
  const {
    conversation,
    setConversation,
    aiResponse,
    setAiResponse,
    isLoading,
    globalAnalyses,
    isGlobalLoading,
    copied,
    handleGenerate,
    handleGlobalAnalysis,
    copyToClipboard,
    analysisImage,
    setAnalysisImage
  } = useAI();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showSessionMenu, setShowSessionMenu] = useState(false);
  const [isSwitchingUser, setIsSwitchingUser] = useState(false);
  const [selectedUserToSwitch, setSelectedUserToSwitch] = useState<User | null>(null);
  const [switchPassword, setSwitchPassword] = useState('');
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '', role: 'premium' as User['role'] });

  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    property: '',
    propertyImage: '',
    budget: '',
    temperature: 'Morno' as Temperature
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (!isMounted) {
    console.log('Rendering mount spinner');
    return (
      <div className="flex items-center justify-center h-screen bg-navy text-white font-sans">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasValidKey) {
    return (
      <div className="flex items-center justify-center h-screen bg-navy text-white font-sans p-6">
        <div className="max-w-md w-full glass-dark p-8 rounded-[32px] border border-gold/20 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center text-gold mx-auto mb-6 border border-gold/30 shadow-[0_10px_30px_rgba(212,175,55,0.2)]">
            <BrainCircuit size={40} className="animate-pulse" />
          </div>
          <h2 className="text-2xl font-display font-black mb-4 tracking-tighter">Configuração Necessária</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            Para ativar o <strong>Cérebro de Vendas Elite</strong> e sincronizar dados entre dispositivos, você precisa configurar as chaves de API nos Segredos do projeto.
          </p>
          
          <div className="space-y-4 text-left mb-8">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold text-[10px] font-black shrink-0">1</div>
              <p className="text-xs text-white/40">Clique no ícone de <strong>Engrenagem (⚙️)</strong> no canto superior direito.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold text-[10px] font-black shrink-0">2</div>
              <p className="text-xs text-white/40">Vá em <strong>Secrets</strong> e adicione as seguintes chaves:</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold text-[10px] font-black shrink-0">3</div>
              <div className="text-xs text-white/40 space-y-2">
                <div>
                  <code className="text-gold bg-gold/10 px-1.5 py-0.5 rounded font-bold">NEXT_PUBLIC_GEMINI_API_KEY</code>
                  <p className="mt-0.5 text-[9px] text-white/20 italic">(Para a Inteligência Artificial)</p>
                </div>
                <div>
                  <code className="text-gold bg-gold/10 px-1.5 py-0.5 rounded font-bold">NEXT_PUBLIC_SUPABASE_URL</code>
                  <p className="mt-0.5 text-[9px] text-white/20 italic">(Para Sincronização de Dados)</p>
                </div>
                <div>
                  <code className="text-gold bg-gold/10 px-1.5 py-0.5 rounded font-bold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                  <p className="mt-0.5 text-[9px] text-white/20 italic">(Para Sincronização de Dados)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 bg-white/[0.03] border border-white/10 rounded-[24px] text-left">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Solução Alternativa (Manual)</p>
              {isMounted && safeLocalStorage.getItem('ELITE_CRM_GEMINI_KEY') && (
                <button 
                  onClick={handleClearKey}
                  className="text-[8px] font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors"
                >
                  Limpar Chave Salva
                </button>
              )}
            </div>
            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              Se os Secrets não estiverem funcionando, insira sua chave manualmente abaixo. Ela será salva apenas no seu navegador.
            </p>
            <div className="flex flex-col gap-3">
              <input 
                type="password"
                value={manualKey}
                onChange={(e) => setManualKey(e.target.value)}
                placeholder="Cole sua chave AIza..."
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors text-white"
              />
              <button 
                onClick={handleSaveManualKey}
                className="bg-gold text-navy font-black text-xs py-3 rounded-xl hover:bg-gold/90 transition-all active:scale-95 shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
              >
                ATIVAR CÉREBRO AGORA
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-[8px] text-white/20 uppercase tracking-widest mb-2">Status do Sistema</p>
              <div className="flex flex-wrap gap-2">
                <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[8px] text-white/40">
                  Detectada: {currentKey ? `${currentKey.substring(0, 6)}...` : 'Nenhuma'}
                </div>
                <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[8px] text-white/40">
                  Válida: {hasValidKey ? 'Sim' : 'Não'}
                </div>
                <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[8px] text-white/40">
                  Manual: {isMounted && safeLocalStorage.getItem('ELITE_CRM_GEMINI_KEY') ? 'Sim' : 'Não'}
                </div>
              </div>
            </div>
          </div>

          {currentKey && !currentKey.startsWith('AIza') && (
            <div className="mb-8 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Erro de Formato Detectado</p>
              </div>
              
              <p className="text-xs text-white/80 mb-3 leading-relaxed">
                Sua chave começa com <code className="text-red-400 font-mono bg-red-500/20 px-1.5 py-0.5 rounded">{currentKey.substring(0, 8)}...</code>, mas as chaves do Google Gemini <strong>devem começar obrigatoriamente com "AIza"</strong>.
              </p>
            </div>
          )}

          {currentKey && currentKey.startsWith('AIza') && !hasValidKey && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-left">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Diagnóstico de Chave:</p>
              <p className="text-xs text-white/60 break-all font-mono">
                Chave Atual: {currentKey.substring(0, 6)}...{currentKey.substring(currentKey.length - 4)}
              </p>
              <p className="text-[9px] text-white/30 mt-1">
                Tamanho: {currentKey.length} caracteres. {currentKey.startsWith('AIza') ? '✅ Formato OK' : '❌ Formato Inválido'}
              </p>
            </div>
          )}
          
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-gradient-to-r from-gold-light to-gold-dark text-navy font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
          >
            RECARREGAR SISTEMA
          </button>
        </div>
      </div>
    );
  }

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const FUNNEL_STAGES = ['Novo Contato', 'Agendar Visita', 'Visitando', 'Proposta', 'Contrato', 'Venda'];
    
    if (FUNNEL_STAGES.includes(overId)) {
      updateLeadStatus(activeId, overId as any);
      return;
    }

    const overContact = contacts.find(c => c.id === overId);
    if (overContact) {
      updateLeadStatus(activeId, overContact.status);
    }
  };

  const handleConfirmSwitch = () => {
    if (!selectedUserToSwitch) return;
    
    const correctPassword = selectedUserToSwitch.password || (selectedUserToSwitch.id === 'admin-default' ? 'admin' : '');
    
    if (switchPassword === correctPassword) {
      setCurrentUser(selectedUserToSwitch);
      setIsSwitchingUser(false);
      setSelectedUserToSwitch(null);
      setSwitchPassword('');
      setActiveTab('dashboard');
      // Removed alert for better iframe compatibility
      console.log(`Bem-vindo de volta, ${selectedUserToSwitch.name}!`);
    } else {
      // Removed alert for better iframe compatibility
      console.warn("Senha incorreta!");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Kanban 
            contacts={contacts}
            sensors={sensors}
            handleDragStart={onDragStart}
            handleDragEnd={onDragEnd}
            activeId={activeId}
            setSelectedContact={setSelectedContact}
            handleDeleteLead={handleDeleteLead}
            updateLeadStatus={updateLeadStatus}
          />
        );
      case 'contacts':
        return (
          <ContactsList 
            contacts={contacts}
            setSelectedContact={setSelectedContact}
            handleDeleteLead={handleDeleteLead}
            setIsModalOpen={setIsModalOpen}
          />
        );
      case 'conversations':
        return (
          <div className="flex flex-col h-full p-8 space-y-8 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-16 h-16 rounded-3xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-[0_0_40px_rgba(212,175,55,0.2)] gold-glow">
                <MessageSquare size={32} />
              </div>
              <div>
                <h2 className="text-4xl font-display font-black text-white tracking-tighter leading-none">Conversas AI</h2>
                <p className="text-gold/60 text-sm mt-2 font-medium uppercase tracking-[0.3em]">Histórico de Estratégias Comportamentais</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.filter(c => c.behavioralHistory && c.behavioralHistory.length > 0).length > 0 ? (
                contacts
                  .filter(c => c.behavioralHistory && c.behavioralHistory.length > 0)
                  .map(contact => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => setSelectedContact(contact)}
                      className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 cursor-pointer hover:bg-white/[0.06] transition-all group relative overflow-hidden shadow-2xl backdrop-blur-xl"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors" />
                      
                      <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 group-hover:scale-110 transition-transform">
                          <Users size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white truncate tracking-tight">{contact.name}</h3>
                          <p className="text-[9px] font-black text-gold/60 uppercase tracking-widest mt-0.5">{contact.status}</p>
                        </div>
                      </div>

                      <div className="space-y-4 relative z-10">
                        <div className="bg-navy/40 rounded-2xl p-4 border border-white/5 group-hover:border-gold/20 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={12} className="text-gold" />
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Última Estratégia</span>
                          </div>
                          <p className="text-xs text-white/80 italic line-clamp-2 leading-relaxed">
                            "{contact.behavioralAnalysis?.idealResponse}"
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 text-[8px] font-black text-white/20 uppercase tracking-widest">
                            <HistoryIcon size={12} />
                            {contact.behavioralHistory?.length} Análises
                          </div>
                          <div className="text-[8px] font-black text-gold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                            Ver Detalhes →
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/[0.02] border border-dashed border-white/10 rounded-[40px]">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-white/10">
                    <MessageSquare size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white/40 tracking-tight">Nenhuma conversa analisada ainda</h3>
                    <p className="text-sm text-white/20 mt-2">Inicie uma análise comportamental em qualquer lead para ver o histórico aqui.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="px-8 py-3 bg-gold/10 text-gold rounded-xl text-[10px] font-black uppercase tracking-widest border border-gold/20 hover:bg-gold hover:text-navy transition-all"
                  >
                    Ir para o Funil
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'priority':
        return (
          <PriorityFeed 
            contacts={contacts}
            setSelectedContact={setSelectedContact}
          />
        );
      case 'team':
        return (
          <TeamManagement 
            teamMembers={teamMembers}
            addTeamMember={addTeamMember}
            deleteTeamMember={deleteTeamMember}
            newMember={newMember}
            setNewMember={setNewMember}
          />
        );
      case 'ai-brain':
        return (
          <AIBrain 
            isGlobalLoading={isGlobalLoading}
            globalAnalyses={globalAnalyses as any}
            handleGlobalAnalysis={() => handleGlobalAnalysis(contacts)}
            setSelectedContact={setSelectedContact}
            contacts={contacts}
            geminiStatus={geminiStatus}
          />
        );
      default:
        return <div className="text-white/30 text-center mt-20">Em breve...</div>;
    }
  };

  console.log('Rendering main content, hasValidKey:', hasValidKey);

  return (
    <div className="flex h-screen bg-navy text-white font-sans selection:bg-gold/30 selection:text-gold overflow-hidden">
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          showSessionMenu={showSessionMenu}
          setShowSessionMenu={setShowSessionMenu}
          setIsSwitchingUser={setIsSwitchingUser}
          setSelectedContact={setSelectedContact}
          geminiStatus={geminiStatus}
          isSupabaseConnected={isSupabaseConnected}
          setIsBackupModalOpen={setIsBackupModalOpen}
        />

        <Layout setIsModalOpen={setIsModalOpen}>
          {renderContent()}
        </Layout>

        {selectedContact && (
          <ContactDetailModal 
            selectedContact={selectedContact}
            setSelectedContact={setSelectedContact}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleUpdateContact={handleUpdateContact}
            conversation={conversation}
            setConversation={setConversation}
            handleGenerate={async () => {
              if (!selectedContact) return;
              const currentContactId = selectedContact.id;
              const response = await handleGenerate(selectedContact.name, selectedContact.property);
              
              if (response && selectedContact && selectedContact.id === currentContactId) {
                const updatedHistory = [
                  response,
                  ...(selectedContact.behavioralHistory || [])
                ];
                
                handleUpdateContact({
                  ...selectedContact,
                  behavioralAnalysis: response,
                  behavioralHistory: updatedHistory
                });
              }
            }}
            isLoading={isLoading}
            aiResponse={aiResponse}
            setAiResponse={setAiResponse}
            copyToClipboard={copyToClipboard}
            copied={copied}
            analysisImage={analysisImage}
            setAnalysisImage={setAnalysisImage}
          />
        )}

        <LeadModal 
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          handleAddLead={(e) => {
            e.preventDefault();
            handleAddLead(newLeadForm);
            setNewLeadForm({ name: '', phone: '', property: '', propertyImage: '', budget: '', temperature: 'Morno' });
          }}
          newLead={newLeadForm}
          setNewLead={setNewLeadForm}
          handleImageUpload={handleImageUpload}
        />

        <BackupModal 
          isOpen={isBackupModalOpen}
          onClose={() => setIsBackupModalOpen(false)}
          exportLeads={exportLeads}
          importLeads={importLeads}
        />

        <SwitchUserModal 
          isSwitchingUser={isSwitchingUser}
          setIsSwitchingUser={setIsSwitchingUser}
          teamMembers={teamMembers}
          currentUser={currentUser}
          selectedUserToSwitch={selectedUserToSwitch}
          setSelectedUserToSwitch={setSelectedUserToSwitch}
          switchPassword={switchPassword}
          setSwitchPassword={setSwitchPassword}
          handleConfirmSwitch={handleConfirmSwitch}
        />
      </div>
    );
}
