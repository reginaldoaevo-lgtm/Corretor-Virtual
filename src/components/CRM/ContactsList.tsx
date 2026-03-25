import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  ImageIcon,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { Contact, Temperature } from '../../types';
import { TemperatureBadge, openWhatsApp } from '../Common';

interface ContactsListProps {
  contacts: Contact[];
  setSelectedContact: (contact: Contact) => void;
  handleDeleteLead: (id: string, e: React.MouseEvent) => void;
  setIsModalOpen: (open: boolean) => void;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  setSelectedContact,
  handleDeleteLead,
  setIsModalOpen
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tempFilter, setTempFilter] = useState<Temperature | 'Todos'>('Todos');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.property.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTemp = tempFilter === 'Todos' || contact.temperature === tempFilter;
    
    return matchesSearch && matchesTemp;
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <motion.div 
      key="contacts-list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col space-y-8"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex items-center gap-8">
          <div className="w-16 h-16 rounded-[28px] bg-gradient-to-br from-gold/30 to-gold/5 flex items-center justify-center text-gold border border-gold/30 shadow-[0_15px_40px_rgba(212,175,55,0.2)] gold-glow">
            <Users size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-display font-black text-white tracking-tight leading-tight">Base de <span className="text-gradient-gold">Leads Elite</span></h2>
            <p className="text-base text-white/30 mt-1.5 font-medium">Gerencie todos os seus leads estratégicos em um só lugar.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full lg:w-auto px-8 py-4 bg-gradient-to-br from-gold-light via-gold to-gold-dark text-navy font-black text-xs uppercase tracking-[0.4em] rounded-[24px] hover:shadow-[0_15px_30px_rgba(212,175,55,0.4)] hover:scale-[1.05] active:scale-[0.95] transition-all duration-700 flex items-center justify-center gap-4 shadow-2xl"
        >
          <Plus size={20} strokeWidth={4} /> Novo Lead de Elite
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gold/50 group-focus-within:text-gold transition-colors duration-500" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome, telefone ou imóvel..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-[24px] py-4 pl-16 pr-10 text-base focus:outline-none focus:border-gold/50 transition-all duration-700 hover:bg-white/[0.08] placeholder:text-white/20 font-medium shadow-2xl backdrop-blur-xl"
          />
        </div>
        
        <div className="relative min-w-[300px] group">
          <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-gold/50 group-focus-within:text-gold transition-colors duration-500" size={20} />
          <select 
            value={tempFilter}
            onChange={(e) => setTempFilter(e.target.value as any)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-[24px] py-4 pl-16 pr-12 text-base focus:outline-none focus:border-gold/50 appearance-none cursor-pointer transition-all duration-700 hover:bg-white/[0.08] font-bold text-white/80 shadow-2xl backdrop-blur-xl"
          >
            <option value="Todos" className="bg-navy">Todas as Temperaturas</option>
            <option value="Frio" className="bg-navy">❄️ Leads Frios</option>
            <option value="Morno" className="bg-navy">⛅ Leads Mornos</option>
            <option value="Quente" className="bg-navy">🔥 Leads Quentes</option>
          </select>
          <Plus className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 rotate-45 pointer-events-none" size={20} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar pb-12">
        {sortedContacts.length > 0 ? (
          sortedContacts.map((contact) => (
            <motion.div 
              key={contact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedContact(contact)}
              className="card-premium p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between group relative overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-gold via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000" />
              
              <div className="flex items-center gap-8 mb-8 lg:mb-0">
                <div className="relative">
                  <div className="w-16 h-16 rounded-[24px] bg-gold/10 flex items-center justify-center text-gold font-black text-2xl border border-gold/20 group-hover:bg-gold group-hover:text-navy transition-all duration-700 shadow-2xl">
                    {contact.name.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full border-3 border-navy flex items-center justify-center shadow-2xl ${
                    contact.temperature === 'Quente' ? 'bg-red-500' : 
                    contact.temperature === 'Morno' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
                  </div>
                </div>
                <div>
                  <h4 className="font-display font-bold text-xl text-white group-hover:text-gold transition-colors duration-700 tracking-tight leading-tight">{contact.name}</h4>
                  <div className="flex flex-wrap items-center gap-6 mt-3">
                    <span className="text-sm text-white/30 flex items-center gap-3 font-medium tracking-tight">
                      <Phone size={16} className="text-gold/40" /> {contact.phone}
                    </span>
                    <span className="text-sm text-white/30 flex items-center gap-3 font-medium tracking-tight">
                      <ImageIcon size={16} className="text-gold/40" /> {contact.property}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full lg:w-auto gap-12">
                <div className="flex flex-col items-end">
                  <span className="text-xl font-black text-gold tracking-tighter drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">{contact.budget}</span>
                  <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em] mt-2">{contact.status}</span>
                </div>
                
                <TemperatureBadge temperature={contact.temperature} />
                
                <div className="flex gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openWhatsApp(contact.phone);
                    }}
                    className="w-12 h-12 flex items-center justify-center bg-white/[0.03] hover:bg-green-500/20 rounded-[18px] text-white/20 hover:text-green-500 transition-all duration-700 border border-white/5 hover:border-green-500/20 shadow-2xl hover:scale-115 active:scale-90"
                    title="WhatsApp"
                  >
                    <Phone size={20} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLead(contact.id, e);
                    }}
                    className="w-12 h-12 flex items-center justify-center bg-white/[0.03] hover:bg-red-500/20 rounded-[18px] text-white/20 hover:text-red-500 transition-all duration-700 border border-white/5 hover:border-red-500/20 opacity-0 group-hover:opacity-100 shadow-2xl hover:scale-115 active:scale-90"
                    title="Excluir"
                  >
                    <Plus size={24} className="rotate-45" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-48 text-white/10 bg-white/[0.02] rounded-[48px] border border-dashed border-white/5 backdrop-blur-xl">
            <Users size={80} className="mb-8 opacity-5" />
            <p className="text-base font-black uppercase tracking-[0.5em] text-white/20">Nenhum lead estratégico encontrado</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
