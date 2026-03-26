import React from 'react';
import { 
  Users, 
  LayoutDashboard, 
  MessageSquare, 
  BrainCircuit, 
  Zap, 
  ShieldCheck, 
  ChevronDown, 
  UserCircle, 
  LogOut, 
  MessageCircle,
  TrendingUp,
  Gem,
  Globe,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { NavItem, openWhatsApp } from './Common';
import { User } from '../types';

const RadarLogoIcon = ({ className, size = 20 }: { className?: string, size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Orbit line with dot */}
    <path d="M4 10C4 6 8 3 14 3C17 3 19 4 20 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="4" cy="10" r="1.2" fill="currentColor"/>
    
    {/* Buildings forming the stem of R */}
    <rect x="7" y="15" width="1.5" height="6" fill="currentColor"/>
    <rect x="9.5" y="12" width="1.5" height="9" fill="currentColor"/>
    <rect x="12" y="9" width="1.5" height="12" fill="currentColor"/>
    
    {/* R Curve */}
    <path d="M13.5 9C16.5 9 19 10.5 19 13.5C19 16.5 16.5 18 13.5 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    
    {/* R Leg */}
    <path d="M15 18L19 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    
    {/* Base line */}
    <path d="M5 21H20" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  currentUser: User;
  showSessionMenu: boolean;
  setShowSessionMenu: (show: boolean) => void;
  setIsSwitchingUser: (show: boolean) => void;
  setSelectedContact: (contact: any) => void;
  geminiStatus: 'idle' | 'checking' | 'connected' | 'error';
  isSupabaseConnected: boolean;
  setIsBackupModalOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  showSessionMenu,
  setShowSessionMenu,
  setIsSwitchingUser,
  setSelectedContact,
  geminiStatus,
  isSupabaseConnected,
  setIsBackupModalOpen
}) => {
  return (
    <aside className="w-24 lg:w-80 bg-navy-light/60 backdrop-blur-3xl border-r border-white/5 flex flex-col h-screen shrink-0 z-30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gold/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-96 bg-gold/[0.01] blur-[120px] pointer-events-none" />
      
      <div className="py-4 px-8">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-light via-gold to-gold-dark rounded-[14px] flex items-center justify-center shadow-[0_8px_25px_rgb(212,175,55,0.35)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative z-10 border border-white/20">
              <RadarLogoIcon className="text-navy drop-shadow-lg" size={20} />
            </div>
            <div className="absolute inset-0 bg-gold blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
            <div className="absolute -inset-1 bg-gradient-to-r from-gold/50 to-transparent rounded-[16px] blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-display font-black text-xl tracking-tighter text-white leading-none">RADAR<span className="text-gradient-gold">CRM</span></h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-px w-2 bg-gold/40" />
              <p className="text-[8px] uppercase tracking-[0.5em] text-gold/50 font-black">Strategic Intelligence</p>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
        <div className="px-4 py-4 text-[9px] uppercase font-black tracking-[0.5em] text-white/15 hidden lg:block flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-gold/30" />
          Sincronização Radar
        </div>
        <div className="px-4 py-2 flex items-center gap-3 text-[10px] font-bold text-white/40">
          <div className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
          {isSupabaseConnected ? 'Banco de Dados Conectado' : 'Modo Offline (Local)' }
        </div>
        
        <button 
          onClick={() => setIsBackupModalOpen(true)}
          className="mx-4 mt-2 mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-gold/10 border border-gold/20 text-[10px] font-black uppercase tracking-widest text-gold hover:bg-gold/20 transition-all group"
        >
          <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
          Sincronizar Dados
        </button>

        <div className="px-4 py-4 text-[9px] uppercase font-black tracking-[0.5em] text-white/15 hidden lg:block flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-gold/30" />
          Menu Estratégico
        </div>
        <NavItem 
          icon={<TrendingUp size={20} />} 
          label="Gestão de Leads" 
          active={activeTab === 'dashboard'} 
          onClick={() => { setActiveTab('dashboard'); setSelectedContact(null); }}
        />
        <NavItem 
          icon={<Users size={20} />} 
          label="Base de Leads" 
          active={activeTab === 'contacts'} 
          onClick={() => { setActiveTab('contacts'); setSelectedContact(null); }}
        />
        <NavItem 
          icon={<MessageSquare size={20} />} 
          label="Conversas AI" 
          active={activeTab === 'conversations'} 
          onClick={() => { setActiveTab('conversations'); setSelectedContact(null); }}
        />
        
        <div className="px-4 py-4 text-[9px] uppercase font-black tracking-[0.5em] text-white/15 hidden lg:block flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-gold/30" />
          Inteligência Radar
        </div>
        <NavItem 
          icon={<BrainCircuit size={20} />} 
          label={
            <div className="flex items-center gap-2">
              Cérebro de Vendas
              {geminiStatus === 'connected' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />}
              {geminiStatus === 'checking' && <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />}
              {geminiStatus === 'error' && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
            </div>
          }
          active={activeTab === 'ai-brain'} 
          onClick={() => { setActiveTab('ai-brain'); setSelectedContact(null); }}
        />
        <NavItem 
          icon={<Zap size={20} />} 
          label="Prioridade Máxima" 
          active={activeTab === 'priority'} 
          onClick={() => { setActiveTab('priority'); setSelectedContact(null); }}
        />
      </nav>
      
      <div className="p-0 space-y-0 relative z-10 bg-navy-light/50 backdrop-blur-2xl border-t border-white/5">
        <div className="relative">
          <div 
            className="flex items-center gap-3 p-2 rounded-none bg-transparent hover:bg-white/[0.08] cursor-pointer transition-all duration-200 group relative overflow-hidden"
            onClick={() => setShowSessionMenu(!showSessionMenu)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 overflow-hidden border border-gold/30 shrink-0 flex items-center justify-center text-gold font-black text-xs shadow-[0_4px_15px_rgba(212,175,55,0.15)] group-hover:scale-105 transition-transform duration-500">
                {currentUser.name.charAt(0)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-navy rounded-full shadow-xl" />
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate group-hover:text-gold transition-colors tracking-tight leading-none">{currentUser.name}</p>
              <p className="text-[7px] text-white/40 font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-gold/40" />
                {currentUser.role === 'admin' ? 'Gestor Master' : 
                 currentUser.role === 'elite' ? 'Corretor Radar' : 
                 'Corretor Premium'}
              </p>
            </div>
            <ChevronDown size={14} className={`text-white/20 transition-transform duration-700 ${showSessionMenu ? 'rotate-180 text-gold' : ''}`} />
          </div>

          {showSessionMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 right-0 mb-4 bg-navy-light border border-white/10 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-50 p-3 backdrop-blur-3xl"
            >
              <button 
                onClick={() => {
                  setShowSessionMenu(false);
                  setIsSwitchingUser(true);
                }}
                className="w-full flex items-center gap-4 px-5 py-4 text-sm font-bold text-white/60 hover:text-gold hover:bg-white/[0.05] rounded-2xl transition-all duration-300"
              >
                <UserCircle size={20} />
                Trocar Perfil
              </button>
              <div className="h-px bg-white/5 my-1 mx-2" />
              <button 
                onClick={() => {
                  setShowSessionMenu(false);
                  // Removed confirm for better iframe compatibility
                  window.location.reload();
                }}
                className="w-full flex items-center gap-4 px-5 py-4 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-300"
              >
                <LogOut size={20} />
                Encerrar Sessão
              </button>
            </motion.div>
          )}
        </div>
        
        {currentUser.role === 'admin' && (
          <button 
            onClick={() => { setActiveTab('team'); setSelectedContact(null); }}
            className={`w-full h-8 flex items-center justify-center gap-2 rounded-none transition-all duration-500 text-[8px] font-black uppercase tracking-[0.2em] border-t border-white/5 group ${
              activeTab === 'team' 
                ? 'bg-gold text-navy' 
                : 'bg-gold/[0.03] text-gold hover:bg-gold/[0.08]'
            }`}
          >
            <ShieldCheck size={14} className="group-hover:scale-110 transition-transform" />
            Gestão de Equipe
          </button>
        )}

        <button 
          onClick={() => openWhatsApp('62981133288')}
          className="w-full h-8 flex items-center justify-center gap-2 rounded-none bg-green-500/[0.03] text-green-500 hover:bg-green-500/[0.08] transition-all duration-500 text-[8px] font-black uppercase tracking-[0.2em] border-t border-white/5 group"
        >
          <MessageCircle size={14} className="group-hover:scale-110 transition-transform" />
          Suporte Radar
        </button>
      </div>
    </aside>
  );
};
