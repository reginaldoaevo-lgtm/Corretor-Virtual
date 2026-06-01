'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Wifi } from 'lucide-react';

export const PWAInstaller: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Registro do Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('🚀 Service Worker registrado com sucesso:', reg.scope))
          .catch((err) => console.error('❌ Falha ao registrar Service Worker:', err));
      });
    }

    // Detecção de Conexão
    const handleOnline = () => {
      setIsOffline(false);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Estado inicial
    if (!navigator.onLine) {
      setIsOffline(true);
      setShowStatus(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 ${
            isOffline 
              ? 'bg-red-500/20 border-red-500/30 text-red-200' 
              : 'bg-green-500/20 border-green-500/30 text-green-200'
          }`}
        >
          {isOffline ? (
            <>
              <WifiOff size={18} className="animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest">Modo Offline</span>
                <span className="text-[10px] opacity-70 font-medium">IA indisponível, exibindo dados salvos localmente</span>
              </div>
            </>
          ) : (
            <>
              <Wifi size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Conexão Restabelecida</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
