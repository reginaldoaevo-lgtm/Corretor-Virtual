import React from 'react';
import { 
  X, 
  UserCircle,
  ChevronDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../../types';

interface SwitchUserModalProps {
  isSwitchingUser: boolean;
  setIsSwitchingUser: (show: boolean) => void;
  teamMembers: User[];
  currentUser: User;
  selectedUserToSwitch: User | null;
  setSelectedUserToSwitch: (user: User | null) => void;
  switchPassword: string;
  setSwitchPassword: (pass: string) => void;
  handleConfirmSwitch: () => void;
}

export const SwitchUserModal: React.FC<SwitchUserModalProps> = ({
  isSwitchingUser,
  setIsSwitchingUser,
  teamMembers,
  currentUser,
  selectedUserToSwitch,
  setSelectedUserToSwitch,
  switchPassword,
  setSwitchPassword,
  handleConfirmSwitch
}) => {
  if (!isSwitchingUser) return null;

  const allUsers = [
    {
      id: 'admin-default',
      name: 'Reginaldo Magalhaes',
      email: 'reginaldo@radar.com',
      role: 'admin' as const,
      status: 'Ativo' as const,
      password: 'admin'
    },
    ...teamMembers
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/95 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="w-full max-w-lg bg-navy-light border border-white/10 rounded-[64px] shadow-[0_50px_120px_rgba(0,0,0,0.9)] overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-gold via-gold/50 to-gold" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="p-12 border-b border-white/5 flex justify-between items-center bg-white/[0.02] relative z-10 backdrop-blur-3xl">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-[0_15px_40px_rgba(212,175,55,0.2)] gold-glow">
              <UserCircle size={36} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-3xl font-display font-black text-white tracking-tighter">Trocar <span className="text-gradient-gold">Perfil</span></h3>
              <p className="text-xs text-white/30 font-black uppercase tracking-[0.3em] mt-1">Acesso Estratégico</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsSwitchingUser(false);
              setSelectedUserToSwitch(null);
              setSwitchPassword('');
            }}
            className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-white/20 hover:bg-red-500/20 hover:text-red-500 transition-all duration-500 border border-white/5 hover:border-red-500/20 shadow-xl hover:rotate-90"
          >
            <X size={32} strokeWidth={3} />
          </button>
        </div>

        <div className="p-12 relative z-10">
          {!selectedUserToSwitch ? (
            <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] mb-10 ml-2 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                Selecione o perfil radar:
              </p>
              {allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserToSwitch(user)}
                  className={`w-full flex items-center gap-8 p-10 rounded-[40px] border transition-all duration-700 text-left group relative overflow-hidden ${
                    currentUser.id === user.id 
                      ? 'bg-gold/10 border-gold/50 shadow-[0_20px_50px_rgba(212,175,55,0.2)]' 
                      : 'bg-white/[0.03] border-white/5 hover:border-gold/40 hover:bg-white/[0.08] shadow-2xl'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center font-black text-3xl border transition-all duration-700 shadow-2xl relative z-10 ${
                    currentUser.id === user.id 
                      ? 'bg-gradient-to-br from-gold-light to-gold-dark text-navy border-gold/50' 
                      : 'bg-gold/10 text-gold border-gold/20 group-hover:bg-gold group-hover:text-navy'
                  }`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 relative z-10">
                    <h4 className="font-display font-black text-2xl text-white group-hover:text-gold transition-colors duration-700 tracking-tight leading-tight">{user.name}</h4>
                    <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gold/40" />
                      {user.role === 'admin' ? 'Gestor Master' : 
                       user.role === 'elite' ? 'Corretor Radar' : 
                       'Corretor Premium'}
                    </p>
                  </div>
                  {currentUser.id === user.id && (
                    <span className="text-[10px] font-black text-navy bg-gold px-5 py-2 rounded-2xl border border-white/20 shadow-xl relative z-10">ATUAL</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              <button 
                onClick={() => setSelectedUserToSwitch(null)}
                className="text-[11px] font-black uppercase tracking-[0.4em] text-gold hover:text-white flex items-center gap-4 transition-all duration-700 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-gold/10 flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-all duration-500 shadow-lg">
                  <X size={18} className="rotate-45" strokeWidth={3} />
                </div>
                Voltar para a lista estratégica
              </button>
              
              <div className="text-center space-y-8">
                <div className="relative inline-block">
                  <div className="w-40 h-40 rounded-[48px] bg-gradient-to-br from-gold/20 to-gold/5 text-gold flex items-center justify-center text-6xl font-black mx-auto border-2 border-gold/30 shadow-[0_30px_70px_rgba(212,175,55,0.3)] gold-glow relative z-10">
                    {selectedUserToSwitch.name.charAt(0)}
                  </div>
                  <div className="absolute inset-0 bg-gold/20 blur-[60px] rounded-full opacity-50" />
                </div>
                <div>
                  <h4 className="text-4xl font-display font-black text-white tracking-tighter leading-tight">{selectedUserToSwitch.name}</h4>
                  <p className="text-lg text-white/30 mt-3 font-medium">Autenticação Radar Requerida</p>
                </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-5">
                  <label className="block text-[11px] font-black uppercase tracking-[0.5em] text-gold/60 ml-3">Senha de Acesso Mestre</label>
                  <input 
                    type="password"
                    autoFocus
                    value={switchPassword}
                    onChange={(e) => setSwitchPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConfirmSwitch()}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[32px] p-8 text-center text-5xl tracking-[0.8em] focus:outline-none focus:border-gold/50 transition-all duration-700 hover:bg-white/[0.08] shadow-inner font-black text-white backdrop-blur-xl"
                  />
                </div>
                <button 
                  onClick={handleConfirmSwitch}
                  className="w-full py-8 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-navy font-black text-sm uppercase tracking-[0.5em] rounded-[32px] hover:bg-white transition-all duration-700 shadow-[0_30px_60px_rgba(212,175,55,0.4)] hover:scale-[1.03] active:scale-[0.97] border border-white/20 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                  Confirmar Login Radar
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
