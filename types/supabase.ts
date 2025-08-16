export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          subscription_status: string
          wallet_address: string | null
          total_spent: number
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          subscription_status?: string
          wallet_address?: string | null
          total_spent?: number
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          subscription_status?: string
          wallet_address?: string | null
          total_spent?: number
        }
      }
      subscriptions: {
        Row: {
          id: string
          customer_id: string
          plan_name: string
          amount: number
          currency: string
          status: string
          created_at: string
          next_billing_date: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          plan_name: string
          amount: number
          currency?: string
          status?: string
          created_at?: string
          next_billing_date?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          plan_name?: string
          amount?: number
          currency?: string
          status?: string
          created_at?: string
          next_billing_date?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          customer_id: string
          amount: number
          currency: string
          payment_method: string
          blockchain_tx_hash: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          amount: number
          currency: string
          payment_method: string
          blockchain_tx_hash?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          amount?: number
          currency?: string
          payment_method?: string
          blockchain_tx_hash?: string | null
          status?: string
          created_at?: string
        }
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
