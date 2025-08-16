import { type NextRequest, NextResponse } from "next/server"
import { getStreamPlayService, isStreamPlayMockMode } from "@/lib/mock-streamplay-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const userId = searchParams.get("userId")
    const planId = searchParams.get("planId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const streamPlayService = await getStreamPlayService()

    switch (action) {
      case "health":
        const health = await streamPlayService.healthCheck()
        return NextResponse.json({
          ...health,
          mock_mode: isStreamPlayMockMode(),
        })

      case "users":
        const usersData = await streamPlayService.getUsers(limit, offset)
        return NextResponse.json(usersData)

      case "user":
        if (!userId) {
          return NextResponse.json({ error: "User ID required" }, { status: 400 })
        }
        const user = await streamPlayService.getUser(userId)
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        return NextResponse.json(user)

      case "plans":
        const plans = await streamPlayService.getSubscriptionPlans()
        return NextResponse.json(plans)

      case "plan":
        if (!planId) {
          return NextResponse.json({ error: "Plan ID required" }, { status: 400 })
        }
        const plan = await streamPlayService.getSubscriptionPlan(planId)
        if (!plan) {
          return NextResponse.json({ error: "Plan not found" }, { status: 404 })
        }
        return NextResponse.json(plan)

      case "analytics":
        const analytics = await streamPlayService.getSubscriptionAnalytics()
        return NextResponse.json(analytics)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("StreamPlay API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, planId, email } = body

    const streamPlayService = await getStreamPlayService()

    switch (action) {
      case "create_subscription":
        if (!userId || !planId) {
          return NextResponse.json({ error: "User ID and Plan ID required" }, { status: 400 })
        }
        const createResult = await streamPlayService.createSubscription(userId, planId)
        return NextResponse.json(createResult)

      case "cancel_subscription":
        if (!userId) {
          return NextResponse.json({ error: "User ID required" }, { status: 400 })
        }
        const cancelResult = await streamPlayService.cancelSubscription(userId)
        return NextResponse.json(cancelResult)

      case "update_subscription":
        if (!userId || !planId) {
          return NextResponse.json({ error: "User ID and Plan ID required" }, { status: 400 })
        }
        const updateResult = await streamPlayService.updateSubscription(userId, planId)
        return NextResponse.json(updateResult)

      case "get_user_by_email":
        if (!email) {
          return NextResponse.json({ error: "Email required" }, { status: 400 })
        }
        const userByEmail = await streamPlayService.getUserByEmail(email)
        if (!userByEmail) {
          return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        return NextResponse.json(userByEmail)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("StreamPlay API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, planId } = body

    if (!userId || !planId) {
      return NextResponse.json({ error: "User ID and Plan ID required" }, { status: 400 })
    }

    const streamPlayService = await getStreamPlayService()
    const result = await streamPlayService.updateSubscription(userId, planId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("StreamPlay API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const streamPlayService = await getStreamPlayService()
    const result = await streamPlayService.cancelSubscription(userId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("StreamPlay API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
