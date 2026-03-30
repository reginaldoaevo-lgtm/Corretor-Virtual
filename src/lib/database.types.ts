export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          budget: string
          created_at: string
          id: string
          last_interaction: string
          name: string
          phone: string
          property: string
          property_image: string | null
          status: string
          summary: string | null
          temperature: string
          user_id: string | null
          conversation_history: string | null
          behavioral_analysis: Json | null
          behavioral_history: Json[] | null
        }
        Insert: {
          budget: string
          created_at?: string
          id?: string
          last_interaction?: string
          name: string
          phone: string
          property: string
          property_image?: string | null
          status?: string
          summary?: string | null
          temperature?: string
          user_id?: string | null
          conversation_history?: string | null
          behavioral_analysis?: Json | null
          behavioral_history?: Json[] | null
        }
        Update: {
          budget?: string
          created_at?: string
          id?: string
          last_interaction?: string
          name?: string
          phone?: string
          property?: string
          property_image?: string | null
          status?: string
          summary?: string | null
          temperature?: string
          user_id?: string | null
          conversation_history?: string | null
          behavioral_analysis?: Json | null
          behavioral_history?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          }
        ]
      }
      team_members: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password: string | null
          role: string
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password?: string | null
          role: string
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password?: string | null
          role?: string
          status?: string | null
        }
        Relationships: []
      }
      ai_analyses: {
        Row: {
          contact_id: string | null
          created_at: string
          id: string
          ideal_response: string | null
          master_strategy: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          id?: string
          ideal_response?: string | null
          master_strategy?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          id?: string
          ideal_response?: string | null
          master_strategy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_analyses_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
