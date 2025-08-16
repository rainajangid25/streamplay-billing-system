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
  isLoadingTransactions: boolean
  isLoadingSubscriptions: boolean
  setTransactions: (transactions: any[]) => void
  setSubscriptions: (subscriptions: any[]) => void
  setLoadingTransactions: (loading: boolean) => void
  setLoadingSubscriptions: (loading: boolean) => void
}

export const useBillingStore = create<BillingState>((set) => ({
  transactions: [],
  subscriptions: [],
  isLoadingTransactions: false,
  isLoadingSubscriptions: false,
  setTransactions: (transactions) => set({ transactions }),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  setLoadingTransactions: (isLoadingTransactions) => set({ isLoadingTransactions }),
  setLoadingSubscriptions: (isLoadingSubscriptions) => set({ isLoadingSubscriptions }),
}))