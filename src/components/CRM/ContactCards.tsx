import React from 'react';
import { 
  Clock, 
  LayoutDashboard, 
  X, 
  ChevronRight,
  Phone,
  Calendar
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Contact } from '../../types';
import { openWhatsApp, TemperatureBadge } from '../Common';

interface ContactCardProps {
  contact: Contact;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const SortableContactCard: React.FC<ContactCardProps> = ({ contact, onClick, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: contact.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 9999 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  const createdAtTime = new Date(contact.createdAt).getTime();
  const daysActive = isNaN(createdAtTime) ? 0 : Math.floor((new Date().getTime() - createdAtTime) / (1000 * 3600 * 24));

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`card-premium p-4 group relative shrink-0 ${isDragging ? 'shadow-premium ring-2 ring-gold/50 scale-105 z-50' : 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]'}`}
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold/60 via-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-t-[32px]" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="relative group/badge">
          <TemperatureBadge temperature={contact.temperature} />
          <div className="absolute inset-0 bg-gold/20 blur-xl opacity-0 group-hover/badge:opacity-40 transition-opacity duration-500" />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center hover:bg-red-500/20 rounded-xl text-red-500 transition-all duration-500 hover:scale-110 active:scale-95 border border-transparent hover:border-red-500/20"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <h4 className="font-display font-black text-lg mb-4 line-clamp-2 leading-tight group-hover:text-gold transition-colors duration-500 tracking-tight text-white/95">
        {contact.summary || contact.name}
      </h4>

      {contact.propertyImage && (
        <div className="w-full h-32 rounded-[24px] overflow-hidden mb-4 border border-white/10 relative group/img shadow-2xl">
          <img src={contact.propertyImage} alt={contact.property} className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-115" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/30 to-transparent opacity-0 group-hover/img:opacity-100 transition-all duration-700 flex items-end p-4">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] truncate drop-shadow-2xl">{contact.property}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-lg font-black text-gold border border-gold/30 group-hover:from-gold group-hover:to-gold-dark group-hover:text-navy transition-all duration-700 shadow-[0_8px_20px_rgba(212,175,55,0.15)]">
            {contact.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-white tracking-tight truncate max-w-[150px] group-hover:text-gold transition-colors duration-500">{contact.name}</span>
            <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mt-1">{contact.phone}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-[10px] text-white/25 font-black uppercase tracking-[0.4em]">
          <Calendar size={14} className="text-gold/50" />
          {daysActive}d Ativo
        </div>
        <div className="text-lg font-black text-gold tracking-tighter drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
          {contact.budget}
        </div>
      </div>
    </div>
  );
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact, onClick, onDelete }) => {
  const createdAtTime = new Date(contact.createdAt).getTime();
  const daysActive = isNaN(createdAtTime) ? 0 : Math.floor((new Date().getTime() - createdAtTime) / (1000 * 3600 * 24));

  return (
    <div 
      onClick={onClick}
      className="bg-navy-light p-6 rounded-[32px] border border-gold/50 shadow-[0_30px_60px_rgba(0,0,0,0.7)] scale-105 ring-4 ring-gold/10 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold via-gold/50 to-gold" />
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-gold/10 rounded-full blur-[50px] pointer-events-none" />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <TemperatureBadge temperature={contact.temperature} />
        <X size={20} className="text-white/20 hover:text-white transition-colors cursor-pointer" />
      </div>

      <h4 className="font-display font-black text-xl mb-6 text-white tracking-tighter leading-tight relative z-10">
        {contact.summary || contact.name}
      </h4>

      {contact.propertyImage && (
        <div className="w-full h-40 rounded-[24px] overflow-hidden mb-6 border border-white/10 shadow-2xl relative z-10">
          <img src={contact.propertyImage} alt={contact.property} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      )}

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center text-gold font-black text-xl border border-gold/40 shadow-xl">
          {contact.name.charAt(0)}
        </div>
        <div>
          <div className="text-lg font-black text-white tracking-tight">{contact.name}</div>
          <div className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mt-1">{contact.phone}</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-white/10 relative z-10">
        <div className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">
          Ativo há {daysActive} dias
        </div>
        <div className="text-xl font-black text-gold tracking-tighter drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
          {contact.budget}
        </div>
      </div>
    </div>
  );
}
