import React from 'react';
import { 
  X, 
  Upload 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Temperature } from '../../types';

interface LeadModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  handleAddLead: (e: React.FormEvent) => void;
  newLead: any;
  setNewLead: (lead: any) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  handleAddLead,
  newLead,
  setNewLead,
  handleImageUpload
}) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsModalOpen(false)}
        className="absolute inset-0 bg-navy/90 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        className="relative w-full max-w-lg bg-navy-light p-6 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-gold/50 to-gold" />
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h3 className="text-2xl font-display font-black text-white tracking-tighter">Novo Lead <span className="text-gradient-gold">Radar</span></h3>
            <p className="text-xs text-white/30 mt-1.5 font-medium">Inicie o acompanhamento estratégico</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(false)} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:bg-white/10 hover:text-white transition-all duration-500 border border-white/5 shadow-xl hover:rotate-90"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleAddLead} className="space-y-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gold/60 ml-2">Nome do Cliente</label>
              <input 
                required
                value={newLead.name}
                onChange={e => setNewLead({...newLead, name: e.target.value})}
                type="text" 
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-all hover:bg-white/[0.08] placeholder:text-white/10 font-bold text-white shadow-inner backdrop-blur-xl"
                placeholder="Ex: João Silva"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gold/60 ml-2">Telefone Estratégico</label>
              <input 
                required
                value={newLead.phone}
                onChange={e => setNewLead({...newLead, phone: e.target.value})}
                type="text" 
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-all hover:bg-white/[0.08] placeholder:text-white/10 font-bold text-white shadow-inner backdrop-blur-xl"
                placeholder="Ex: +55 (62) 98113-3288"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gold/60 ml-2">Imóvel de Interesse Radar</label>
            <input 
              required
              value={newLead.property}
              onChange={e => setNewLead({...newLead, property: e.target.value})}
              type="text" 
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-all hover:bg-white/[0.08] placeholder:text-white/10 font-bold text-white shadow-inner backdrop-blur-xl"
              placeholder="Ex: Ed. Infinity - Goiânia"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gold/60 ml-2">Foto do Empreendimento</label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="w-full h-24 bg-white/[0.03] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/10 hover:border-gold/50 hover:text-gold transition-all duration-700 overflow-hidden relative group shadow-2xl backdrop-blur-xl">
                    {newLead.propertyImage ? (
                      <img src={newLead.propertyImage} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-1.5 group-hover:bg-gold/10 transition-colors">
                          <Upload size={20} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Upload Foto Radar</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, (base64) => setNewLead({...newLead, propertyImage: base64}))}
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div className="space-y-2">
                <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gold/60 ml-2">Orçamento Estimado</label>
                <input 
                  required
                  value={newLead.budget}
                  onChange={e => setNewLead({...newLead, budget: e.target.value})}
                  type="text" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-all hover:bg-white/[0.08] placeholder:text-white/10 font-bold text-white shadow-inner backdrop-blur-xl"
                  placeholder="Ex: R$ 1.500.000"
                />
              </div>
              
              <div className="space-y-2 mt-3">
                <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gold/60 ml-2">Temperatura do Lead</label>
                <div className="flex gap-2.5">
                  {(['Frio', 'Morno', 'Quente'] as Temperature[]).map(temp => (
                    <button
                      key={temp}
                      type="button"
                      onClick={() => setNewLead({...newLead, temperature: temp})}
                      className={`flex-1 py-2.5 rounded-xl border text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                        newLead.temperature === temp
                          ? 'bg-gradient-to-br from-gold-light via-gold to-gold-dark border-gold text-navy shadow-[0_10px_20px_rgba(212,175,55,0.4)] scale-105'
                          : 'bg-white/[0.03] border-white/10 text-white/20 hover:bg-white/[0.08] hover:text-white/40'
                      }`}
                    >
                      {temp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-navy font-black text-[9px] uppercase tracking-[0.3em] rounded-xl hover:bg-white transition-all duration-700 shadow-[0_15px_35px_rgba(212,175,55,0.3)] mt-4 hover:scale-[1.03] active:scale-[0.97] border border-white/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            Cadastrar Lead no Pipeline Radar
          </button>
        </form>
      </motion.div>
    </div>
  );
};
