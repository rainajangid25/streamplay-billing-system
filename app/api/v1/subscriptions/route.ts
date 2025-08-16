import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Middleware to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default-secret") as any

    // Check if token has required scope
    const scopes = decoded.scope ? decoded.scope.split(" ") : []
    if (!scopes.includes("subscriptions:manage") && !scopes.includes("billing:read")) {
      return null
    }

    return decoded
  } catch {
    return null
  }
}

// Mock subscription data (in production, this would be from database)
const mockSubscriptions = [
  {
    id: "sub_001",
    customer_id: "cust_001",
    customer_email: "alice@example.com",
    customer_name: "Alice Johnson",
    plan: "premium",
    status: "active",
    amount: 19.99,
    currency: "USD",
    billing_cycle: "monthly",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    next_billing_date: "2024-02-01T00:00:00Z",
    trial_end_date: null,
    cancelled_at: null,
    features: ["4K Streaming", "Multiple Devices", "Offline Downloads"],
    payment_method: {
      type: "credit_card",
      last4: "4242",
      brand: "visa",
    },
    metadata: {
      platform: "netflix_integration",
      source: "web",
      campaign: "summer_promo",
    },
  },
  {
    id: "sub_002",
    customer_id: "cust_002",
    customer_email: "bob@example.com",
    customer_name: "Bob Smith",
    plan: "basic",
    status: "active",
    amount: 9.99,
    currency: "USD",
    billing_cycle: "monthly",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    next_billing_date: "2024-02-15T00:00:00Z",
    trial_end_date: "2024-01-22T00:00:00Z",
    cancelled_at: null,
    features: ["HD Streaming", "Mobile Access"],
    payment_method: {
      type: "paypal",
      email: "bob@example.com",
    },
    metadata: {
      platform: "disney_integration",
      source: "mobile_app",
    },
  },
  {
    id: "sub_003",
    customer_id: "cust_003",
    customer_email: "carol@example.com",
    customer_name: "Carol Davis",
    plan: "enterprise",
    status: "past_due",
    amount: 49.99,
    currency: "USD",
    billing_cycle: "monthly",
    created_at: "2023-11-20T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
    next_billing_date: "2024-01-10T00:00:00Z",
    trial_end_date: null,
    cancelled_at: null,
    features: ["White Label", "Analytics", "API Access", "Priority Support"],
    payment_method: {
      type: "credit_card",
      last4: "1234",
      brand: "mastercard",
    },
    metadata: {
      platform: "prime_integration",
      source: "api",
    },
  },
]

// In-memory storage for demo
const subscriptions = [...mockSubscriptions]

