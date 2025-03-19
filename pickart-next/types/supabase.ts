export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'artist' | 'host'

export interface Database {
  public: {
    Tables: {
      countries: {
        Row: {
          id: number
          name: string
          code: string
        }
        Insert: {
          id?: number
          name: string
          code: string
        }
        Update: {
          id?: number
          name?: string
          code?: string
        }
      }
      users: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          address: string
          country_code: string
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          address: string
          country_code: string
          role: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          address?: string
          country_code?: string
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
      }
      registration_approvals: {
        Row: {
          id: string
          user_id: string
          approved_by: string | null
          status: 'pending' | 'approved' | 'rejected'
          notes: string | null
          created_at: string
          updated_at: string
          requested_role: UserRole
        }
        Insert: {
          id?: string
          user_id: string
          approved_by?: string | null
          status: 'pending' | 'approved' | 'rejected'
          notes?: string | null
          created_at?: string
          updated_at?: string
          requested_role: UserRole
        }
        Update: {
          id?: string
          user_id?: string
          approved_by?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          notes?: string | null
          created_at?: string
          updated_at?: string
          requested_role?: UserRole
        }
      }
      artists: {
        Row: {
          id: string
          user_id: string
          artist_type: 'artist' | 'agent'
          display_name: string
          bank_account_id: string | null
          contract_signed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          artist_type: 'artist' | 'agent'
          display_name: string
          bank_account_id?: string | null
          contract_signed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          artist_type?: 'artist' | 'agent'
          display_name?: string
          bank_account_id?: string | null
          contract_signed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      hosts: {
        Row: {
          id: string
          user_id: string
          host_type: 'host' | 'owner'
          business_name: string | null
          bank_account_id: string | null
          contract_signed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          host_type: 'host' | 'owner'
          business_name?: string | null
          bank_account_id?: string | null
          contract_signed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          host_type?: 'host' | 'owner'
          business_name?: string | null
          bank_account_id?: string | null
          contract_signed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          property_id: string
          property_name: string
          street_address: string
          city: string
          state: string
          postcode: string
          country_code: string
          property_type: string
          size_sqm: number | null
          total_floors: number | null
          total_rooms: number | null
          owner_id: string
          contact_phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id?: string
          property_name: string
          street_address: string
          city: string
          state: string
          postcode: string
          country_code: string
          property_type: string
          size_sqm?: number | null
          total_floors?: number | null
          total_rooms?: number | null
          owner_id: string
          contact_phone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          property_name?: string
          street_address?: string
          city?: string
          state?: string
          postcode?: string
          country_code?: string
          property_type?: string
          size_sqm?: number | null
          total_floors?: number | null
          total_rooms?: number | null
          owner_id?: string
          contact_phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      artworks: {
        Row: {
          id: string
          artwork_id: string
          artist_id: string
          title: string
          year: number
          place: string | null
          description: string | null
          style: string | null
          medium: string
          is_unique: boolean
          edition_number: number | null
          edition_total: number | null
          width_cm: number
          height_cm: number
          depth_cm: number | null
          weight_kg: number
          price: number
          status: 'draft' | 'pending_approval' | 'ready_for_allocation' | 'allocated' | 'delivered' | 'live' | 'sold'
          current_spot_id: string | null
          qr_code_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          artwork_id?: string
          artist_id: string
          title: string
          year: number
          place?: string | null
          description?: string | null
          style?: string | null
          medium: string
          is_unique: boolean
          edition_number?: number | null
          edition_total?: number | null
          width_cm: number
          height_cm: number
          depth_cm?: number | null
          weight_kg: number
          price: number
          status?: 'draft' | 'pending_approval' | 'ready_for_allocation' | 'allocated' | 'delivered' | 'live' | 'sold'
          current_spot_id?: string | null
          qr_code_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          artwork_id?: string
          artist_id?: string
          title?: string
          year?: number
          place?: string | null
          description?: string | null
          style?: string | null
          medium?: string
          is_unique?: boolean
          edition_number?: number | null
          edition_total?: number | null
          width_cm?: number
          height_cm?: number
          depth_cm?: number | null
          weight_kg?: number
          price?: number
          status?: 'draft' | 'pending_approval' | 'ready_for_allocation' | 'allocated' | 'delivered' | 'live' | 'sold'
          current_spot_id?: string | null
          qr_code_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      spots: {
        Row: {
          id: string
          spot_id: string
          property_id: string
          floor_number: number | null
          room_name: string | null
          position_description: string | null
          preferred_style: string | null
          color_scheme: string | null
          fixture_method: 'wall_mount' | 'pedestal' | 'ceiling_hang' | 'easel' | 'shelf' | 'floor_stand' | 'other'
          max_weight_kg: number
          max_width_cm: number
          max_height_cm: number
          max_depth_cm: number | null
          preferred_price_range_min: number | null
          preferred_price_range_max: number | null
          status: 'draft' | 'pending_approval' | 'ready_for_allocation' | 'allocated' | 'live'
          current_artwork_id: string | null
          qr_code_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          spot_id?: string
          property_id: string
          floor_number?: number | null
          room_name?: string | null
          position_description?: string | null
          preferred_style?: string | null
          color_scheme?: string | null
          fixture_method: 'wall_mount' | 'pedestal' | 'ceiling_hang' | 'easel' | 'shelf' | 'floor_stand' | 'other'
          max_weight_kg: number
          max_width_cm: number
          max_height_cm: number
          max_depth_cm?: number | null
          preferred_price_range_min?: number | null
          preferred_price_range_max?: number | null
          status?: 'draft' | 'pending_approval' | 'ready_for_allocation' | 'allocated' | 'live'
          current_artwork_id?: string | null
          qr_code_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          spot_id?: string
          property_id?: string
          floor_number?: number | null
          room_name?: string | null
          position_description?: string | null
          preferred_style?: string | null
          color_scheme?: string | null
          fixture_method?: 'wall_mount' | 'pedestal' | 'ceiling_hang' | 'easel' | 'shelf' | 'floor_stand' | 'other'
          max_weight_kg?: number
          max_width_cm?: number
          max_height_cm?: number
          max_depth_cm?: number | null
          preferred_price_range_min?: number | null
          preferred_price_range_max?: number | null
          status?: 'draft' | 'pending_approval' | 'ready_for_allocation' | 'allocated' | 'live'
          current_artwork_id?: string | null
          qr_code_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      artwork_details: {
        Row: {
          id: string
          artwork_id: string
          artist_id: string
          title: string
          year: number
          place: string | null
          description: string | null
          style: string | null
          medium: string
          is_unique: boolean
          edition_number: number | null
          edition_total: number | null
          width_cm: number
          height_cm: number
          depth_cm: number | null
          weight_kg: number
          price: number
          status: 'draft' | 'pending_approval' | 'ready_for_allocation' | 'allocated' | 'delivered' | 'live' | 'sold'
          current_spot_id: string | null
          qr_code_url: string | null
          created_at: string
          updated_at: string
          artist_first_name: string | null
          artist_last_name: string | null
          artist_display_name: string | null
          primary_photo_url: string | null
          spot_identifier: string | null
          current_property_name: string | null
          current_property_city: string | null
        }
      }
      spot_details: {
        Row: {
          id: string
          spot_id: string
          property_id: string
          floor_number: number | null
          room_name: string | null
          position_description: string | null
          preferred_style: string | null
          color_scheme: string | null
          fixture_method: 'wall_mount' | 'pedestal' | 'ceiling_hang' | 'easel' | 'shelf' | 'floor_stand' | 'other'
          max_weight_kg: number
          max_width_cm: number
          max_height_cm: number
          max_depth_cm: number | null
          preferred_price_range_min: number | null
          preferred_price_range_max: number | null
          status: 'draft' | 'pending_approval' | 'ready_for_allocation' | 'allocated' | 'live'
          current_artwork_id: string | null
          qr_code_url: string | null
          created_at: string
          updated_at: string
          property_name: string | null
          property_type: string | null
          street_address: string | null
          city: string | null
          state: string | null
          country: string | null
          artwork_identifier: string | null
          current_artwork_title: string | null
          current_artwork_artist: string | null
        }
      }
    }
    Functions: {
      [_ in string]: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      user_role: 'admin' | 'artist' | 'host'
      artist_type: 'artist' | 'agent'
      host_type: 'host' | 'owner'
      fixture_method: 'wall_mount' | 'pedestal' | 'ceiling_hang' | 'easel' | 'shelf' | 'floor_stand' | 'other'
      artwork_status: 'draft' | 'pending_approval' | 'ready_for_allocation' | 'allocated' | 'delivered' | 'live' | 'sold'
      spot_status: 'draft' | 'pending_approval' | 'ready_for_allocation' | 'allocated' | 'live'
      delivery_option: 'pickup' | 'delivery'
    }
  }
} 