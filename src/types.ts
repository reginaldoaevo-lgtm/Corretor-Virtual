export type FunnelStatus = 
  | 'Novo Contato' 
  | 'Agendar Visita' 
  | 'Visitando' 
  | 'Proposta' 
  | 'Contrato' 
  | 'Venda';

export type Temperature = 'Frio' | 'Morno' | 'Quente';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  property: string;
  propertyImage?: string;
  budget: string;
  status: FunnelStatus;
  temperature: Temperature;
  lastInteraction: string;
  createdAt: string;
  summary: string;
  conversationHistory?: string;
  behavioralAnalysis?: AIResponse;
  behavioralHistory?: AIResponse[];
}

export interface AIResponse {
  idealResponse: string;
  masterStrategy: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'premium' | 'elite';
  status?: 'Ativo' | 'Inativo';
}
