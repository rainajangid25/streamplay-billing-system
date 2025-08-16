import { supabase } from "@/lib/supabase"

const testCustomers = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@streamflix.com",
    phone: "+1-555-0123",
    country: "United States",
    subscription_status: "active",
    wallet_address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    total_spent: 2450.0,
    churn_risk_level: "low",
    language: "en",
    timezone: "America/New_York",
    company_name: "StreamFlix Inc",
    industry: "Entertainment",
    account_type: "business",
  },
  {
    name: "Bob Smith",
    email: "bob.smith@techcorp.io",
    phone: "+1-555-0456",
    country: "Canada",
    subscription_status: "active",
    wallet_address: "0x8ba1f109551bD432803012645Hac136c0532925a",
    total_spent: 8900.0,
    churn_risk_level: "low",
    language: "en",
    timezone: "America/Toronto",
    company_name: "TechCorp Solutions",
    industry: "Technology",
    account_type: "enterprise",
  },
  {
    name: "Carol Davis",
    email: "carol.davis@startup.co",
    phone: "+1-555-0789",
    country: "United States",
    subscription_status: "inactive",
    total_spent: 299.0,
    churn_risk_level: "high",
    language: "en",
    timezone: "America/Los_Angeles",
    company_name: "Startup Co",
    industry: "SaaS",
    account_type: "business",
  },
  {
    name: "David Wilson",
    email: "david.wilson@mediahouse.uk",
    phone: "+44-20-7946-0958",
    country: "United Kingdom",
    subscription_status: "active",
    wallet_address: "0x1234567890abcdef1234567890abcdef12345678",
    total_spent: 5670.0,
    churn_risk_level: "medium",
    language: "en",
    timezone: "Europe/London",
    company_name: "MediaHouse UK",
    industry: "Media",
    account_type: "enterprise",
  },
  {
    name: "Emma Rodriguez",
    email: "emma.rodriguez@contentstudio.es",
    phone: "+34-91-123-4567",
    country: "Spain",
    subscription_status: "active",
    total_spent: 1850.0,
    churn_risk_level: "low",
    language: "es",
    timezone: "Europe/Madrid",
    company_name: "Content Studio",
    industry: "Content Creation",
    account_type: "business",
  },
  {
    name: "Frank Chen",
    email: "frank.chen@streamasia.sg",
    phone: "+65-6123-4567",
    country: "Singapore",
    subscription_status: "cancelled",
    wallet_address: "0xabcdef1234567890abcdef1234567890abcdef12",
    total_spent: 750.0,
    churn_risk_level: "high",
    language: "en",
    timezone: "Asia/Singapore",
    company_name: "StreamAsia Pte Ltd",
    industry: "Streaming",
    account_type: "business",
  },
  {
    name: "Grace Kim",
    email: "grace.kim@kpopstream.kr",
    phone: "+82-2-1234-5678",
    country: "South Korea",
    subscription_status: "active",
    wallet_address: "0x9876543210fedcba9876543210fedcba98765432",
    total_spent: 3200.0,
    churn_risk_level: "low",
    language: "ko",
    timezone: "Asia/Seoul",
    company_name: "K-Pop Stream",
    industry: "Music Streaming",
    account_type: "business",
  },
  {
    name: "Hans Mueller",
    email: "hans.mueller@deutscheott.de",
    phone: "+49-30-12345678",
    country: "Germany",
    subscription_status: "active",
    total_spent: 4100.0,
    churn_risk_level: "low",
    language: "de",
    timezone: "Europe/Berlin",
    company_name: "Deutsche OTT GmbH",
    industry: "Broadcasting",
    account_type: "enterprise",
  },
  {
    name: "Isabella Santos",
    email: "isabella.santos@streamlatam.br",
    phone: "+55-11-98765-4321",
    country: "Brazil",
    subscription_status: "expired",
    total_spent: 890.0,
    churn_risk_level: "high",
    language: "pt",
    timezone: "America/Sao_Paulo",
    company_name: "StreamLatam",
    industry: "Entertainment",
    account_type: "business",
  },
  {
    name: "James Thompson",
    email: "james.thompson@aussiestream.au",
    phone: "+61-2-9876-5432",
    country: "Australia",
    subscription_status: "active",
    wallet_address: "0xfedcba0987654321fedcba0987654321fedcba09",
    total_spent: 2780.0,
    churn_risk_level: "medium",
    language: "en",
    timezone: "Australia/Sydney",
    company_name: "Aussie Stream Pty Ltd",
    industry: "Streaming",
    account_type: "business",
  },
]

