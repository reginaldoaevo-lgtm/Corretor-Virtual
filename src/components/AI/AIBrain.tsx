import React from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  TrendingUp, 
  Users, 
  ChevronRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlobalAnalysisItem } from '../../services/geminiService';

interface AIBrainProps {
  isGlobalLoading: boolean;
  globalAnalyses: GlobalAnalysisItem[];
  handleGlobalAnalysis: () => void;
  setSelectedContact: (contact: any) => void;
  contacts: any[];
  geminiStatus: 'idle' | 'checking' | 'connected' | 'error';
}

export const AIBrain: React.FC<AIBrainProps> = ({
  isGlobalLoading,
  globalAnalyses,
  handleGlobalAnalysis,
  setSelectedContact,
  contacts,
  geminiStatus
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col space-y-8"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/20 via-gold/10 to-transparent flex items-center justify-center text-gold border border-gold/30 shadow-[0_10px_30px_rgba(212,175,55,0.2)] gold-glow relative z-10">
              <BrainCircuit size={24} className="drop-shadow-lg animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full opacity-50" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-black text-white tracking-tighter leading-tight">Especialista em <span className="text-gradient-gold">Comportamento</span></h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px w-4 bg-gold/30" />
              <div className="flex items-center gap-2">
                <p className="text-xs text-white/40 font-medium">Análise psicológica e estratégica de leads</p>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/5">
                  <div className={`w-1 h-1 rounded-full ${
                    geminiStatus === 'connected' ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 
                    geminiStatus === 'checking' ? 'bg-gold animate-pulse' : 
                    'bg-red-500'
                  }`} />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/30">
                    {geminiStatus === 'connected' ? 'Online' : 
                     geminiStatus === 'checking' ? 'Verificando...' : 
                     'Offline'}
                  </span>
                  {geminiStatus === 'error' && (
                    <button 
                      onClick={() => window.location.reload()}
                      className="text-[8px] font-black text-gold hover:text-white transition-colors ml-1"
                    >
                      [Tentar Novamente]
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={handleGlobalAnalysis}
          disabled={isGlobalLoading || contacts.length === 0}
          className="w-full lg:w-auto px-6 py-3 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-navy font-black text-[9px] uppercase tracking-[0.3em] rounded-xl hover:bg-white transition-all duration-700 shadow-[0_15px_35px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.05] active:scale-[0.95] border border-white/20 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
          {isGlobalLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-navy/30 border-t-navy animate-spin rounded-full" />
              Processando...
            </>
          ) : (
            <>
              <Sparkles size={16} strokeWidth={3} className="group-hover:rotate-12 transition-transform duration-500" />
              Análise Comportamental Global
            </>
          )}
        </button>
      </div>

      {globalAnalyses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto pr-4 custom-scrollbar pb-8">
          {globalAnalyses.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.7 }}
              className="glass-dark p-6 flex flex-col hover:border-gold/40 transition-all duration-700 group relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-2xl"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full -mr-24 -mt-24 blur-[80px] group-hover:bg-gold/10 transition-colors duration-1000" />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 group-hover:bg-gold group-hover:text-navy transition-all duration-700 shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <TrendingUp size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white group-hover:text-gold transition-colors duration-500 tracking-tighter">{item.contactName}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1 h-1 rounded-full bg-gold/40" />
                      <span className="text-[7px] uppercase font-black tracking-[0.2em] text-white/20">Análise estratégica</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 flex-1 relative z-10">
                <div className="relative">
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gold/40 block mb-2 flex items-center gap-2">
                    <div className="w-3 h-px bg-gold/20" />
                    Observação Radar
                  </span>
                  <p className="text-sm text-white/50 leading-relaxed font-medium pl-5 relative">
                    <span className="absolute left-0 top-0 text-2xl text-gold/10 font-serif">"</span>
                    {item.observation}
                  </p>
                </div>
                
                {item.behavioralSummary && item.behavioralSummary !== "Ainda não analisado individualmente" && (
                  <div className="relative">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gold/40 block mb-2 flex items-center gap-2">
                      <div className="w-3 h-px bg-gold/20" />
                      Resumo Comportamental
                    </span>
                    <p className="text-sm text-white/70 leading-relaxed font-bold pl-5 relative">
                      {item.behavioralSummary}
                    </p>
                  </div>
                )}

                <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10 relative overflow-hidden group/action shadow-xl backdrop-blur-xl">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold/60 to-gold/20" />
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gold/60 block mb-2 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-gold animate-pulse" />
                    Próxima Ação
                  </span>
                  <p className="text-base text-white italic font-bold leading-relaxed tracking-tight">
                    {item.nextAction}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-6 mt-3 relative z-10">
                <button 
                  onClick={() => {
                    const contact = contacts.find(c => c.id === item.contactId);
                    if (contact) setSelectedContact(contact);
                  }}
                  className="px-6 py-3 bg-white/[0.03] hover:bg-gold hover:text-navy rounded-xl text-gold text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2.5 border border-gold/20 hover:border-gold shadow-xl hover:scale-[1.05] active:scale-[0.95]"
                >
                  Ver Detalhes <ChevronRight size={12} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white/[0.02] rounded-[40px] border border-dashed border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold/20 mb-6 shadow-[inset_0_0_30px_rgba(212,175,55,0.1)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-1000 relative">
            <div className="absolute inset-0 bg-gold/5 blur-2xl rounded-full" />
            <BrainCircuit size={32} className="relative z-10 opacity-30 group-hover:opacity-60 transition-opacity" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-display font-black text-white/80 mb-3 tracking-tighter">Pronto para a <span className="text-gradient-gold">Análise Global Radar</span>?</h3>
            <p className="text-sm text-white/20 max-w-md mx-auto leading-relaxed font-medium">
              Clique no botão acima para que a IA analise seus {contacts.length} leads e identifique as melhores estratégias de fechamento.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-6 bg-white/5" />
              <div className="w-1 h-1 rounded-full bg-gold/20" />
              <div className="h-px w-6 bg-white/5" />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
