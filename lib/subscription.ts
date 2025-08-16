// Subscription management utilities
export interface Subscription {
  id: string
  customer_id: string
  plan_name: string
  status: 'active' | 'cancelled' | 'paused'
  amount: number
  currency: string
  next_billing_date: string
  created_at: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
}

// Mock subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    description: 'Essential streaming features',
    price: 9.99,
    currency: 'USD',
    interval: 'monthly',
    features: ['HD Streaming', '2 Devices', 'Basic Support']
  },
  {
    id: 'premium',
    name: 'Premium Plan', 
    description: 'Advanced streaming with premium content',
    price: 19.99,
    currency: 'USD',
    interval: 'monthly',
    features: ['4K Streaming', '5 Devices', 'Priority Support', 'Premium Content']
  },
  {
    id: 'family',
    name: 'Family Plan',
    description: 'Perfect for families',
    price: 29.99,
    currency: 'USD',
    interval: 'monthly',
    features: ['4K Streaming', 'Unlimited Devices', '24/7 Support', 'Family Profiles']
  }
]

export const getSubscriptionById = (id: string): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.id === id)
}

export const formatPrice = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

// Missing exports for app components
export class SubscriptionService {
  static async getSubscriptions() {
    return []
  }
}

export class SubscriptionAnalytics {
  static async getAnalytics() {
    return {}
  }
}