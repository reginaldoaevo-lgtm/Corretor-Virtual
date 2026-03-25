import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  Edit2, 
  X, 
  Sparkles, 
  BrainCircuit, 
  Copy, 
  MessageCircle, 
  Phone, 
  ImageIcon,
  History,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { Contact, AIResponse, FunnelStatus } from '../../types';
import { TemperatureBadge, InfoRow, getStageIcon, openWhatsApp } from '../Common';

interface ContactDetailModalProps {
  selectedContact: Contact;
  setSelectedContact: (contact: Contact | null) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  handleUpdateContact: (contact: Contact) => void;
  conversation: string;
  setConversation: (conv: string) => void;
  handleGenerate: () => void;
  isLoading: boolean;
  aiResponse: AIResponse | null;
  setAiResponse: (res: AIResponse | null) => void;
  copyToClipboard: () => void;
  copied: boolean;
  analysisImage: string | null;
  setAnalysisImage: (img: string | null) => void;
}

export const ContactDetailModal: React.FC<ContactDetailModalProps> = ({
  selectedContact,
  setSelectedContact,
  isEditing,
  setIsEditing,
  handleUpdateContact,
  conversation,
  setConversation,
  handleGenerate,
  isLoading,
  aiResponse,
  setAiResponse,
  copyToClipboard,
  copied,
  analysisImage,
  setAnalysisImage
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnalysisImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          setSelectedContact(null);
          setAiResponse(null);
          setConversation('');
          setIsEditing(false);
        }}
        className="absolute inset-0 bg-navy/90 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl bg-navy-light p-0 shadow-[0_50px_120px_rgba(0,0,0,0.8)] rounded-3xl border border-white/10 overflow-hidden flex flex-col max-h-[95vh]"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-gold/50 to-gold" />

        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] backdrop-blur-xl">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.2)] gold-glow">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white tracking-tight leading-tight">{selectedContact.name}</h3>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Lead #{selectedContact.id.toString().slice(-4)}</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gold/60">{selectedContact.status}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all text-[9px] font-black uppercase tracking-[0.3em] border ${
                isEditing 
                  ? 'bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20 shadow-[0_10px_20px_rgba(34,197,94,0.2)]' 
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white shadow-xl'
              }`}
            >
              {isEditing ? <CheckCircle2 size={14} /> : <Edit2 size={14} />}
              {isEditing ? 'Salvar' : 'Editar'}
            </button>
            <button 
              onClick={() => {
                setSelectedContact(null);
                setAiResponse(null);
                setConversation('');
                setIsEditing(false);
              }} 
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:bg-white/10 hover:text-white transition-all duration-500 border border-white/5 shadow-xl"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Info */}
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="flex justify-between items-center px-4">
                  <label className="text-[9px] uppercase font-black tracking-[0.4em] text-white/20">Status & Temperatura</label>
                  <TemperatureBadge temperature={selectedContact.temperature} />
                </div>

                {isEditing ? (
                  <div className="space-y-5 bg-white/[0.03] p-5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-gold/50 ml-2">Nome Completo</label>
                      <input 
                        className="w-full bg-navy/40 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-all shadow-inner"
                        value={selectedContact.name}
                        onChange={e => handleUpdateContact({...selectedContact, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-gold/50 ml-2">Status do Funil</label>
                      <select 
                        className="w-full bg-navy/40 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-all shadow-inner appearance-none"
                        value={selectedContact.status}
                        onChange={e => handleUpdateContact({...selectedContact, status: e.target.value as any})}
                      >
                        <option value="Novo Contato">Novo Contato</option>
                        <option value="Agendar Visita">Agendar Visita</option>
                        <option value="Visitando">Visitando</option>
                        <option value="Proposta">Proposta</option>
                        <option value="Contrato">Contrato</option>
                        <option value="Venda">Venda</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-gold/50 ml-2">Telefone</label>
                      <input 
                        className="w-full bg-navy/40 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-all shadow-inner"
                        value={selectedContact.phone}
                        onChange={e => handleUpdateContact({...selectedContact, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-gold/50 ml-2">Orçamento</label>
                      <input 
                        className="w-full bg-navy/40 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-all shadow-inner"
                        value={selectedContact.budget}
                        onChange={e => handleUpdateContact({...selectedContact, budget: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 bg-white/[0.03] p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                    <InfoRow label="Telefone" value={selectedContact.phone} />
                    <InfoRow label="Imóvel" value={selectedContact.property} />
                    <InfoRow label="Orçamento" value={selectedContact.budget} />
                    <InfoRow label="Entrada" value={selectedContact.createdAt} />
                    <InfoRow label="Última Interação" value={selectedContact.lastInteraction} />
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <label className="text-[9px] uppercase font-black tracking-[0.4em] text-white/20 px-4">Ações Estratégicas</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => openWhatsApp(selectedContact.phone)}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-all duration-700 group shadow-2xl"
                  >
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-[0_10px_20px_rgba(34,197,94,0.3)]">
                      <MessageCircle size={20} />
                    </div>
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-[0.3em]">WhatsApp</span>
                  </button>
                  <button className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-all duration-700 group shadow-2xl">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 shadow-[0_10px_20px_rgba(59,130,246,0.3)]">
                      <Phone size={20} />
                    </div>
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em]">Ligar</span>
                  </button>
                </div>
              </div>

              {selectedContact.propertyImage && (
                <div className="space-y-5">
                  <label className="text-[9px] uppercase font-black tracking-[0.4em] text-white/20 px-4">Imóvel de Interesse</label>
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
                    <img src={selectedContact.propertyImage} alt="Property" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent flex items-end p-4">
                      <div className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 rounded-lg bg-gold/20 backdrop-blur-md flex items-center justify-center text-gold border border-gold/20">
                          <ImageIcon size={16} />
                        </div>
                        <span className="text-lg font-bold tracking-tight">{selectedContact.property}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

              {/* Right Column: AI Brain */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-gradient-to-br from-gold/15 via-gold/[0.03] to-transparent p-8 rounded-3xl border border-gold/20 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <div className="absolute -top-24 -right-24 opacity-5">
                  <BrainCircuit size={240} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gold flex items-center justify-center text-navy shadow-[0_15px_40px_rgba(212,175,55,0.5)] gold-glow">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-display font-bold text-white tracking-tight leading-tight">Especialista em Comportamento</h4>
                      <p className="text-sm text-gold/60 mt-1 font-medium">Análise psicológica de prints e conversas.</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <textarea 
                          value={conversation}
                          onChange={e => {
                            setConversation(e.target.value);
                            handleUpdateContact({...selectedContact, conversationHistory: e.target.value});
                          }}
                          placeholder="Cole aqui o histórico de conversas com o cliente..."
                          className="w-full h-48 bg-navy/40 border border-white/10 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-gold/50 transition-all resize-none placeholder:text-white/10 shadow-inner leading-relaxed backdrop-blur-md"
                        />
                        <div className="absolute bottom-4 right-6 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
                          {conversation.length} caracteres
                        </div>
                      </div>

                      <div className="relative h-48 bg-navy/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center overflow-hidden group cursor-pointer hover:border-gold/30 transition-all">
                        {analysisImage ? (
                          <>
                            <img src={analysisImage} alt="Analysis" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => setAnalysisImage(null)}
                                className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-red-500/30"
                              >
                                Remover Print
                              </button>
                            </div>
                          </>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                            <ImageIcon size={32} className="text-white/10 mb-2 group-hover:text-gold/40 transition-colors" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/20 group-hover:text-gold/40">Upload de Print</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                          </label>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleGenerate}
                      disabled={isLoading || (!conversation.trim() && !analysisImage)}
                      className="w-full py-4 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-navy font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:shadow-[0_20px_40px_rgba(212,175,55,0.4)] transition-all duration-700 disabled:opacity-30 disabled:cursor-not-allowed group flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-3 border-navy/30 border-t-navy animate-spin rounded-full" />
                          <span>Analisando Comportamento...</span>
                        </>
                      ) : (
                        <>
                          <BrainCircuit size={20} className="group-hover:rotate-12 transition-transform duration-700" />
                          <span>Analisar e Criar Resposta</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {aiResponse && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-green-500/[0.04] p-8 rounded-3xl border border-green-500/20 shadow-[0_30px_80px_rgba(0,0,0,0.4)] relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
                    
                    <div className="flex justify-between items-center mb-5 relative z-10">
                      <h4 className="font-black text-white/80 flex items-center gap-3 uppercase tracking-[0.4em] text-[9px]">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500 shadow-[0_8_20px_rgba(34,197,94,0.3)]">
                          <CheckCircle2 size={16} />
                        </div>
                        Resposta Comportamental
                      </h4>
                      <button 
                        onClick={copyToClipboard}
                        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-gold border border-gold/20 hover:bg-gold hover:text-navy transition-all duration-500 shadow-2xl"
                      >
                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        {copied ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                    <div className="relative z-10">
                      <div className="absolute -left-6 top-0 text-4xl text-green-500/10 font-serif">"</div>
                      <p className="text-lg text-white/90 leading-relaxed font-medium italic px-6">
                        {aiResponse.idealResponse}
                      </p>
                      <div className="absolute -right-6 bottom-0 text-4xl text-green-500/10 font-serif">"</div>
                    </div>
                  </div>

                  <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/10 blur-3xl rounded-full -ml-16 -mb-16" />
                    
                    <h4 className="font-black text-white/70 flex items-center gap-3 mb-5 uppercase tracking-[0.4em] text-[9px] relative z-10">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold shadow-[0_8_20_rgba(212,175,55,0.2)]">
                        <Sparkles size={16} />
                      </div>
                      Análise Psicológica & Estratégia
                    </h4>
                    <p className="text-base text-white/50 leading-relaxed font-light relative z-10 italic">
                      {aiResponse.masterStrategy}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Behavioral History Section */}
              {(selectedContact.behavioralHistory && selectedContact.behavioralHistory.length > 0) && (
                <div className="space-y-6 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-4 px-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 border border-white/10">
                      <History size={20} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Histórico de Análises Comportamentais</h4>
                  </div>

                  <div className="space-y-6">
                    {selectedContact.behavioralHistory.map((historyItem, index) => (
                      <motion.div 
                        key={historyItem.timestamp || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-8 border-l border-white/10 space-y-4"
                      >
                        <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                        
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-gold/40">
                          <Calendar size={12} />
                          {new Date(historyItem.timestamp).toLocaleString('pt-BR')}
                        </div>

                        <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 space-y-4 hover:bg-white/[0.04] transition-all group relative">
                          <div className="space-y-2">
                            <div className="text-[8px] font-black uppercase tracking-[0.3em] text-green-500/60 flex items-center gap-2">
                              <MessageCircle size={10} />
                              Resposta Sugerida
                            </div>
                            <p className="text-sm text-white/80 italic leading-relaxed">
                              "{historyItem.idealResponse}"
                            </p>
                          </div>
                          
                          <div className="pt-4 border-t border-white/5 space-y-2">
                            <div className="text-[8px] font-black uppercase tracking-[0.3em] text-gold/60 flex items-center gap-2">
                              <BrainCircuit size={10} />
                              Estratégia Mestra
                            </div>
                            <p className="text-xs text-white/40 leading-relaxed font-light">
                              {historyItem.masterStrategy}
                            </p>
                          </div>

                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(historyItem.idealResponse);
                            }}
                            className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-gold/10 text-gold hover:bg-gold hover:text-navy"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
