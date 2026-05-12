import { createClient } from '@supabase/supabase-js'

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string
          name_ko: string | null
          name_zh: string | null
          name_en: string | null
          group_name: string | null
          agency: string | null
          country: string | null
          debut_date: string | null
          profile_image: string | null
          banner_image: string | null
          social_links: Json
          artist_type: string | null
          member_count: number | null
          tags: string[] | null
          status: string | null
          hot_score: number | null
          slug: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['artists']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['artists']['Insert']>
      }
      events: {
        Row: {
          id: string
          title: string | null
          subtitle: string | null
          artist_id: string | null
          event_type: string | null
          country: string | null
          city: string | null
          venue: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          event_date: string | null
          event_end_date: string | null
          door_time: string | null
          ticket_open_date: string | null
          ticket_close_date: string | null
          price_range: string | null
          currency: string | null
          official_link: string | null
          ticket_link: string | null
          poster_image: string | null
          status: string | null
          is_highlighted: boolean | null
          hot_score: number | null
          source: string | null
          source_id: string | null
          slug: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
      news: {
        Row: {
          id: string
          title: string | null
          summary: string | null
          content: string | null
          original_title: string | null
          original_content: string | null
          language: string | null
          source: string | null
          source_url: string | null
          author: string | null
          artist_id: string | null
          news_type: string | null
          tags: string[] | null
          image_url: string | null
          images: string[] | null
          is_translated: boolean | null
          is_ai_summary: boolean | null
          status: string | null
          priority: number | null
          hot_score: number | null
          view_count: number | null
          slug: string | null
          publish_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['news']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['news']['Insert']>
      }
      flash_news: {
        Row: {
          id: string
          content: string | null
          news_type: string | null
          priority: number | null
          artist_id: string | null
          event_id: string | null
          source_news_id: string | null
          is_active: boolean | null
          expires_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['flash_news']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['flash_news']['Insert']>
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          artist_id: string | null
          event_id: string | null
          notify_ticket: boolean | null
          notify_event: boolean | null
          notify_news: boolean | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>
      }
    }
    Views: {
      [_ in string]: never
    }
    Functions: {
      [_ in string]: never
    }
    Enums: {
      [_ in string]: never
    }
  }
}