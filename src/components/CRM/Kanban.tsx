import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Plus, 
  Search, 
  ArrowRight,
  RefreshCw,
  Filter,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  DndContext, 
  closestCorners, 
  DragStartEvent, 
  DragEndEvent,
  DragOverlay,
  useDroppable
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { Contact, FunnelStatus, Temperature } from '../../types';
import { SortableContactCard, ContactCard } from './ContactCards';

const FUNNEL_STAGES: FunnelStatus[] = [
  'Novo Contato',
  'Agendar Visita',
  'Visitando',
  'Proposta',
  'Contrato',
  'Venda'
];

interface KanbanColumnProps {
  stage: FunnelStatus;
  stageContacts: Contact[];
  contacts: Contact[];
  pullingStage: FunnelStatus | null;
  setPullingStage: (stage: FunnelStatus | null) => void;
  pullSearch: string;
  setPullSearch: (search: string) => void;
  updateLeadStatus: (id: string, status: FunnelStatus) => void;
  setSelectedContact: (contact: Contact) => void;
  handleDeleteLead: (id: string, e: React.MouseEvent) => void;
  parseBudget: (budget: string) => number;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage,
  stageContacts,
  contacts,
  pullingStage,
  setPullingStage,
  pullSearch,
  setPullSearch,
  updateLeadStatus,
  setSelectedContact,
  handleDeleteLead,
  parseBudget
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  const stageTotal = stageContacts.reduce((acc, c) => acc + parseBudget(c.budget), 0);

