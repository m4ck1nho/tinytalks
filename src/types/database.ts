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
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: 'student' | 'teacher' | 'admin'
          phone_number: string | null
          profile_picture_url: string | null
          bio_en: string | null
          bio_ru: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          role?: 'student' | 'teacher' | 'admin'
          phone_number?: string | null
          profile_picture_url?: string | null
          bio_en?: string | null
          bio_ru?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: 'student' | 'teacher' | 'admin'
          phone_number?: string | null
          profile_picture_url?: string | null
          bio_en?: string | null
          bio_ru?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      packages: {
        Row: {
          id: string
          name_en: string
          name_ru: string
          description_en: string
          description_ru: string
          price_usd: number
          number_of_lessons_included: number
          duration_per_lesson_minutes: number
          currency: string
          details_list_en: Json | null
          details_list_ru: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_en: string
          name_ru: string
          description_en: string
          description_ru: string
          price_usd: number
          number_of_lessons_included: number
          duration_per_lesson_minutes: number
          currency?: string
          details_list_en?: Json | null
          details_list_ru?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_en?: string
          name_ru?: string
          description_en?: string
          description_ru?: string
          price_usd?: number
          number_of_lessons_included?: number
          duration_per_lesson_minutes?: number
          currency?: string
          details_list_en?: Json | null
          details_list_ru?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      // Add more table types as needed for the full schema
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'student' | 'teacher' | 'admin'
      lesson_status: 'scheduled' | 'completed' | 'canceled' | 'rescheduled'
      lesson_request_status: 'pending' | 'approved' | 'declined' | 'canceled_by_student'
      homework_status: 'assigned' | 'submitted' | 'graded' | 'returned'
      payment_method: 'online_card' | 'manual_cash' | 'manual_bank_transfer' | 'other'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
