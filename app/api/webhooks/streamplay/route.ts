import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getStreamPlayService, isStreamPlayMockMode } from "@/lib/mock-streamplay-service"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo-key'
)

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (in mock mode, we skip this)
    if (!isStreamPlayMockMode()) {
      const signature = request.headers.get("x-streamplay-signature")
      const webhookSecret = process.env.STREAMPLAY_WEBHOOK_SECRET

      if (!signature || !webhookSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // In real implementation, verify the signature here
      // const isValid = verifyWebhookSignature(body, signature, webhookSecret);
      // if (!isValid) {
      //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      // }
    }

    const webhookData = await request.json()
    console.log("StreamPlay webhook received:", webhookData)

    const { event_type, user_id, data } = webhookData

    // Process different webhook events
    switch (event_type) {
      case "subscription.created":
        await handleSubscriptionCreated(user_id, data)
        break

      case "subscription.updated":
        await handleSubscriptionUpdated(user_id, data)
        break

      case "subscription.cancelled":
        await handleSubscriptionCancelled(user_id, data)
        break

      case "user.created":
        await handleUserCreated(user_id, data)
        break

      case "payment.completed":
        await handlePaymentCompleted(user_id, data)
        break

      default:
        console.log(`Unhandled webhook event: ${event_type}`)
    }

    // Log webhook event
    await supabase.from("webhook_events").insert({
      source: "streamplay",
      event_type,
      user_id,
      data,
      processed_at: new Date().toISOString(),
      status: "processed",
    })

    return NextResponse.json({ success: true, message: "Webhook processed" })
  } catch (error) {
    console.error("StreamPlay webhook error:", error)

    // Log failed webhook
    try {
      await supabase.from("webhook_events").insert({
        source: "streamplay",
        event_type: "error",
        data: { error: error instanceof Error ? error.message : "Unknown error" },
        processed_at: new Date().toISOString(),
        status: "failed",
      })
    } catch (logError) {
      console.error("Failed to log webhook error:", logError)
    }

    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleSubscriptionCreated(userId: string, data: any) {
  console.log(`Processing subscription created for user: ${userId}`)

  try {
    // Get StreamPlay user data
    const streamPlayService = await getStreamPlayService()
    const user = await streamPlayService.getUser(userId)

    if (!user) {
      console.error(`User ${userId} not found in StreamPlay`)
      return
    }

    // Create or update customer in our billing system
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("*")
      .eq("streamplay_user_id", userId)
      .single()

    if (!existingCustomer) {
      // Create new customer
      await supabase.from("customers").insert({
        name: user.name,
        email: user.email,
        streamplay_user_id: userId,
        subscription_status: user.subscription_status,
        subscription_plan: user.subscription_plan,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } else {
      // Update existing customer
      await supabase
        .from("customers")
        .update({
          subscription_status: user.subscription_status,
          subscription_plan: user.subscription_plan,
          updated_at: new Date().toISOString(),
        })
        .eq("streamplay_user_id", userId)
    }

    // Create subscription record
    await supabase.from("subscriptions").insert({
      customer_id: existingCustomer?.id || userId,
      streamplay_user_id: userId,
      plan_id: data.plan_id || user.subscription_plan,
      status: "active",
      start_date: user.subscription_start_date,
      created_at: new Date().toISOString(),
    })

    console.log(`Subscription created successfully for user: ${userId}`)
  } catch (error) {
    console.error(`Error handling subscription created for user ${userId}:`, error)
    throw error
  }
}

async function handleSubscriptionUpdated(userId: string, data: any) {
  console.log(`Processing subscription updated for user: ${userId}`)

  try {
    // Update customer subscription status
    await supabase
      .from("customers")
      .update({
        subscription_status: data.status || "active",
        subscription_plan: data.plan_id || data.plan,
        updated_at: new Date().toISOString(),
      })
      .eq("streamplay_user_id", userId)

    // Update subscription record
    await supabase
      .from("subscriptions")
      .update({
        plan_id: data.plan_id || data.plan,
        status: data.status || "active",
        updated_at: new Date().toISOString(),
      })
      .eq("streamplay_user_id", userId)

    console.log(`Subscription updated successfully for user: ${userId}`)
  } catch (error) {
    console.error(`Error handling subscription updated for user ${userId}:`, error)
    throw error
  }
}

async function handleSubscriptionCancelled(userId: string, data: any) {
  console.log(`Processing subscription cancelled for user: ${userId}`)

  try {
    // Update customer subscription status
    await supabase
      .from("customers")
      .update({
        subscription_status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("streamplay_user_id", userId)

    // Update subscription record
    await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        end_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("streamplay_user_id", userId)

    console.log(`Subscription cancelled successfully for user: ${userId}`)
  } catch (error) {
    console.error(`Error handling subscription cancelled for user ${userId}:`, error)
    throw error
  }
}

async function handleUserCreated(userId: string, data: any) {
  console.log(`Processing user created: ${userId}`)

  try {
    // Create customer record
    await supabase.from("customers").insert({
      name: data.name || "New User",
      email: data.email,
      streamplay_user_id: userId,
      subscription_status: "inactive",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    console.log(`User created successfully: ${userId}`)
  } catch (error) {
    console.error(`Error handling user created ${userId}:`, error)
    throw error
  }
}

async function handlePaymentCompleted(userId: string, data: any) {
  console.log(`Processing payment completed for user: ${userId}`)

  try {
    // Create invoice record
    await supabase.from("invoices").insert({
      customer_id: userId,
      amount: data.amount || 0,
      currency: data.currency || "USD",
      status: "paid",
      payment_method: data.payment_method || "unknown",
      streamplay_payment_id: data.payment_id,
      created_at: new Date().toISOString(),
      paid_at: new Date().toISOString(),
    })

    console.log(`Payment processed successfully for user: ${userId}`)
  } catch (error) {
    console.error(`Error handling payment completed for user ${userId}:`, error)
    throw error
  }
}

// GET endpoint for webhook verification (some services require this)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get("challenge")

  if (challenge) {
    return NextResponse.json({ challenge })
  }

  return NextResponse.json({
    status: "ok",
    message: "StreamPlay webhook endpoint",
    mock_mode: isStreamPlayMockMode(),
  })
}
