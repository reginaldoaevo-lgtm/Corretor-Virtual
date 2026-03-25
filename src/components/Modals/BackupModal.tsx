"use client";

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  Database, 
  RefreshCw 
} from 'lucide-react';
import { motion } from 'motion/react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportLeads: () => string;
  importLeads: (leads: any[]) => Promise<boolean>;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  exportLeads,
  importLeads
}) => {
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleExport = () => {
    const data = exportLeads();
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = async () => {
    if (!importText.trim()) return;
    setIsImporting(true);
    setImportStatus('idle');
    try {
      const leads = JSON.parse(importText);
      const success = await importLeads(leads);
      if (success) {
        setImportStatus('success');
        setImportText('');
        setTimeout(() => onClose(), 1500);
      } else {
        setImportStatus('error');
      }
    } catch (e) {
      console.error('Import error:', e);
      setImportStatus('error');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-navy/90 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        className="relative w-full max-w-lg bg-navy-light p-6 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-gold/50 to-gold" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h3 className="text-2xl font-display font-black text-white tracking-tighter">Sincronização & <span className="text-gradient-gold">Backup</span></h3>
            <p className="text-xs text-white/30 mt-1.5 font-medium">Mova seus dados entre dispositivos</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:bg-white/10 hover:text-white transition-all duration-500 border border-white/5 shadow-xl hover:rotate-90"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="space-y-6 relative z-10">
          {/* Supabase Info */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Database size={16} />
              </div>
              <h4 className="text-sm font-bold text-white">Sincronização Automática</h4>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed">
              Para sincronizar com o app do Vercel, certifique-se de que ambos estão usando o mesmo projeto do <strong>Supabase</strong>. Configure as chaves nos Segredos (Secrets) deste projeto.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Export */}
            <div className="space-y-3">
              <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gold/60 ml-2">Exportar Dados</label>
              <button 
                onClick={handleExport}
                className="w-full py-4 bg-white/[0.03] border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/[0.08] transition-all group"
              >
                {copied ? <Check className="text-emerald-500" size={20} /> : <Download className="text-white/20 group-hover:text-gold transition-colors" size={20} />}
                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/40 group-hover:text-white">Copiar JSON</span>
              </button>
            </div>

            {/* Import */}
            <div className="space-y-3">
              <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gold/60 ml-2">Importar Dados</label>
              <button 
                onClick={() => document.getElementById('import-area')?.focus()}
                className="w-full py-4 bg-white/[0.03] border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/[0.08] transition-all group"
              >
                <Upload className="text-white/20 group-hover:text-gold transition-colors" size={20} />
                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/40 group-hover:text-white">Colar JSON</span>
              </button>
            </div>
          </div>

          {/* Import Area */}
          <div className="space-y-2">
            <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gold/60 ml-2">Área de Importação</label>
            <textarea 
              id="import-area"
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Cole o JSON exportado aqui..."
              className="w-full h-32 bg-white/[0.03] border border-white/10 rounded-xl p-4 text-[10px] font-mono text-white/60 focus:outline-none focus:border-gold/50 transition-all resize-none"
            />
          </div>

          <button 
            onClick={handleImport}
            disabled={isImporting || !importText.trim()}
            className={`w-full py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-2 ${
              importStatus === 'success' 
                ? 'bg-emerald-500 text-white' 
                : importStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-gradient-to-br from-gold-light via-gold to-gold-dark text-navy shadow-[0_15px_35px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98]'
            } disabled:opacity-50 disabled:scale-100`}
          >
            {isImporting ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : importStatus === 'success' ? (
              <>Sucesso! <Check size={16} /></>
            ) : importStatus === 'error' ? (
              <>Erro no Formato</>
            ) : (
              'Iniciar Importação Elite'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