const testSubscriptions = [
  {
    customer_email: "alice.johnson@streamflix.com",
    plan_name: "Premium OTT",
    amount: 99.99,
    currency: "USD",
    billing_cycle: "monthly",
    status: "active",
    next_billing_date: "2024-02-15T00:00:00Z",
  },
  {
    customer_email: "bob.smith@techcorp.io",
    plan_name: "Enterprise Multi-Channel",
    amount: 299.99,
    currency: "USD",
    billing_cycle: "monthly",
    status: "active",
    next_billing_date: "2024-02-20T00:00:00Z",
  },
  {
    customer_email: "carol.davis@startup.co",
    plan_name: "Basic Streaming",
    amount: 29.99,
    currency: "USD",
    billing_cycle: "monthly",
    status: "cancelled",
    next_billing_date: null,
  },
  {
    customer_email: "david.wilson@mediahouse.uk",
    plan_name: "Professional Broadcasting",
    amount: 199.99,
    currency: "GBP",
    billing_cycle: "monthly",
    status: "active",
    next_billing_date: "2024-02-18T00:00:00Z",
  },
  {
    customer_email: "emma.rodriguez@contentstudio.es",
    plan_name: "Content Creator Pro",
    amount: 79.99,
    currency: "EUR",
    billing_cycle: "monthly",
    status: "active",
    next_billing_date: "2024-02-22T00:00:00Z",
  },
]

const testTransactions = [
  {
    customer_email: "alice.johnson@streamflix.com",
    amount: 99.99,
    currency: "USD",
    payment_method: "ethereum",
    blockchain_tx_hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    status: "completed",
    transaction_type: "subscription_payment",
  },
  {
    customer_email: "bob.smith@techcorp.io",
    amount: 299.99,
    currency: "USD",
    payment_method: "credit_card",
    status: "completed",
    transaction_type: "subscription_payment",
  },
  {
    customer_email: "david.wilson@mediahouse.uk",
    amount: 199.99,
    currency: "GBP",
    payment_method: "usdc",
    blockchain_tx_hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    status: "completed",
    transaction_type: "subscription_payment",
  },
  {
    customer_email: "emma.rodriguez@contentstudio.es",
    amount: 79.99,
    currency: "EUR",
    payment_method: "bitcoin",
    blockchain_tx_hash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    status: "pending",
    transaction_type: "subscription_payment",
  },
  {
    customer_email: "grace.kim@kpopstream.kr",
    amount: 149.99,
    currency: "USD",
    payment_method: "polygon",
    blockchain_tx_hash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
    status: "completed",
    transaction_type: "one_time_payment",
  },
]

export async function seedCustomers() {
  console.log("🌱 Starting customer seeding...")

  try {
    // Insert customers
    console.log("📝 Inserting customers...")
    const { data: customers, error: customersError } = await supabase.from("customers").insert(testCustomers).select()

    if (customersError) {
      console.error("❌ Error inserting customers:", customersError)
      return
    }

    console.log(`✅ Inserted ${customers?.length} customers`)

    // Create a map of email to customer ID
    const customerMap = new Map()
    customers?.forEach((customer) => {
      customerMap.set(customer.email, customer.id)
    })

    // Insert subscriptions
    console.log("📋 Inserting subscriptions...")
    const subscriptionsWithIds = testSubscriptions.map((sub) => ({
      ...sub,
      customer_id: customerMap.get(sub.customer_email),
      customer_email: undefined, // Remove email field
    }))

    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from("subscriptions")
      .insert(subscriptionsWithIds)
      .select()

    if (subscriptionsError) {
      console.error("❌ Error inserting subscriptions:", subscriptionsError)
    } else {
      console.log(`✅ Inserted ${subscriptions?.length} subscriptions`)
    }

    // Insert transactions
    console.log("💳 Inserting transactions...")
    const transactionsWithIds = testTransactions.map((tx) => ({
      ...tx,
      customer_id: customerMap.get(tx.customer_email),
      customer_email: undefined, // Remove email field
    }))

    const { data: transactions, error: transactionsError } = await supabase
      .from("transactions")
      .insert(transactionsWithIds)
      .select()

    if (transactionsError) {
      console.error("❌ Error inserting transactions:", transactionsError)
    } else {
      console.log(`✅ Inserted ${transactions?.length} transactions`)
    }

    console.log("🎉 Customer seeding completed successfully!")

    return {
      customers: customers?.length || 0,
      subscriptions: subscriptions?.length || 0,
      transactions: transactions?.length || 0,
    }
  } catch (error) {
    console.error("💥 Fatal error during seeding:", error)
    throw error
  }
}

// Function to clear all test data
export async function clearTestData() {
  console.log("🧹 Clearing test data...")

  try {
    // Delete in reverse order due to foreign key constraints
    await supabase.from("transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase.from("subscriptions").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase.from("customers").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    console.log("✅ Test data cleared successfully!")
  } catch (error) {
    console.error("❌ Error clearing test data:", error)
    throw error
  }
}
