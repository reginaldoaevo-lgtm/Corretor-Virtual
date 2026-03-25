import React from 'react';
import { 
  Flame, 
  Thermometer, 
  Clock, 
  MessageSquare, 
  Briefcase, 
  FileText, 
  Handshake, 
  Trophy 
} from 'lucide-react';
import { motion } from 'motion/react';
import { FunnelStatus } from '../types';

export function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: React.ReactNode, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 group relative overflow-hidden ${
        active 
          ? 'bg-gradient-to-br from-gold-light via-gold to-gold-dark text-navy font-black shadow-[0_10px_25px_rgba(212,175,55,0.2)] scale-[1.02]' 
          : 'text-white/30 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/5'
      }`}
    >
      {active && (
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      <span className={`${active ? 'text-navy drop-shadow-md' : 'text-gold/40 group-hover:text-gold'} transition-all duration-500 group-hover:scale-110`}>
        {icon}
      </span>
      <span className="hidden lg:block text-sm font-bold tracking-tight">{label}</span>
      {active && (
        <motion.div 
          layoutId="active-pill"
          className="ml-auto w-2 h-2 rounded-full bg-navy shadow-lg"
        />
      )}
    </button>
  );
}

export function TemperatureBadge({ temperature }: { temperature: string }) {
  const styles = {
    'Quente': 'bg-red-500/10 border-red-500/40 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] ring-1 ring-red-500/20',
    'Morno': 'bg-orange-500/10 border-orange-500/40 text-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)] ring-1 ring-orange-500/20',
    'Frio': 'bg-blue-500/10 border-blue-500/40 text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/20'
  };
  
  const icons = {
    'Quente': <Flame size={14} className="animate-pulse" />,
    'Morno': <Thermometer size={14} />,
    'Frio': <Clock size={14} />
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border backdrop-blur-xl transition-all duration-700 hover:scale-110 hover:shadow-2xl ${styles[temperature as keyof typeof styles]}`}>
      {icons[temperature as keyof typeof icons]}
      {temperature}
    </span>
  );
}

export function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-3 px-4 border-b border-white/5 last:border-0 hover:bg-white/[0.04] transition-all duration-500 rounded-xl group">
      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] group-hover:text-gold/40 transition-colors">{label}</span>
      <span className="text-sm font-bold text-white/80 tracking-tight group-hover:text-white transition-colors">{value}</span>
    </div>
  );
}

export function getStageIcon(stage: FunnelStatus) {
  switch (stage) {
    case 'Novo Contato': return <MessageSquare size={12} />;
    case 'Agendar Visita': return <Clock size={12} />;
    case 'Visitando': return <Briefcase size={12} />;
    case 'Proposta': return <FileText size={12} />;
    case 'Contrato': return <Handshake size={12} />;
    case 'Venda': return <Trophy size={12} />;
  }
}

export const openWhatsApp = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (!cleanPhone) return;
  const finalPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
  window.open(`https://wa.me/${finalPhone}`, '_blank');
};