// RESTful API for subscription management
export async function GET(request: NextRequest) {
  try {
    const tokenData = verifyToken(request)
    if (!tokenData) {
      return NextResponse.json(
        {
          error: "unauthorized",
          message: "Valid access token required",
        },
        { status: 401 },
      )
    }

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customer_id")
    const status = searchParams.get("status")
    const plan = searchParams.get("plan")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50"), 100) // Max 100
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const sortBy = searchParams.get("sort_by") || "created_at"
    const sortOrder = searchParams.get("sort_order") || "desc"

    // Filter subscriptions
    let filteredSubscriptions = subscriptions

    if (customerId) {
      filteredSubscriptions = filteredSubscriptions.filter((sub) => sub.customer_id === customerId)
    }

    if (status) {
      filteredSubscriptions = filteredSubscriptions.filter((sub) => sub.status === status)
    }

    if (plan) {
      filteredSubscriptions = filteredSubscriptions.filter((sub) => sub.plan === plan)
    }

    // Sort subscriptions
    filteredSubscriptions.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a]
      const bValue = b[sortBy as keyof typeof b]

      if (sortOrder === "desc") {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      }
    })

    // Apply pagination
    const paginatedSubscriptions = filteredSubscriptions.slice(offset, offset + limit)

    // Calculate summary statistics
    const summary = {
      total_subscriptions: filteredSubscriptions.length,
      active_subscriptions: filteredSubscriptions.filter((s) => s.status === "active").length,
      total_mrr: filteredSubscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + s.amount, 0),
      average_amount:
        filteredSubscriptions.length > 0
          ? filteredSubscriptions.reduce((sum, s) => sum + s.amount, 0) / filteredSubscriptions.length
          : 0,
      plan_distribution: {
        basic: filteredSubscriptions.filter((s) => s.plan === "basic").length,
        premium: filteredSubscriptions.filter((s) => s.plan === "premium").length,
        enterprise: filteredSubscriptions.filter((s) => s.plan === "enterprise").length,
      },
    }

    return NextResponse.json({
      data: paginatedSubscriptions,
      summary,
      pagination: {
        total: filteredSubscriptions.length,
        limit,
        offset,
        has_more: offset + limit < filteredSubscriptions.length,
        next_offset: offset + limit < filteredSubscriptions.length ? offset + limit : null,
      },
      meta: {
        request_id: `req_${Date.now()}`,
        timestamp: new Date().toISOString(),
        client_id: tokenData.client_id,
      },
    })
  } catch (error) {
    console.error("Subscriptions GET error:", error)
    return NextResponse.json(
      {
        error: "internal_error",
        message: "Failed to fetch subscriptions",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokenData = verifyToken(request)
    if (!tokenData) {
      return NextResponse.json(
        {
          error: "unauthorized",
          message: "Valid access token required",
        },
        { status: 401 },
      )
    }

    // Check if token has write permissions
    const scopes = tokenData.scope ? tokenData.scope.split(" ") : []
    if (!scopes.includes("subscriptions:manage")) {
      return NextResponse.json(
        {
          error: "insufficient_scope",
          message: "Token does not have subscriptions:manage scope",
        },
        { status: 403 },
      )
    }

    const body = await request.json()
    const {
      customer_id,
      customer_email,
      customer_name,
      plan,
      payment_method,
      billing_cycle = "monthly",
      trial_days = 0,
      metadata = {},
    } = body

    // Validate required fields
    const requiredFields = ["customer_id", "customer_email", "plan", "payment_method"]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: `Missing required fields: ${missingFields.join(", ")}`,
          missing_fields: missingFields,
        },
        { status: 400 },
      )
    }

    // Validate plan
    const planPrices = {
      basic: { price: 9.99, features: ["HD Streaming", "Mobile Access"] },
      premium: { price: 19.99, features: ["4K Streaming", "Multiple Devices", "Offline Downloads"] },
      enterprise: { price: 49.99, features: ["White Label", "Analytics", "API Access", "Priority Support"] },
    }

    if (!planPrices[plan as keyof typeof planPrices]) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid plan. Must be one of: basic, premium, enterprise",
          valid_plans: Object.keys(planPrices),
        },
        { status: 400 },
      )
    }

    // Validate billing cycle
    if (!["monthly", "yearly"].includes(billing_cycle)) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid billing_cycle. Must be 'monthly' or 'yearly'",
        },
        { status: 400 },
      )
    }

    // Check for existing active subscription
    const existingSubscription = subscriptions.find((sub) => sub.customer_id === customer_id && sub.status === "active")

    if (existingSubscription) {
      return NextResponse.json(
        {
          error: "conflict",
          message: "Customer already has an active subscription",
          existing_subscription_id: existingSubscription.id,
        },
        { status: 409 },
      )
    }

    const planConfig = planPrices[plan as keyof typeof planPrices]
    const amount = billing_cycle === "yearly" ? planConfig.price * 12 * 0.9 : planConfig.price // 10% discount for yearly

    // Create new subscription
    const newSubscription = {
      id: `sub_${Date.now()}`,
      customer_id,
      customer_email,
      customer_name: customer_name || "",
      plan,
      status: trial_days > 0 ? "trialing" : "active",
      amount,
      currency: "USD",
      billing_cycle,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      next_billing_date: new Date(Date.now() + (trial_days || 30) * 24 * 60 * 60 * 1000).toISOString(),
      trial_end_date: trial_days > 0 ? new Date(Date.now() + trial_days * 24 * 60 * 60 * 1000).toISOString() : null,
      cancelled_at: null,
      features: planConfig.features,
      payment_method: {
        type: payment_method.type,
        ...payment_method,
      },
      metadata: {
        platform: tokenData.client_id,
        created_by: "api",
        ...metadata,
      },
    }

    // Add to subscriptions array
    subscriptions.push(newSubscription)

    // Log subscription creation
    console.log("Created subscription:", {
      subscription_id: newSubscription.id,
      customer_id,
      plan,
      amount,
      client_id: tokenData.client_id,
    })

    return NextResponse.json(
      {
        data: newSubscription,
        message: "Subscription created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create subscription error:", error)
    return NextResponse.json(
      {
        error: "internal_error",
        message: "Failed to create subscription",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const tokenData = verifyToken(request)
    if (!tokenData) {
      return NextResponse.json(
        {
          error: "unauthorized",
          message: "Valid access token required",
        },
        { status: 401 },
      )
    }

    const scopes = tokenData.scope ? tokenData.scope.split(" ") : []
    if (!scopes.includes("subscriptions:manage")) {
      return NextResponse.json(
        {
          error: "insufficient_scope",
          message: "Token does not have subscriptions:manage scope",
        },
        { status: 403 },
      )
    }

    const { searchParams } = new URL(request.url)
    const subscriptionId = searchParams.get("id")

    if (!subscriptionId) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Subscription ID is required",
        },
        { status: 400 },
      )
    }

    const body = await request.json()
    const { plan, status, payment_method, metadata } = body

    // Find subscription
    const subscriptionIndex = subscriptions.findIndex((sub) => sub.id === subscriptionId)
    if (subscriptionIndex === -1) {
      return NextResponse.json(
        {
          error: "not_found",
          message: "Subscription not found",
        },
        { status: 404 },
      )
    }

    const subscription = subscriptions[subscriptionIndex]

    // Update subscription
    const updates: any = {
      updated_at: new Date().toISOString(),
    }

    if (plan) {
      const planPrices = {
        basic: { price: 9.99, features: ["HD Streaming", "Mobile Access"] },
        premium: { price: 19.99, features: ["4K Streaming", "Multiple Devices", "Offline Downloads"] },
        enterprise: { price: 49.99, features: ["White Label", "Analytics", "API Access", "Priority Support"] },
      }

      if (!planPrices[plan as keyof typeof planPrices]) {
        return NextResponse.json(
          {
            error: "validation_error",
            message: "Invalid plan",
          },
          { status: 400 },
        )
      }

      const planConfig = planPrices[plan as keyof typeof planPrices]
      updates.plan = plan
      updates.amount = subscription.billing_cycle === "yearly" ? planConfig.price * 12 * 0.9 : planConfig.price
      updates.features = planConfig.features
    }

    if (status) {
      if (!["active", "cancelled", "past_due", "trialing"].includes(status)) {
        return NextResponse.json(
          {
            error: "validation_error",
            message: "Invalid status",
          },
          { status: 400 },
        )
      }

      updates.status = status
      if (status === "cancelled") {
        updates.cancelled_at = new Date().toISOString()
      }
    }

    if (payment_method) {
      updates.payment_method = { ...subscription.payment_method, ...payment_method }
    }

    if (metadata) {
      updates.metadata = { ...subscription.metadata, ...metadata }
    }

    // Apply updates
    subscriptions[subscriptionIndex] = { ...subscription, ...updates }

    console.log("Updated subscription:", {
      subscription_id: subscriptionId,
      updates,
      client_id: tokenData.client_id,
    })

    return NextResponse.json({
      data: subscriptions[subscriptionIndex],
      message: "Subscription updated successfully",
    })
  } catch (error) {
    console.error("Update subscription error:", error)
    return NextResponse.json(
      {
        error: "internal_error",
        message: "Failed to update subscription",
      },
      { status: 500 },
    )
  }
}
