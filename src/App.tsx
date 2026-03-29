import React from 'react';
import { Layout, Users, Calendar, MessageSquare, Plus } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Main Container */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8 border-b border-border pb-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Radar CRM - Elite</h1>
            <p className="text-muted-foreground text-sm">Real Estate Intelligence - Goiânia</p>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:opacity-90 transition-all">
            <Plus size={20} />
            New Lead
          </button>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Status Column Example */}
          <div className="bg-card p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <MessageSquare size={18} />
              <h2 className="font-semibold">New Leads</h2>
            </div>
            {/* Lead Card Example */}
            <div className="bg-background/50 p-4 rounded-lg border border-border/50 mb-3">
              <p className="font-bold text-sm">Opus Ayra - Lead</p>
              <p className="text-xs text-muted-foreground">Waiting for AI analysis...</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
