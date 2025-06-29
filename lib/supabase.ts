import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'standard' | 'pro'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'standard' | 'pro'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'standard' | 'pro'
          created_at?: string
          updated_at?: string
        }
      }
      portfolios: {
        Row: {
          id: string
          user_id: string
          name: string
          title: string
          summary: string
          contact: any
          skills: any
          projects: any
          education: any
          experience: any
          certifications: any
          awards: any
          languages: any
          interests: any
          volunteer: any
          publications: any
          patents: any
          template: string
          subdomain: string | null
          deployment_url: string | null
          is_deployed: boolean
          is_exported: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          title: string
          summary: string
          contact?: any
          skills?: any
          projects?: any
          education?: any
          experience?: any
          certifications?: any
          awards?: any
          languages?: any
          interests?: any
          volunteer?: any
          publications?: any
          patents?: any
          template?: string
          subdomain?: string | null
          deployment_url?: string | null
          is_deployed?: boolean
          is_exported?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          title?: string
          summary?: string
          contact?: any
          skills?: any
          projects?: any
          education?: any
          experience?: any
          certifications?: any
          awards?: any
          languages?: any
          interests?: any
          volunteer?: any
          publications?: any
          patents?: any
          template?: string
          subdomain?: string | null
          deployment_url?: string | null
          is_deployed?: boolean
          is_exported?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      shared_portfolios: {
        Row: {
          id: string
          portfolio_data: any
          template: string
          created_at: string
          expires_at: string
          view_count: number
          last_viewed_at: string | null
        }
        Insert: {
          id: string
          portfolio_data: any
          template: string
          created_at?: string
          expires_at: string
          view_count?: number
          last_viewed_at?: string | null
        }
        Update: {
          id?: string
          portfolio_data?: any
          template?: string
          created_at?: string
          expires_at?: string
          view_count?: number
          last_viewed_at?: string | null
        }
      }
      payment_proofs: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string
          transaction_id: string
          upi_id: string
          amount: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          email: string
          transaction_id: string
          upi_id?: string
          amount?: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          email?: string
          transaction_id?: string
          upi_id?: string
          amount?: number
          status?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: 'free' | 'standard' | 'pro'
          is_active: boolean
          started_at: string
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier?: 'free' | 'standard' | 'pro'
          is_active?: boolean
          started_at?: string
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier?: 'free' | 'standard' | 'pro'
          is_active?: boolean
          started_at?: string
          expires_at?: string | null
          created_at?: string
        }
      }
    }
  }
}
