import React from 'react';
import { 
  Zap 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Contact } from '../../types';

interface PriorityFeedProps {
  contacts: Contact[];
  setSelectedContact: (contact: Contact) => void;
}

export const PriorityFeed: React.FC<PriorityFeedProps> = ({
  contacts,
  setSelectedContact
}) => {
  const prioritizedLeads = [...contacts].map(c => {
    let score = 0;
    if (c.temperature === 'Quente') score += 50;
    if (c.temperature === 'Morno') score += 25;
    if (c.status === 'Novo Contato') score += 30;
    if (c.status === 'Agendar Visita') score += 20;
    if (c.budget !== 'R$ 0,00') score += 15;
    
    return { ...c, score };
  }).sort((a, b) => b.score - a.score);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full space-y-6"
    >
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-gold/30 to-gold/5 flex items-center justify-center text-gold border border-gold/30 shadow-[0_15px_40px_rgba(212,175,55,0.2)] gold-glow">
          <Zap size={32} className="animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-black text-white tracking-tight leading-tight">Feed de <span className="text-gradient-gold">Prioridade Elite</span></h2>
          <p className="text-sm text-white/30 mt-1 font-medium">Leads que precisam da sua atenção imediata baseados em comportamento e potencial.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {prioritizedLeads.map((lead) => (
          <motion.div 
            key={lead.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setSelectedContact(lead)}
            className="card-premium p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between hover:bg-white/[0.08] hover:border-gold/40 transition-all duration-700 cursor-pointer group relative overflow-hidden shadow-lg hover:shadow-2xl"
          >
            <div className={`absolute top-0 left-0 w-1.5 h-full transition-all duration-700 ${lead.score > 70 ? 'bg-gradient-to-b from-red-500 to-red-900' : 'bg-gradient-to-b from-gold to-gold-dark'}`} />
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h4 className="font-display font-bold text-xl text-white group-hover:text-gold transition-colors duration-500 tracking-tight leading-tight">{lead.name}</h4>
                {lead.score > 70 && (
                  <span className="text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-full font-black uppercase tracking-[0.3em] shadow-[0_0_15px_rgba(239,68,68,0.2)]">Urgência Máxima</span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-xs text-white/40 mb-4 font-medium">
                <span className="flex items-center gap-2">
                  <span className="text-gold/60 font-black uppercase tracking-widest text-[9px]">Imóvel:</span> {lead.property}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="flex items-center gap-2">
                  <span className="text-gold/60 font-black uppercase tracking-widest text-[9px]">Status:</span> {lead.status}
                </span>
              </div>

              <p className="text-sm text-white/30 leading-relaxed max-w-4xl font-medium italic">
                {lead.score > 70 
                  ? "Este lead demonstrou alto interesse e está em estágio inicial. A probabilidade de conversão é 85% maior se contatado nos próximos 15 minutos."
                  : "Lead qualificado com bom potencial de fechamento. Mantenha o fluxo de nutrição ativo para garantir a progressão no funil."}
              </p>
            </div>

            <div className="mt-6 lg:mt-0 lg:text-right flex flex-row lg:flex-col items-center lg:items-end gap-6 lg:gap-3">
              <div className={`px-6 py-3 rounded-[18px] font-black text-xl shadow-2xl transition-all duration-700 group-hover:scale-110 ${lead.score > 70 ? 'bg-gradient-to-br from-red-500 to-red-700 text-white shadow-red-500/40' : 'bg-gradient-to-br from-gold-light via-gold to-gold-dark text-navy shadow-gold/40'}`}>
                Score: {lead.score}
              </div>
              <div className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">
                Última interação: {lead.lastInteraction}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
