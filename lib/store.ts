// Global state management using Zustand
import { create } from 'zustand'

export interface User {
  id: string
  email: string
  name: string
  subscription_status: 'active' | 'cancelled' | 'trial'
  wallet_address?: string
}

export interface AppState {
  user: User | null
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))

// Billing specific state
export interface BillingState {
  transactions: any[]
  subscriptions: any[]
  customers: any[]
  invoices: any[]
  products: any[]
  isLoading: {
    customers: boolean
    subscriptions: boolean
    products: boolean
    invoices: boolean
    transactions: boolean
  }
  lastUpdated: {
    customers: number
    subscriptions: number
    products: number
    invoices: number
    transactions: number
  }
  isLoadingTransactions: boolean
  isLoadingSubscriptions: boolean
  setTransactions: (transactions: any[]) => void
  setSubscriptions: (subscriptions: any[]) => void
  setCustomers: (customers: any[]) => void
  setInvoices: (invoices: any[]) => void
  setProducts: (products: any[]) => void
  setLoadingTransactions: (loading: boolean) => void
  setLoadingSubscriptions: (loading: boolean) => void
  setLoading: (type: string, loading: boolean) => void
  updateLastUpdated: (type: string) => void
}

export const useBillingStore = create<BillingState>((set, get) => ({
  transactions: [],
  subscriptions: [],
  customers: [],
  invoices: [],
  products: [],
  isLoading: {
    customers: false,
    subscriptions: false,
    products: false,
    invoices: false,
    transactions: false
  },
  lastUpdated: {
    customers: Date.now(),
    subscriptions: Date.now(),
    products: Date.now(),
    invoices: Date.now(),
    transactions: Date.now()
  },
  isLoadingTransactions: false,
  isLoadingSubscriptions: false,
  setTransactions: (transactions) => set({ transactions }),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  setCustomers: (customers) => set({ customers }),
  setInvoices: (invoices) => set({ invoices }),
  setProducts: (products) => set({ products }),
  setLoadingTransactions: (isLoadingTransactions) => set({ isLoadingTransactions }),
  setLoadingSubscriptions: (isLoadingSubscriptions) => set({ isLoadingSubscriptions }),
  setLoading: (type: string, loading: boolean) => {
    const currentLoading = get().isLoading
    set({ isLoading: { ...currentLoading, [type]: loading } })
  },
  updateLastUpdated: (type: string) => {
    const currentLastUpdated = get().lastUpdated
    set({ lastUpdated: { ...currentLastUpdated, [type]: Date.now() } })
  }
}))

// Missing export for customer data
export const useCustomerData = () => {
  const user = useAppStore(state => state.user)
  
  // Return a default user object if none exists to prevent null access errors
  return user || {
    id: 'demo-user',
    email: 'demo@streamplay.com',
    name: 'Demo User',
    subscription_status: 'active' as const,
    plan: 'mega',
    subscription_end_date: '29/08/2025',
    wallet_address: undefined
  }
}