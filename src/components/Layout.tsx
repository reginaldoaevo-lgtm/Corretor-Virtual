import React from 'react';
import { Search, Plus, Bell, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  setIsModalOpen: (open: boolean) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, setIsModalOpen }) => {
  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-navy">
      {/* Background Blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-gold/[0.04] blur-[180px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-gold/[0.02] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[50%] h-[50%] bg-navy-light/30 blur-[120px] rounded-full pointer-events-none" />

      <header className="h-10 md:h-11 border-b border-white/10 shrink-0 bg-navy/70 backdrop-blur-3xl z-20 relative">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="relative hidden xl:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-all duration-700" size={16} />
              <input 
                type="text" 
                placeholder="Pesquisar leads, imóveis ou tarefas estratégicas..." 
                className="bg-white/[0.04] border border-white/10 rounded-[20px] py-2.5 pl-10 pr-6 focus:outline-none focus:border-gold/40 w-[320px] text-xs transition-all duration-700 focus:bg-white/[0.08] placeholder:text-white/20 font-medium text-white shadow-xl backdrop-blur-md"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2 md:gap-3">
              <button className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-white/30 hover:text-gold hover:bg-white/10 rounded-lg transition-all duration-700 border border-transparent hover:border-white/10 relative group">
                <Bell size={18} className="group-hover:rotate-12 transition-transform duration-500" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-gold rounded-full border-2 border-navy shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
              </button>
              <button className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-white/30 hover:text-gold hover:bg-white/10 rounded-lg transition-all duration-700 border border-transparent hover:border-white/10 group">
                <Settings size={18} className="group-hover:rotate-90 transition-transform duration-1000" />
              </button>
            </div>
            
            <div className="h-6 w-px bg-white/10 mx-1 hidden md:block" />

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-br from-gold-light via-gold to-gold-dark text-navy font-black text-[9px] uppercase tracking-[0.2em] py-2.5 px-5 md:px-7 rounded-xl hover:bg-white transition-all duration-700 shadow-[0_10px_25px_rgba(212,175,55,0.2)] flex items-center gap-2 hover:scale-[1.05] active:scale-[0.95] border border-white/20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <Plus size={16} strokeWidth={4} className="group-hover:rotate-90 transition-transform duration-700" /> 
              <span className="hidden sm:inline">Novo Lead Radar</span>
              <span className="sm:hidden">Novo</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6 md:pt-4 max-w-[1920px] mx-auto w-full overflow-hidden flex flex-col relative z-10">
        {children}
      </div>
    </main>
  );
};
