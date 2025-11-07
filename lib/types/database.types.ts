export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'customer' | 'employee' | 'admin'
export type AppointmentStatus = 'confirmed' | 'cancelled' | 'pending'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          role: UserRole
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone?: string | null
          role?: UserRole
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          role?: UserRole
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          user_id: string
          specialization: string
          working_days: string[]
          start_hour: string
          end_hour: string
          photo_url: string | null
          bio: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          specialization: string
          working_days: string[]
          start_hour: string
          end_hour: string
          photo_url?: string | null
          bio?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          specialization?: string
          working_days?: string[]
          start_hour?: string
          end_hour?: string
          photo_url?: string | null
          bio?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          duration: number
          category: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          duration: number
          category?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          duration?: number
          category?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          customer_id: string
          employee_id: string
          service_id: string
          date: string
          start_time: string
          end_time: string
          status: AppointmentStatus
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          employee_id: string
          service_id: string
          date: string
          start_time: string
          end_time: string
          status?: AppointmentStatus
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          employee_id?: string
          service_id?: string
          date?: string
          start_time?: string
          end_time?: string
          status?: AppointmentStatus
          note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      business_settings: {
        Row: {
          id: string
          business_name: string
          description: string | null
          address: string | null
          phone: string | null
          email: string | null
          open_days: string[]
          closed_days: string[]
          open_hour: string
          close_hour: string
          logo_url: string | null
          hero_image_url: string | null
          primary_color: string
          secondary_color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_name: string
          description?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          open_days?: string[]
          closed_days?: string[]
          open_hour?: string
          close_hour?: string
          logo_url?: string | null
          hero_image_url?: string | null
          primary_color?: string
          secondary_color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_name?: string
          description?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          open_days?: string[]
          closed_days?: string[]
          open_hour?: string
          close_hour?: string
          logo_url?: string | null
          hero_image_url?: string | null
          primary_color?: string
          secondary_color?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
