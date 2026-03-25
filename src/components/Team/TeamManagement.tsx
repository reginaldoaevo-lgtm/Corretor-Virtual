import React from 'react';
import { 
  ShieldCheck, 
  X,
  Plus,
  ChevronDown,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../../types';

interface TeamManagementProps {
  teamMembers: User[];
  addTeamMember: (member: Omit<User, 'id'>) => void;
  deleteTeamMember: (id: string) => void;
  newMember: any;
  setNewMember: (member: any) => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({
  teamMembers,
  addTeamMember,
  deleteTeamMember,
  newMember,
  setNewMember
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full space-y-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 via-gold/10 to-transparent flex items-center justify-center text-gold border border-gold/30 shadow-[0_10px_30px_rgba(212,175,55,0.2)] gold-glow relative z-10">
              <ShieldCheck size={24} className="drop-shadow-lg" />
            </div>
            <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full opacity-50" />
          </div>
          <div>
            <h2 className="text-xl font-display font-black text-white tracking-tighter leading-tight">Gestão de <span className="text-gradient-gold">Equipe Elite</span></h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-px w-6 bg-gold/30" />
              <p className="text-sm text-white/40 font-medium">Controle de acessos e permissões para sua força de vendas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
        <div className="lg:col-span-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="glass-dark p-5 space-y-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative overflow-hidden rounded-2xl border border-white/10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full -mr-24 -mt-24 blur-[80px]" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-inner">
                  <Plus size={20} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white tracking-tighter">Novo Corretor</h3>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-white/20 font-black mt-0.5">Expanda sua força de elite</p>
                </div>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  addTeamMember({ ...newMember, status: 'Ativo' });
                  setNewMember({ name: '', email: '', password: '', role: 'premium' });
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gold/60 ml-2">Nome Completo</label>
                  <input 
                    type="text" 
                    required
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-gold/50 transition-all hover:bg-white/[0.08] placeholder:text-white/10 font-bold shadow-inner backdrop-blur-xl"
                    placeholder="Ex: Ricardo Santos"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gold/60 ml-2">E-mail de Acesso</label>
                  <input 
                    type="email" 
                    required
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-gold/50 transition-all hover:bg-white/[0.08] placeholder:text-white/10 font-bold shadow-inner backdrop-blur-xl"
                    placeholder="Ex: ricardo@imobiliaria.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gold/60 ml-2">Senha Inicial</label>
                  <input 
                    type="password" 
                    required
                    value={newMember.password}
                    onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-gold/50 transition-all hover:bg-white/[0.08] placeholder:text-white/10 font-bold shadow-inner backdrop-blur-xl"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gold/60 ml-2">Nível de Acesso</label>
                  <div className="relative group">
                    <select 
                      value={newMember.role}
                      onChange={(e) => setNewMember({...newMember, role: e.target.value as any})}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-gold/50 transition-all appearance-none cursor-pointer hover:bg-white/[0.08] font-black shadow-inner backdrop-blur-xl pr-12"
                    >
                      <option value="premium" className="bg-navy">Corretor Premium</option>
                      <option value="elite" className="bg-navy">Corretor Elite</option>
                      <option value="admin" className="bg-navy">Gestor / Admin</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none group-focus-within:text-gold transition-colors" />
                  </div>
                </div>
                <button type="submit" className="w-full py-2 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-navy font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:bg-white hover:text-navy transition-all duration-700 shadow-[0_15px_35px_rgba(212,175,55,0.3)] mt-6 hover:scale-[1.03] active:scale-[0.97] border border-white/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                  Ativar no Sistema Elite
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 overflow-y-auto custom-scrollbar pr-2">
          <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-md min-h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-inner">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white tracking-tighter">Corretores Ativos</h3>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-white/20 font-black mt-0.5">Gestão de performance e acessos</p>
                </div>
              </div>
              <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 shadow-xl">
                Total: <span className="text-gold text-base ml-1.5">{teamMembers.length}</span>
              </div>
            </div>

            <div className="space-y-3">
              {teamMembers.map((member) => (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-dark p-4 flex items-center justify-between group relative overflow-hidden shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-700 hover:border-gold/30 rounded-xl"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-gold/60 to-gold/20 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center text-gold font-black text-lg border border-gold/10 shadow-inner group-hover:bg-gold group-hover:text-navy transition-all duration-700 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-base text-white group-hover:text-gold transition-colors duration-700 tracking-tighter">{member.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-white/30 font-medium">{member.email}</p>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[8px] uppercase font-black tracking-[0.1em] text-gold/40">
                          ID: {member.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="hidden md:flex flex-col items-end gap-2">
                      <span className="px-4 py-1.5 rounded-xl bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-[0.2em] border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                        {member.status}
                      </span>
                      <span className="text-[9px] uppercase font-black text-gold/60 tracking-[0.3em] flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-gold/40" />
                        {member.role === 'admin' ? 'Gestor Master' : 
                         member.role === 'elite' ? 'Corretor Elite' : 
                         'Corretor Premium'}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteTeamMember(member.id)}
                      className="w-8 h-8 rounded-lg bg-red-500/5 flex items-center justify-center text-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-700 opacity-0 group-hover:opacity-100 border border-red-500/10 hover:border-red-500 shadow-2xl hover:scale-110 active:scale-90"
                    >
                      <X size={16} strokeWidth={3} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
