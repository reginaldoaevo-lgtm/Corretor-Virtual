import React from 'react';
import { 
  LayoutDashboard, Users, MessageSquare, 
  Settings, Bell, Search, Plus, RefreshCw,
  LogOut, ShieldCheck, Headphones
} from 'lucide-react';

function App() {
  return (
    <div className="flex h-screen bg-[#0a0a0b] text-white overflow-hidden font-sans">
      
      {/* Sidebar - Menu Lateral */}
      <aside className="w-64 bg-[#0d0d0f] border-r border-white/5 flex flex-col p-6">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xl">R</div>
          <div>
            <h1 className="font-bold text-xl leading-tight">RADAR<span className="text-yellow-500">CRM</span></h1>
            <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Strategic Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-yellow-500/10 text-yellow-500 rounded-xl font-medium">
            <LayoutDashboard size={20} /> Gestão de Leads
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
            <Users size={20} /> Base de Leads
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all">
            <MessageSquare size={20} /> Conversas AI
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-xs font-bold text-yellow-500">R</div>
            <div>
              <p className="text-sm font-semibold leading-none">Reginaldo Magalhaes</p>
              <p className="text-[10px] text-yellow-500/70 mt-1">GESTOR MASTER</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 text-xs text-yellow-500/80 hover:text-yellow-500 px-2 uppercase tracking-wider font-bold">
            <ShieldCheck size={14} /> Gestão de Equipe
          </button>
          <button className="w-full flex items-center gap-2 text-xs text-green-500/80 hover:text-green-500 px-2 uppercase tracking-wider font-bold">
            <Headphones size={14} /> Suporte Radar
          </button>
        </div>
      </aside>

      {/* Main Content - Área de Gestão */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Superior */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0a0b]/80 backdrop-blur-md">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
             <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type="text" placeholder="Buscar lead..." className="w-full bg-[#161618] border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-yellow-500/50 transition-all" />
             </div>
             <select className="bg-[#161618] border border-white/5 rounded-lg py-2 px-4 text-sm text-gray-400 outline-none">
                <option>Temperaturas</option>
             </select>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">VGV TOTAL</p>
                <p className="text-yellow-500 font-bold">R$ 0</p>
              </div>
              <div className="text-right border-l border-white/10 pl-4">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">TICKET MÉDIO</p>
                <p className="text-yellow-500 font-bold">R$ 0</p>
              </div>
            </div>
            <button className="bg-yellow-500 text-black px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-yellow-400 transition-all uppercase tracking-tighter">
              <Plus size={18} /> Novo Lead Radar
            </button>
          </div>
        </header>

        {/* Board - Colunas de Kanban */}
        <section className="flex-1 overflow-x-auto p-8 flex gap-6">
          
          {/* Coluna 1 */}
          <div className="min-w-[320px] w-80 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                <h3 className="font-bold text-xs uppercase tracking-widest">Novo Contato</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-600 hover:text-white"><Plus size={14} /></button>
                <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded-full">0</span>
              </div>
            </div>
            <div className="flex-1 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-gray-600">
               <Users size={40} className="mb-4 opacity-10" />
               <p className="text-[10px] uppercase tracking-[0.2em] font-medium leading-relaxed">Arraste leads para esta etapa estratégica</p>
            </div>
          </div>

          {/* Coluna 2 */}
          <div className="min-w-[320px] w-80 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-50"></div>
                <h3 className="font-bold text-xs uppercase tracking-widest">Agendar Visita</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-600 hover:text-white"><Plus size={14} /></button>
                <span className="bg-white/5 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">0</span>
              </div>
            </div>
            <div className="flex-1 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-gray-600">
               <p className="text-[10px] uppercase tracking-[0.2em] font-medium leading-relaxed">Arraste leads para esta etapa estratégica</p>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

export default App;
