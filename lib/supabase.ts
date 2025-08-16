import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn("Supabase environment variables not set - using placeholder values for build")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key')

// Database helper functions
export const dbHelpers = {
  // Customer operations
  async createCustomer(customerData: {
    email: string
    name: string
    wallet_address?: string
  }) {
    const { data, error } = await supabase.from("customers").insert([customerData]).select().single()

    if (error) throw error
    return data
  },

  async getCustomer(id: string) {
    const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async updateCustomer(id: string, updates: Partial<Database["public"]["Tables"]["customers"]["Update"]>) {
    const { data, error } = await supabase.from("customers").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  // Subscription operations
  async createSubscription(subscriptionData: {
    customer_id: string
    plan_name: string
    amount: number
    currency?: string
    next_billing_date?: string
  }) {
    const { data, error } = await supabase.from("subscriptions").insert([subscriptionData]).select().single()

    if (error) throw error
    return data
  },

  async getCustomerSubscriptions(customerId: string) {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("customer_id", customerId)
      .eq("status", "active")

    if (error) throw error
    return data
  },

  // Transaction operations
  async createTransaction(transactionData: {
    customer_id: string
    amount: number
    currency: string
    payment_method: string
    blockchain_tx_hash?: string
    status?: string
  }) {
    const { data, error } = await supabase.from("transactions").insert([transactionData]).select().single()

    if (error) throw error
    return data
  },

  async updateTransactionStatus(id: string, status: string, blockchain_tx_hash?: string) {
    const updates: any = { status }
    if (blockchain_tx_hash) {
      updates.blockchain_tx_hash = blockchain_tx_hash
    }

    const { data, error } = await supabase.from("transactions").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  // Analytics queries
  async getRevenueAnalytics(startDate?: string, endDate?: string) {
    let query = supabase.from("transactions").select("amount, currency, created_at").eq("status", "completed")

    if (startDate) {
      query = query.gte("created_at", startDate)
    }
    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getCustomerMetrics() {
    const { data, error } = await supabase.from("customers").select("subscription_status, total_spent, created_at")

    if (error) throw error
    return data
  },
}

// Real-time subscriptions
export const subscribeToCustomerChanges = (customerId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`customer-${customerId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "customers",
        filter: `id=eq.${customerId}`,
      },
      callback,
    )
    .subscribe()
}

export const subscribeToTransactionChanges = (callback: (payload: any) => void) => {
  return supabase
    .channel("transactions")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "transactions",
      },
      callback,
    )
    .subscribe()
}
