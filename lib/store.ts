// Global state management using Zustand
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  subscription_status: 'active' | 'cancelled' | 'trial'
  wallet_address?: string
}

export interface AppState {
  user: User | null
  currentUserId: string | null // Track which customer is the current user
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setCurrentUserId: (userId: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      currentUserId: 'cust_001', // Default to first sample customer
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      setCurrentUserId: (currentUserId) => set({ currentUserId }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'app-storage', // unique name for localStorage key
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        // Fallback for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      partialize: (state) => ({ 
        currentUserId: state.currentUserId,
        user: state.user,
        // Don't persist loading/error states
      }),
      skipHydration: true, // Skip hydration to avoid SSR issues
    }
  )
)

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
  addCustomer: (customer: any) => void
  updateCustomer: (id: string, updates: any) => void
  removeCustomer: (id: string) => void
  addSubscription: (subscription: any) => void
  updateSubscription: (id: string, updates: any) => void
  removeSubscription: (id: string) => void
}

// Sample customer data for demonstration
const sampleCustomers = [
  {
    id: 'cust_001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    plan: 'Premium',
    status: 'active',
    total_spent: 2400,
    created_at: '2024-01-15T10:00:00Z',
    last_login: '2024-01-20T14:30:00Z',
    billing_address: { country: 'United States' },
    phone: '+1-555-0123',
    payment_methods: [{ type: 'credit_card', is_default: true }]
  },
  {
    id: 'cust_002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    plan: 'Basic',
    status: 'active',
    total_spent: 360,
    created_at: '2024-02-01T09:15:00Z',
    last_login: '2024-01-19T16:45:00Z',
    billing_address: { country: 'Canada' },
    phone: '+1-416-555-0987',
    payment_methods: [{ type: 'credit_card', is_default: true }]
  },
  {
    id: 'cust_003',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    plan: 'Enterprise',
    status: 'active',
    total_spent: 8400,
    created_at: '2023-11-10T11:30:00Z',
    last_login: '2024-01-20T10:15:00Z',
    billing_address: { country: 'Australia' },
    phone: '+61-2-9555-0246',
    payment_methods: [{ type: 'bank_transfer', is_default: true }]
  },
  {
    id: 'cust_004',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    plan: 'Premium',
    status: 'active',
    total_spent: 1800,
    created_at: '2024-01-05T08:45:00Z',
    last_login: '2024-01-18T13:20:00Z',
    billing_address: { country: 'Spain' },
    phone: '+34-91-555-0135',
    payment_methods: [{ type: 'credit_card', is_default: true }]
  }
]

// Sample subscription data
const sampleSubscriptions = [
  {
    id: 'sub_001',
    user_id: 'cust_001',
    plan_name: 'Premium',
    plan_id: 'premium',
    status: 'active',
    amount: 99.99,
    end_date: '2024-02-15'
  },
  {
    id: 'sub_002',
    user_id: 'cust_002',
    plan_name: 'Basic',
    plan_id: 'basic',
    status: 'active',
    amount: 29.99,
    end_date: '2024-02-01'
  },
  {
    id: 'sub_003',
    user_id: 'cust_003',
    plan_name: 'Enterprise',
    plan_id: 'enterprise',
    status: 'active',
    amount: 299.99,
    end_date: '2024-01-10'
  },
  {
    id: 'sub_004',
    user_id: 'cust_004',
    plan_name: 'Premium',
    plan_id: 'premium',
    status: 'active',
    amount: 99.99,
    end_date: '2024-02-05'
  }
]

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
  transactions: [],
  subscriptions: sampleSubscriptions,
  customers: sampleCustomers,
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
  },
  addCustomer: (customer: any) => {
    const currentCustomers = get().customers
    set({ customers: [...currentCustomers, customer] })
    get().updateLastUpdated('customers')
  },
  updateCustomer: (id: string, updates: any) => {
    const currentCustomers = get().customers
    const updatedCustomers = currentCustomers.map(c => 
      c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
    )
    console.log('Store updateCustomer called:', { id, updates, before: currentCustomers.find(c => c.id === id), after: updatedCustomers.find(c => c.id === id) })
    set({ customers: updatedCustomers })
    get().updateLastUpdated('customers')
    
    // Force persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('billing-storage', JSON.stringify({
        customers: updatedCustomers,
        subscriptions: get().subscriptions
      }))
    }
  },
  removeCustomer: (id: string) => {
    const currentCustomers = get().customers
    set({ customers: currentCustomers.filter(c => c.id !== id) })
    get().updateLastUpdated('customers')
  },
  addSubscription: (subscription: any) => {
    const currentSubscriptions = get().subscriptions
    set({ subscriptions: [...currentSubscriptions, subscription] })
    get().updateLastUpdated('subscriptions')
  },
  updateSubscription: (id: string, updates: any) => {
    const currentSubscriptions = get().subscriptions
    set({ 
      subscriptions: currentSubscriptions.map(s => 
        s.id === id ? { ...s, ...updates } : s
      ) 
    })
    get().updateLastUpdated('subscriptions')
  },
  removeSubscription: (id: string) => {
    const currentSubscriptions = get().subscriptions
    set({ subscriptions: currentSubscriptions.filter(s => s.id !== id) })
    get().updateLastUpdated('subscriptions')
  }
    }),
    {
      name: 'billing-storage', // unique name for localStorage key
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        // Fallback for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      partialize: (state) => ({ 
        customers: state.customers,
        subscriptions: state.subscriptions,
        // Don't persist loading states and timestamps
      }),
      skipHydration: true, // Skip hydration to avoid SSR issues
    }
  )
)

// Manual hydration for stores to ensure persistence works
export const hydrateStores = () => {
  if (typeof window !== 'undefined') {
    // Manually trigger hydration for both stores
    useAppStore.persist.rehydrate()
    useBillingStore.persist.rehydrate()
  }
}

// Unified customer data hook - connects current user to billing store
export const useCurrentCustomer = () => {
  const { currentUserId } = useAppStore()
  const { customers, updateCustomer: updateCustomerInStore } = useBillingStore()

  // Find current customer in billing store
  const currentCustomer = customers.find(c => c.id === currentUserId)

  // Return customer with update function
  return {
    customer: currentCustomer || null,
    updateCustomer: (updates: any) => {
      if (currentUserId) {
        console.log('Updating customer in store:', currentUserId, updates)
        updateCustomerInStore(currentUserId, updates)
      }
    },
    isLoading: false
  }
}

// Legacy hook for backward compatibility
export const useCustomerData = () => {
  const { customer } = useCurrentCustomer()
  const { subscriptions } = useBillingStore()
  
  // Find customer's subscription
  const customerSubscription = customer ? subscriptions.find(s => s.user_id === customer.id) : null
  
  // Return customer data formatted for legacy components
  return customer ? {
    id: customer.id,
    email: customer.email,
    name: customer.name,
    subscription_status: customer.status === 'active' ? 'active' as const : 'cancelled' as const,
    plan: customer.plan?.toLowerCase() || 'basic',
    subscription_end_date: customerSubscription?.end_date || '29/08/2025',
    wallet_address: undefined
  } : {
    id: 'demo-user',
    email: 'demo@streamplay.com',
    name: 'Demo User',
    subscription_status: 'active' as const,
    plan: 'basic',
    subscription_end_date: '29/08/2025',
    wallet_address: undefined
  }
}