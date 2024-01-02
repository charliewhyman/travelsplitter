import 'react-native-url-polyfill/auto'
import * as SecureStore from 'expo-secure-store'
import { createClient, PostgrestError } from '@supabase/supabase-js'

// from https://supabase.com/docs/guides/getting-started/tutorials/with-expo

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key)
  },
}

const supabaseUrl:string = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey:string = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  },
})

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
      activities: {
        Row: {
          created_at: string
          created_by: string | null
          desc: string | null
          group_id: string | null
          id: number
          name: string
          trip_id: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          desc?: string | null
          group_id?: string | null
          id?: number
          name: string
          trip_id?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          desc?: string | null
          group_id?: string | null
          id?: number
          name?: string
          trip_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      activity_assignees: {
        Row: {
          activity_id: number | null
          created_at: string
          id: number
          member_id: string | null
        }
        Insert: {
          activity_id?: number | null
          created_at?: string
          id?: number
          member_id?: string | null
        }
        Update: {
          activity_id?: number | null
          created_at?: string
          id?: number
          member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_assignees_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_assignees_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      changelogs: {
        Row: {
          content: string | null
          group_id: string
          id: string
          image: string | null
          publish_date: string | null
          published: boolean
          summary: string | null
          title: string
        }
        Insert: {
          content?: string | null
          group_id: string
          id?: string
          image?: string | null
          publish_date?: string | null
          published: boolean
          summary?: string | null
          title?: string
        }
        Update: {
          content?: string | null
          group_id?: string
          id?: string
          image?: string | null
          publish_date?: string | null
          published?: boolean
          summary?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "changelogs_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          created_at: string
          end_datetime: string
          group_id: string | null
          id: number
          name: string
          start_datetime: string
        }
        Insert: {
          created_at?: string
          end_datetime?: string
          group_id?: string | null
          id?: number
          name: string
          start_datetime?: string
        }
        Update: {
          created_at?: string
          end_datetime?: string
          group_id?: string | null
          id?: number
          name?: string
          start_datetime?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          email: string
          id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          email?: string
          id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      trip_members: {
        Row: {
          created_at: string | null
          id: string
          member_id: string
          trip_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          member_id: string
          trip_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          member_id?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_members_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          }
        ]
      }
      trips: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          end_datetime: string
          id: string
          name: string
          slug: string
          start_datetime: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          end_datetime: string
          id?: string
          name: string
          slug: string
          start_datetime: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          end_datetime?: string
          id?: string
          name?: string
          slug?: string
          start_datetime?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_avatar: {
        Args: {
          avatar_url: string
        }
        Returns: Record<string, unknown>
      }
      delete_storage_object: {
        Args: {
          bucket: string
          object: string
        }
        Returns: Record<string, unknown>
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
