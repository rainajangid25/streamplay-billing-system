// Mock StreamPlay Service for demonstration purposes
// This simulates the StreamPlay API without requiring actual credentials

export interface StreamPlayUser {
  id: string
  email: string
  name: string
  subscription_status: "active" | "inactive" | "cancelled" | "trial"
  subscription_plan: string
  subscription_start_date: string
  subscription_end_date?: string
  payment_method?: string
  total_watch_time: number
  favorite_genres: string[]
  last_active: string
}

export interface StreamPlaySubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  billing_cycle: "monthly" | "yearly"
  features: string[]
  max_streams: number
  video_quality: string
}

export interface StreamPlayWebhookEvent {
  event_type:
    | "subscription.created"
    | "subscription.updated"
    | "subscription.cancelled"
    | "user.created"
    | "payment.completed"
  user_id: string
  subscription_id?: string
  plan_id?: string
  timestamp: string
  data: any
}

class MockStreamPlayService {
  private mockUsers: StreamPlayUser[] = [
    {
      id: "user_001",
      email: "john.doe@example.com",
      name: "John Doe",
      subscription_status: "active",
      subscription_plan: "premium",
      subscription_start_date: "2024-01-15T00:00:00Z",
      payment_method: "credit_card",
      total_watch_time: 12450,
      favorite_genres: ["Action", "Sci-Fi", "Drama"],
      last_active: "2024-01-20T14:30:00Z",
    },
    {
      id: "user_002",
      email: "jane.smith@example.com",
      name: "Jane Smith",
      subscription_status: "trial",
      subscription_plan: "basic",
      subscription_start_date: "2024-01-18T00:00:00Z",
      subscription_end_date: "2024-01-25T00:00:00Z",
      total_watch_time: 3200,
      favorite_genres: ["Comedy", "Romance"],
      last_active: "2024-01-21T09:15:00Z",
    },
    {
      id: "user_003",
      email: "mike.wilson@example.com",
      name: "Mike Wilson",
      subscription_status: "cancelled",
      subscription_plan: "standard",
      subscription_start_date: "2023-12-01T00:00:00Z",
      subscription_end_date: "2024-01-10T00:00:00Z",
      total_watch_time: 8900,
      favorite_genres: ["Documentary", "History"],
      last_active: "2024-01-08T20:45:00Z",
    },
  ]

  private mockPlans: StreamPlaySubscriptionPlan[] = [
    {
      id: "plan_basic",
      name: "Basic",
      price: 9.99,
      currency: "USD",
      billing_cycle: "monthly",
      features: ["HD Streaming", "1 Device", "Limited Content"],
      max_streams: 1,
      video_quality: "HD",
    },
    {
      id: "plan_standard",
      name: "Standard",
      price: 15.99,
      currency: "USD",
      billing_cycle: "monthly",
      features: ["Full HD Streaming", "2 Devices", "Full Content Library"],
      max_streams: 2,
      video_quality: "Full HD",
    },
    {
      id: "plan_premium",
      name: "Premium",
      price: 19.99,
      currency: "USD",
      billing_cycle: "monthly",
      features: ["4K Streaming", "4 Devices", "Full Content + Exclusives", "Offline Downloads"],
      max_streams: 4,
      video_quality: "4K Ultra HD",
    },
    {
      id: "plan_premium_yearly",
      name: "Premium Yearly",
      price: 199.99,
      currency: "USD",
      billing_cycle: "yearly",
      features: ["4K Streaming", "4 Devices", "Full Content + Exclusives", "Offline Downloads", "2 Months Free"],
      max_streams: 4,
      video_quality: "4K Ultra HD",
    },
  ]

  async getUsers(limit = 50, offset = 0): Promise<{ users: StreamPlayUser[]; total: number }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    const start = offset
    const end = offset + limit
    const users = this.mockUsers.slice(start, end)

