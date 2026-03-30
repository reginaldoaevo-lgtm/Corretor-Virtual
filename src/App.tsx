import React, { useState } from 'react';
import { 
  BrainCircuit, Sparkles, TrendingUp, Users, 
  ChevronRight, LayoutDashboard, MessageSquare, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURAÇÃO DE DESIGN (ESTILO STUDIO) ---
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [geminiStatus] = useState('connected');
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  
  // Dados simulados para o visual aparecer na hora
  const contacts = [
    { id: 1, name: "Maria José", property_interest: "Opus Ayra", vgv: 1200000 },
    { id: 2, name: "Sônia", property_interest: "Lifa Áurea", vgv: 850000 }
  ];

  const globalAnalyses = [
    {
      contactName: "Maria José",
      observation: "Demonstra alto interesse em acabamento de luxo e prazos de entrega.",
      behavioralSummary: "Perfil decidido, prioriza segurança e exclusividade.",
      nextAction: "Enviar convite para visita exclusiva ao decorado neste sábado.",
      contactId: 1
    }
  ];

  const handleGlobalAnalysis = () => {
    setIsGlobalLoading(true);
    setTimeout(() => setIsGlobalLoading(false), 2000);
  };

  return (
    <div className="flex h-screen bg-[#050506] text-white overflow-hidden font-sans">
      
      {/* SIDEBAR SLIM (Studio Style) */}
      <aside className="w-20 lg:w-64 bg-[#09090b] border-r border-white/5 flex flex-col p-6">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(234,179,8,0.3)]">R</div>
          <h1 className="hidden lg:block font-black text-xl tracking-tighter uppercase">Radar<span className="text-yellow-500">CRM</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-yellow-500/10 text-yellow-500 border-l-2 border-yellow-500' : 'text-gray-500 hover:bg-white/5'}`}>
            <LayoutDashboard size={20} /> <span className="hidden lg:block">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('ai')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'ai' ? 'bg-yellow-500/10 text-yellow-500 border-l-2 border-yellow-500' : 'text-gray-500 hover:bg-white/5'}`}>
            <BrainCircuit size={20} /> <span className="hidden lg:block">Especialista AI</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER COM STATUS */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#050506]/80 backdrop-blur-md">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                <input type="text" placeholder="Buscar no radar..." className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-yellow-500/30" />
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">AI Online</span>
             </div>
             <p className="text-yellow-500 font-black text-sm">R$ {leadsTotalVGV(contacts)}</p>
          </div>
        </header>

        {/* ÁREA DE CONTEÚDO DINÂMICO (O código que você enviou vai aqui) */}
        <section className="flex-1 overflow-y-auto p-10">
          <AnimatePresence mode="wait">
            {activeTab === 'ai' ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl mx-auto space-y-8"
              >
                {/* CABEÇALHO DA IA */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-600/20 to-transparent flex items-center justify-center text-yellow-500 border border-yellow-500/30 shadow-lg">
                      <BrainCircuit size={28} className="animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tighter">Especialista em <span className="text-yellow-500">Comportamento</span></h2>
                      <p className="text-xs text-white/40 font-medium">Análise psicológica e estratégica de leads para Reginaldo Magalhães</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleGlobalAnalysis}
                    className="px-6 py-3 bg-yellow-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl flex items-center gap-2"
                  >
                    {isGlobalLoading ? "Processando..." : "Análise Comportamental Global"}
                  </button>
                </div>

                {/* CARDS DE ANÁLISE */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {globalAnalyses.map((item, index) => (
                    <div key={index} className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] hover:border-yellow-500/30 transition-all group relative overflow-hidden">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                          <TrendingUp size={20} />
                        </div>
                        <h3 className="font-black text-xl text-white group-hover:text-yellow-500 transition-colors">{item.contactName}</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-[8px] font-black uppercase text-yellow-500/50 block mb-1 tracking-widest">Observação Radar</span>
                          <p className="text-sm text-white/60 leading-relaxed italic">"{item.observation}"</p>
                        </div>
                        <div className="bg-white/[0.03] p-4 rounded-xl border border-yellow-500/10">
                          <span className="text-[8px] font-black uppercase text-yellow-500/70 block mb-1 tracking-widest">Próxima Ação</span>
                          <p className="text-sm text-white font-bold">{item.nextAction}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* DASHBOARD PADRÃO */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {contacts.map(contact => (
                    <div key={contact.id} className="bg-[#121214] border border-white/5 p-6 rounded-2xl">
                       <p className="text-[10px] text-yellow-500 font-bold uppercase mb-2">{contact.property_interest}</p>
                       <h4 className="font-bold text-lg">{contact.name}</h4>
                       <p className="text-xs text-gray-500 mt-4">VGV Estimado: R$ {contact.vgv.toLocaleString('pt-BR')}</p>
                    </div>
                 ))}
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

// Função auxiliar para VGV
const leadsTotalVGV = (leads: any[]) => leads.reduce((acc, curr) => acc + curr.vgv, 0).toLocaleString('pt-BR');

export default App;
