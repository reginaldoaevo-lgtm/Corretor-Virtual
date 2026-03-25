@import "tailwindcss";

@theme {
  --color-navy: #050A18;
  --color-navy-light: #0A1128;
  --color-gold: #D4AF37;
  --color-gold-dark: #B8860B;
  --color-gold-light: #F9E29C;
  --color-graphite: #1C2541;
  --color-accent: #64FFDA;
  
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Outfit', sans-serif;
}

@layer base {
  body {
    @apply bg-navy text-white antialiased selection:bg-gold/30 selection:text-gold;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  }
}

@layer components {
  .glass {
    @apply bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl;
  }
  
  .glass-gold {
    @apply bg-gold/5 backdrop-blur-xl border border-gold/20 rounded-3xl;
  }
  
  .btn-gold {
    @apply bg-gradient-to-br from-gold-light via-gold to-gold-dark text-navy font-bold py-3 px-6 rounded-xl 
           hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300;
  }
  
  .input-field {
    @apply bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold/50 
           focus:ring-1 focus:ring-gold/20 transition-all placeholder:text-white/20;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-white/10 rounded-full hover:bg-white/20 transition-colors;
  }
  
  .badge-hot {
    @apply bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider;
  }
  
  .badge-warm {
    @apply bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider;
  }
  
  .badge-cold {
    @apply bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider;
  }

  .text-gradient-gold {
    @apply bg-gradient-to-br from-gold-light via-gold to-gold-dark bg-clip-text text-transparent;
  }

  .border-premium {
    @apply border border-white/5 hover:border-white/10 transition-colors;
  }

  .shadow-premium {
    @apply shadow-[0_20px_50px_rgba(0,0,0,0.3)];
  }

  .card-premium {
    @apply bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] hover:bg-white/[0.08] transition-all duration-500;
  }

  .glass-dark {
    @apply bg-navy-light/40 backdrop-blur-3xl border border-white/5 rounded-[32px] shadow-2xl;
  }

  .gold-glow {
    @apply shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:shadow-[0_0_50px_rgba(212,175,55,0.25)] transition-shadow duration-500;
  }

  .text-gradient-white {
    @apply bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