    return {
      users,
      total: this.mockUsers.length,
    }
  }

  async getUser(userId: string): Promise<StreamPlayUser | null> {
    await new Promise((resolve) => setTimeout(resolve, 150))

    const user = this.mockUsers.find((u) => u.id === userId)
    return user || null
  }

  async getUserByEmail(email: string): Promise<StreamPlayUser | null> {
    await new Promise((resolve) => setTimeout(resolve, 150))

    const user = this.mockUsers.find((u) => u.email === email)
    return user || null
  }

  async getSubscriptionPlans(): Promise<StreamPlaySubscriptionPlan[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return [...this.mockPlans]
  }

  async getSubscriptionPlan(planId: string): Promise<StreamPlaySubscriptionPlan | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const plan = this.mockPlans.find((p) => p.id === planId)
    return plan || null
  }

  async createSubscription(
    userId: string,
    planId: string,
  ): Promise<{ success: boolean; subscription_id?: string; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const user = this.mockUsers.find((u) => u.id === userId)
    const plan = this.mockPlans.find((p) => p.id === planId)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    if (!plan) {
      return { success: false, error: "Plan not found" }
    }

    // Update user subscription
    user.subscription_status = "active"
    user.subscription_plan = plan.name.toLowerCase()
    user.subscription_start_date = new Date().toISOString()
    user.payment_method = "credit_card"

    const subscriptionId = `sub_${Date.now()}_${userId}`

    return {
      success: true,
      subscription_id: subscriptionId,
    }
  }

  async cancelSubscription(userId: string): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 250))

    const user = this.mockUsers.find((u) => u.id === userId)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    user.subscription_status = "cancelled"
    user.subscription_end_date = new Date().toISOString()

    return { success: true }
  }

  async updateSubscription(userId: string, planId: string): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 250))

    const user = this.mockUsers.find((u) => u.id === userId)
    const plan = this.mockPlans.find((p) => p.id === planId)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    if (!plan) {
      return { success: false, error: "Plan not found" }
    }

    user.subscription_plan = plan.name.toLowerCase()

    return { success: true }
  }

  async getSubscriptionAnalytics(): Promise<{
    total_subscribers: number
    active_subscribers: number
    trial_users: number
    cancelled_users: number
    monthly_revenue: number
    churn_rate: number
    popular_plans: { plan: string; count: number }[]
  }> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const totalSubscribers = this.mockUsers.length
    const activeSubscribers = this.mockUsers.filter((u) => u.subscription_status === "active").length
    const trialUsers = this.mockUsers.filter((u) => u.subscription_status === "trial").length
    const cancelledUsers = this.mockUsers.filter((u) => u.subscription_status === "cancelled").length

    // Calculate mock revenue
    let monthlyRevenue = 0
    this.mockUsers.forEach((user) => {
      if (user.subscription_status === "active") {
        const plan = this.mockPlans.find((p) => p.name.toLowerCase() === user.subscription_plan)
        if (plan && plan.billing_cycle === "monthly") {
          monthlyRevenue += plan.price
        } else if (plan && plan.billing_cycle === "yearly") {
          monthlyRevenue += plan.price / 12
        }
      }
    })

    const churnRate = totalSubscribers > 0 ? (cancelledUsers / totalSubscribers) * 100 : 0

    // Popular plans
    const planCounts: { [key: string]: number } = {}
    this.mockUsers.forEach((user) => {
      if (user.subscription_status === "active") {
        planCounts[user.subscription_plan] = (planCounts[user.subscription_plan] || 0) + 1
      }
    })

    const popularPlans = Object.entries(planCounts)
      .map(([plan, count]) => ({ plan, count }))
      .sort((a, b) => b.count - a.count)

    return {
      total_subscribers: totalSubscribers,
      active_subscribers: activeSubscribers,
      trial_users: trialUsers,
      cancelled_users: cancelledUsers,
      monthly_revenue: Math.round(monthlyRevenue * 100) / 100,
      churn_rate: Math.round(churnRate * 100) / 100,
      popular_plans: popularPlans,
    }
  }

  // Webhook simulation
  generateWebhookEvent(
    eventType: StreamPlayWebhookEvent["event_type"],
    userId: string,
    additionalData: any = {},
  ): StreamPlayWebhookEvent {
    return {
      event_type: eventType,
      user_id: userId,
      timestamp: new Date().toISOString(),
      data: {
        ...additionalData,
        source: "streamplay_mock",
      },
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: "ok" | "error"; message: string; timestamp: string }> {
    await new Promise((resolve) => setTimeout(resolve, 50))

    return {
      status: "ok",
      message: "StreamPlay Mock Service is running",
      timestamp: new Date().toISOString(),
    }
  }
}

// Export singleton instance
export const mockStreamPlayService = new MockStreamPlayService()

// Helper function to check if we're in mock mode
export function isStreamPlayMockMode(): boolean {
  return process.env.STREAMPLAY_MOCK_MODE === "true" || !process.env.STREAMPLAY_API_KEY
}

// Main service function that switches between mock and real service
export async function getStreamPlayService() {
  if (isStreamPlayMockMode()) {
    return mockStreamPlayService
  }

  // In the future, return real StreamPlay service here
  // return realStreamPlayService;
  return mockStreamPlayService
}
