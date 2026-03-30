import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, MessageSquare, Search, Plus, 
  RefreshCw, ShieldCheck, Headphones, Bell, Settings,
  Calendar, ChevronRight, Zap, Filter
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Conexão com o Supabase usando suas variáveis da Vercel
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

function App() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setLeads(data || []);
    } catch (err) {
      console.error("Erro ao carregar leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.property_interest?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-[#e1e1e1] font-sans">
      
      {/* Sidebar Slim (Estilo Studio) */}
      <aside className="w-20 lg:w-64 bg-[#111111] border-r border-[#222] flex flex-col items-center lg:items-start py-6 transition-all">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-black font-bold">R</div>
          <h1 className="hidden lg:block font-bold tracking-tight text-lg">RADAR<span className="text-yellow-500 text-sm ml-1">PRO</span></h1>
        </div>

        <nav className="flex-1 w-full px-3 space-y-2">
          <button className="w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 bg-yellow-500 text-black rounded-lg font-semibold shadow-lg shadow-yellow-500/10">
            <LayoutDashboard size={20} /> <span className="hidden lg:block">Dashboard</span>
          </button>
          <button className="w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 text-gray-400 hover:bg-[#1a1a1a] rounded-lg transition-all">
            <Users size={20} /> <span className="hidden lg:block">Leads</span>
          </button>
          <button className="w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 text-gray-400 hover:bg-[#1a1a1a] rounded-lg transition-all">
            <MessageSquare size={20} /> <span className="hidden lg:block">Conversas AI</span>
          </button>
        </nav>

        <div className="px-4 w-full mt-auto space-y-2 border-t border-[#222] pt-6">
           <button onClick={fetchLeads} className="w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 text-gray-400 hover:text-yellow-500 transition-colors">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> <span className="hidden lg:block text-xs uppercase font-bold tracking-wider">Sincronizar</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-[#0d0d0d]">
        
        {/* Header Superior Limpo */}
        <header className="h-16 border-b border-[#222] flex items-center justify-between px-8 bg-[#0d0d0d]">
          <div className="flex items-center gap-4 w-1/3">
             <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                <input 
                  type="text" 
                  placeholder="Filtrar por nome ou interesse..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#161616] border border-[#222] rounded-md py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-yellow-500/50 transition-all" 
                />
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-gray-500 uppercase font-bold">VGV Estimado</p>
              <p className="text-yellow-500 font-bold tracking-tight">R$ {leads.reduce((a, b) => a + (b.vgv || 0), 0).toLocaleString('pt-BR')}</p>
            </div>
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-bold text-xs flex items-center gap-2 transition-all">
              <Plus size={16} /> NOVO LEAD
            </button>
          </div>
        </header>

        {/* Board - Colunas Slim */}
        <section className="flex-1 overflow-x-auto p-6 flex gap-6">
          
          {/* Coluna Kanban */}
          <div className="min-w-[300px] w-72 flex flex-col h-full bg-[#111111]/50 rounded-lg border border-[#222]">
            <div className="p-4 flex items-center justify-between border-b border-[#222]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                <h3 className="font-bold text-xs uppercase tracking-wider">Entrada</h3>
              </div>
              <span className="text-[10px] font-bold text-gray-500">{filteredLeads.length}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
               {filteredLeads.map(lead => (
                 <div key={lead.id} className="bg-[#1a1a1a] p-4 rounded-md border border-[#262626] hover:border-yellow-500/50 transition-all cursor-pointer group shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded font-bold">NOVO</span>
                      <p className="text-gray-500 text-[10px] font-mono">#{lead.id?.toString().slice(-4)}</p>
                    </div>
                    <h4 className="font-bold text-sm text-gray-100 group-hover:text-yellow-500 transition-colors">{lead.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 mb-3">{lead.property_interest || 'Interesse não definido'}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[#222]">
                       <p className="text-xs font-bold text-gray-300">R$ {lead.vgv?.toLocaleString('pt-BR') || '0'}</p>
                       <ChevronRight size={14} className="text-gray-600 group-hover:text-yellow-500 transition-all" />
                    </div>
                 </div>
               ))}
               
               {filteredLeads.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                    <Zap size={32} />
                    <p className="text-[10px] uppercase font-bold mt-2">Aguardando dados</p>
                 </div>
               )}
            </div>
          </div>

          {/* Coluna Placeholder (Filtro Studio) */}
          <div className="min-w-[300px] w-72 flex flex-col h-full border border-dashed border-[#222] rounded-lg opacity-40">
             <div className="p-4 flex items-center gap-2 text-xs font-bold text-gray-600">
                <Filter size={14} /> FILTRO ESTRATÉGICO
             </div>
          </div>

        </section>
      </main>
    </div>
  );
}

export default App;
