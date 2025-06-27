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
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
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
          skills: string[] | null
          projects: any[] | null
          education: any[] | null
          experience: any[] | null
          template: string
          subdomain: string | null
          deployment_url: string | null
          is_deployed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          title: string
          summary: string
          skills?: string[] | null
          projects?: any[] | null
          education?: any[] | null
          experience?: any[] | null
          template: string
          subdomain?: string | null
          deployment_url?: string | null
          is_deployed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          title?: string
          summary?: string
          skills?: string[] | null
          projects?: any[] | null
          education?: any[] | null
          experience?: any[] | null
          template?: string
          subdomain?: string | null
          deployment_url?: string | null
          is_deployed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