  return (
    <div 
      ref={setNodeRef}
      className={`flex-shrink-0 w-[280px] flex flex-col h-full group/column relative transition-colors duration-300 rounded-2xl ${isOver ? 'bg-gold/[0.05] ring-2 ring-gold/20' : ''}`}
    >
      <div className="glass-dark p-2 px-3 mb-1.5 shrink-0 group-hover/column:bg-navy-light/70 transition-all duration-700 relative overflow-hidden border border-white/10 shadow-lg rounded-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold/80 via-gold/20 to-transparent opacity-50" />
        
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)] animate-pulse" />
            <h3 className="font-black text-[9px] uppercase tracking-[0.2em] text-white leading-none">{stage}</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setPullingStage(pullingStage === stage ? null : stage)}
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-500 border ${
                pullingStage === stage 
                  ? 'bg-gold text-navy border-gold shadow-lg' 
                  : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-gold hover:border-gold/30'
              }`}
              title="Puxar lead para esta etapa"
            >
              <Plus size={10} />
            </button>
            <span className="text-[8px] font-black text-gold bg-gold/10 px-1 py-0.5 rounded-md border border-gold/30 shadow-inner">
              {stageContacts.length}
            </span>
          </div>
        </div>

        {pullingStage === stage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 space-y-2"
          >
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gold/40" size={12} />
              <input 
                type="text"
                placeholder="Puxar lead..."
                value={pullSearch}
                onChange={(e) => setPullSearch(e.target.value)}
                className="w-full bg-navy/60 border border-gold/20 rounded-lg py-1.5 pl-8 pr-3 text-[9px] focus:outline-none focus:border-gold/50 text-white placeholder:text-white/20"
                autoFocus
              />
            </div>
            <div className="max-h-[150px] overflow-y-auto custom-scrollbar space-y-1">
              {contacts
                .filter(c => c.status !== stage && (
                  c.name.toLowerCase().includes(pullSearch.toLowerCase()) ||
                  c.property.toLowerCase().includes(pullSearch.toLowerCase())
                ))
                .slice(0, 5)
                .map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      updateLeadStatus(c.id, stage);
                      setPullingStage(null);
                      setPullSearch('');
                    }}
                    className="w-full flex items-center justify-between p-1.5 rounded-md bg-white/5 hover:bg-gold/10 border border-white/5 hover:border-gold/20 transition-all group/item"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-[9px] font-bold text-white group-hover/item:text-gold transition-colors">{c.name}</span>
                      <span className="text-[7px] text-white/30 uppercase tracking-tighter">{c.status}</span>
                    </div>
                    <ArrowRight size={10} className="text-gold/40 group-hover/item:text-gold" />
                  </button>
                ))
              }
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            {stageContacts.slice(0, 5).map((c) => (
              <div key={c.id} className="w-6 h-6 rounded-lg bg-navy-light border border-white/20 flex items-center justify-center text-[9px] font-black text-gold shadow-2xl hover:z-10 hover:scale-110 transition-all duration-500 cursor-pointer">
                {c.name.charAt(0)}
              </div>
            ))}
            {stageContacts.length > 5 && (
              <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-[8px] font-black text-white/40 backdrop-blur-md">
                +{stageContacts.length - 5}
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-0">VGV Estimado</p>
            <span className="text-sm font-black text-white tracking-tighter drop-shadow-lg">
              {stageTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>
      
      <SortableContext 
        id={stage}
        items={stageContacts.map(c => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-4 custom-scrollbar min-h-[250px] p-1">
          {stageContacts.map(contact => (
            <SortableContactCard 
              key={contact.id} 
              contact={contact} 
              onClick={() => setSelectedContact(contact)}
              onDelete={(e) => handleDeleteLead(contact.id, e)}
            />
          ))}
          {stageContacts.length === 0 && (
            <div className="flex-1 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/10 p-8 transition-all duration-1000 hover:border-gold/30 hover:bg-gold/[0.03] group/empty relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.01] to-transparent opacity-0 group-hover/empty:opacity-100 transition-opacity duration-1000" />
              <Users size={40} className="mb-4 opacity-5 group-hover/empty:opacity-20 transition-all duration-1000 group-hover/empty:scale-110" />
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-center opacity-30 group-hover/empty:opacity-60 transition-opacity duration-1000">Arraste leads para esta etapa estratégica</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

interface KanbanProps {
  contacts: Contact[];
  sensors: any;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  activeId: string | null;
  setSelectedContact: (contact: Contact) => void;
  handleDeleteLead: (id: string, e: React.MouseEvent) => void;
  updateLeadStatus: (id: string, status: FunnelStatus) => void;
}

export const Kanban: React.FC<KanbanProps> = ({
  contacts,
  sensors,
  handleDragStart,
  handleDragEnd,
  activeId,
  setSelectedContact,
  handleDeleteLead,
  updateLeadStatus
}) => {
  const [tempFilter, setTempFilter] = useState<Temperature | 'Todos'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [pullingStage, setPullingStage] = useState<FunnelStatus | null>(null);
  const [pullSearch, setPullSearch] = useState('');

  const handleResetPipeline = () => {
    contacts.forEach(c => {
      if (c.status !== 'Novo Contato') {
        updateLeadStatus(c.id, 'Novo Contato');
      }
    });
  };

  const parseBudget = (budget: string) => {
    const budgetStr = String(budget || '0');
    return parseFloat(budgetStr.replace(/[^\d,]/g, '').replace(',', '.') || '0');
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesTemp = tempFilter === 'Todos' || contact.temperature === tempFilter;
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         contact.property.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTemp && matchesSearch;
  });

  const totalVGV = filteredContacts.reduce((acc, c) => acc + parseBudget(c.budget), 0);
  const averageTicket = filteredContacts.length > 0 ? totalVGV / filteredContacts.length : 0;

  return (
    <motion.div 
      key="kanban"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col"
    >
      <div className="mb-0.5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-1.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 via-gold/10 to-transparent flex items-center justify-center text-gold border border-gold/30 shadow-lg gold-glow relative z-10">
              <TrendingUp size={16} className="drop-shadow-lg" />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold rounded-full flex items-center justify-center text-[7px] font-black text-navy border border-navy shadow-2xl z-20">
              {filteredContacts.length}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-display font-black text-white tracking-tighter leading-tight uppercase">Gestão de <span className="text-gradient-gold">Leads Elite</span></h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none lg:min-w-[240px] group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-all duration-500" size={12} />
            <input 
              type="text"
              placeholder="Buscar lead..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-[10px] focus:outline-none focus:border-gold/40 transition-all duration-500 hover:bg-white/[0.08] font-bold text-white/80 shadow-lg backdrop-blur-xl"
            />
          </div>

          <div className="relative flex-1 lg:flex-none lg:min-w-[160px] group">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-all duration-500" size={12} />
            <select 
              value={tempFilter}
              onChange={(e) => setTempFilter(e.target.value as any)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-1.5 pl-9 pr-6 text-[10px] focus:outline-none focus:border-gold/40 appearance-none cursor-pointer transition-all duration-500 hover:bg-white/[0.08] font-bold text-white/80 shadow-lg backdrop-blur-xl"
            >
              <option value="Todos" className="bg-navy">Temperaturas</option>
              <option value="Frio" className="bg-navy">❄️ Frios</option>
              <option value="Morno" className="bg-navy">⛅ Mornos</option>
              <option value="Quente" className="bg-navy">🔥 Quentes</option>
            </select>
            <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 rotate-90 pointer-events-none group-focus-within:text-gold transition-colors" size={10} />
          </div>

          <div className="flex gap-2 bg-white/[0.03] p-1 px-2.5 rounded-lg border border-white/10 shadow-lg backdrop-blur-2xl relative overflow-hidden group">
            <div className="flex flex-col relative z-10">
              <span className="text-[7px] uppercase tracking-[0.2em] text-white/25 font-black mb-0">VGV Total</span>
              <span className="text-xs font-black text-gold tracking-tighter">
                {totalVGV.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="w-px h-4 bg-white/10 self-center relative z-10" />
            <div className="flex flex-col relative z-10">
              <span className="text-[7px] uppercase tracking-[0.2em] text-white/25 font-black mb-0">Ticket Médio</span>
              <span className="text-xs font-black text-white tracking-tighter">
                {averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          <button 
            onClick={handleResetPipeline}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-white/40 hover:bg-white/10 hover:text-gold hover:border-gold/30 transition-all duration-700 font-bold text-[9px] uppercase tracking-[0.1em] shadow-lg backdrop-blur-xl group"
          >
            <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-700" />
            Reiniciar
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-10 custom-scrollbar">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {FUNNEL_STAGES.map(stage => {
            const stageContacts = filteredContacts.filter(c => c.status === stage);
            
            return (
              <KanbanColumn 
                key={stage}
                stage={stage}
                stageContacts={stageContacts}
                contacts={contacts}
                pullingStage={pullingStage}
                setPullingStage={setPullingStage}
                pullSearch={pullSearch}
                setPullSearch={setPullSearch}
                updateLeadStatus={updateLeadStatus}
                setSelectedContact={setSelectedContact}
                handleDeleteLead={handleDeleteLead}
                parseBudget={parseBudget}
              />
            );
          })}
          <DragOverlay>
            {activeId && contacts.find(c => c.id === activeId) ? (
              <div className="w-64 opacity-80 scale-105 transition-transform">
                <ContactCard 
                  contact={contacts.find(c => c.id === activeId)!} 
                  onClick={() => {}} 
                  onDelete={() => {}} 
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </motion.div>
  );
};
