interface ApiClientConfig {
  baseUrl?: string
  clientId: string
  clientSecret: string
  environment?: "production" | "sandbox"
}

interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  scope: string
}

interface Subscription {
  id: string
  customer_id: string
  customer_email: string
  plan: string
  status: string
  amount: number
  currency: string
  billing_cycle: string
  created_at: string
  next_billing_date: string
  features: string[]
}

export class GoBillApiClient {
  private baseUrl: string
  private clientId: string
  private clientSecret: string
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private tokenExpiry = 0

  constructor(config: ApiClientConfig) {
    this.baseUrl =
      config.baseUrl || (config.environment === "sandbox" ? "https://sandbox-api.gobill.ai" : "https://api.gobill.ai")
    this.clientId = config.clientId
    this.clientSecret = config.clientSecret
  }

  private async authenticate(): Promise<void> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return // Token is still valid
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "client_credentials",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Authentication failed: ${error.error_description || error.message}`)
      }

      const authData: AuthResponse = await response.json()
      this.accessToken = authData.access_token
      this.refreshToken = authData.refresh_token
      this.tokenExpiry = Date.now() + authData.expires_in * 1000 - 60000 // Refresh 1 minute early
    } catch (error) {
      throw new Error(`Failed to authenticate: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    await this.authenticate()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`API request failed: ${error.message || error.error_description || "Unknown error"}`)
    }

    return response.json()
  }

  // Subscription methods
  async getSubscriptions(params?: {
    customer_id?: string
    status?: string
    plan?: string
    limit?: number
    offset?: number
  }): Promise<{ data: Subscription[]; pagination: any; summary: any }> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
    }

    return this.makeRequest(`/api/v1/subscriptions?${searchParams.toString()}`)
  }

  async createSubscription(data: {
    customer_id: string
    customer_email: string
    customer_name?: string
    plan: string
    payment_method: any
    billing_cycle?: string
    trial_days?: number
    metadata?: Record<string, any>
  }): Promise<{ data: Subscription; message: string }> {
    return this.makeRequest("/api/v1/subscriptions", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateSubscription(
    subscriptionId: string,
    updates: {
      plan?: string
      status?: string
      payment_method?: any
      metadata?: Record<string, any>
    },
  ): Promise<{ data: Subscription; message: string }> {
    return this.makeRequest(`/api/v1/subscriptions?id=${subscriptionId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  }

  // StreamPlay Integration methods - Works for any user ID
  async getStreamPlayPlans(): Promise<any> {
    return this.makeRequest("/api/integrations/streamplay?action=get_plans", {
      headers: {
        "x-streamplay-api-key": process.env.STREAMPLAY_API_KEY || "",
      },
    })
  }

  async getStreamPlayUserSubscription(userId: string): Promise<any> {
    return this.makeRequest(`/api/integrations/streamplay?action=get_user_subscription&user_id=${userId}`, {
      headers: {
        "x-streamplay-api-key": process.env.STREAMPLAY_API_KEY || "",
      },
    })
  }

  async createStreamPlaySubscription(data: {
    plan_id: string
    user_id: string // Any StreamPlay user ID
    user_email: string
    payment_method: any
  }): Promise<any> {
    return this.makeRequest("/api/integrations/streamplay", {
      method: "POST",
      headers: {
        "x-streamplay-api-key": process.env.STREAMPLAY_API_KEY || "",
      },
      body: JSON.stringify({
        action: "create_subscription",
        data,
      }),
    })
  }

  // OTT Integration methods
  async getOttAnalytics(
    action:
      | "subscription_status"
      | "user_analytics"
      | "content_recommendations"
      | "billing_analytics"
      | "fraud_detection",
  ): Promise<any> {
    return this.makeRequest(`/api/integrations/ott?action=${action}`, {
      headers: {
        "x-api-key": process.env.OTT_API_KEY || "",
      },
    })
  }

  async processOttAction(action: string, data: any): Promise<any> {
    return this.makeRequest("/api/integrations/ott", {
      method: "POST",
      headers: {
        "x-api-key": process.env.OTT_API_KEY || "",
      },
      body: JSON.stringify({ action, data }),
    })
  }

  // Webhook verification
  static verifyWebhookSignature(payload: string, signature: string, timestamp: string, secret: string): boolean {
    const crypto = require("crypto")
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(timestamp + payload)
      .digest("hex")

    return signature === `sha256=${expectedSignature}`
  }

  // Utility methods
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`)
      return response.json()
    } catch (error) {
      throw new Error(`Health check failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }
}

// Export singleton instance
export const createApiClient = (config: ApiClientConfig) => new GoBillApiClient(config)

// StreamPlay specific client - Works for any user
export const createStreamPlayClient = (apiKey: string, baseUrl?: string) => {
  return {
    async getPlans() {
      const response = await fetch(`${baseUrl || ""}/api/integrations/streamplay?action=get_plans`, {
        headers: {
          "x-streamplay-api-key": apiKey,
        },
      })
      return response.json()
    },

    // Get subscription for any specific user
    async getUserSubscription(userId: string) {
      const response = await fetch(
        `${baseUrl || ""}/api/integrations/streamplay?action=get_user_subscription&user_id=${userId}`,
        {
          headers: {
            "x-streamplay-api-key": apiKey,
          },
        },
      )
      return response.json()
    },

    // Create subscription for any specific user
    async createSubscription(data: {
      plan_id: string
      user_id: string // Works with any StreamPlay user ID
      user_email: string
      payment_method: any
    }) {
      const response = await fetch(`${baseUrl || ""}/api/integrations/streamplay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-streamplay-api-key": apiKey,
        },
        body: JSON.stringify({
          action: "create_subscription",
          data,
        }),
      })
      return response.json()
    },

    // Update subscription for specific user
    async updateSubscription(subscriptionId: string, userId: string, updates: any) {
      const response = await fetch(`${baseUrl || ""}/api/integrations/streamplay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-streamplay-api-key": apiKey,
        },
        body: JSON.stringify({
          action: "update_subscription",
          data: {
            subscription_id: subscriptionId,
            user_id: userId,
            updates,
          },
        }),
      })
      return response.json()
    },

    // Cancel subscription for specific user
    async cancelSubscription(subscriptionId: string, userId: string) {
      const response = await fetch(`${baseUrl || ""}/api/integrations/streamplay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-streamplay-api-key": apiKey,
        },
        body: JSON.stringify({
          action: "cancel_subscription",
          data: {
            subscription_id: subscriptionId,
            user_id: userId,
          },
        }),
      })
      return response.json()
    },
  }
}

// Helper function to create user-specific StreamPlay integration
export const createUserStreamPlayIntegration = (userId: string, apiKey: string, baseUrl?: string) => {
  const client = createStreamPlayClient(apiKey, baseUrl)

  return {
    // Pre-configured methods for this specific user
    async getMySubscription() {
      return client.getUserSubscription(userId)
    },

    async subscribeToplan(planId: string, userEmail: string, paymentMethod: any) {
      return client.createSubscription({
        plan_id: planId,
        user_id: userId,
        user_email: userEmail,
        payment_method: paymentMethod,
      })
    },

    async updateMySubscription(subscriptionId: string, updates: any) {
      return client.updateSubscription(subscriptionId, userId, updates)
    },

    async cancelMySubscription(subscriptionId: string) {
      return client.cancelSubscription(subscriptionId, userId)
    },
  }
}
