import { type NextRequest, NextResponse } from "next/server"

// Mock data for when database is not set up
const mockCustomers = [
  {
    id: "cust_001",
    name: "Alice Johnson",
    email: "alice@example.com",
    plan: "Premium",
    status: "Active",
    totalRevenue: 2450.0,
    subscriptions: [
      {
        id: "sub_001",
        plan: "Premium",
        status: "Active",
        nextBilling: "2024-02-15",
        amount: 99.99,
      },
    ],
    paymentMethods: ["Credit Card", "USDC"],
    churnRisk: "Low",
    lifetimeValue: 5200.0,
    joinDate: "2023-06-15",
    lastActivity: "2024-01-14",
  },
  {
    id: "cust_002",
    name: "Bob Smith",
    email: "bob@example.com",
    plan: "Enterprise",
    status: "Active",
    totalRevenue: 8900.0,
    subscriptions: [
      {
        id: "sub_002",
        plan: "Enterprise",
        status: "Active",
        nextBilling: "2024-02-20",
        amount: 299.99,
      },
    ],
    paymentMethods: ["Ethereum", "Credit Card"],
    churnRisk: "Low",
    lifetimeValue: 15600.0,
    joinDate: "2023-03-10",
    lastActivity: "2024-01-14",
  },
  {
    id: "cust_003",
    name: "Carol Davis",
    email: "carol@example.com",
    plan: "Basic",
    status: "At Risk",
    totalRevenue: 299.0,
    subscriptions: [
      {
        id: "sub_003",
        plan: "Basic",
        status: "Past Due",
        nextBilling: "2024-01-10",
        amount: 29.99,
      },
    ],
    paymentMethods: ["Credit Card"],
    churnRisk: "High",
    lifetimeValue: 450.0,
    joinDate: "2023-11-20",
    lastActivity: "2024-01-05",
  },
]

// In-memory storage for demo (in production, this would be in a database)
const customers = [...mockCustomers]

export async function GET(request: NextRequest) {
  try {
    const customersData = {
      customers: customers,
      analytics: {
        totalCustomers: customers.length + 25417, // Add base number for demo
        activeSubscriptions: customers.filter((c) => c.status === "Active").length + 23888,
        churnRate: 3.2,
        averageLifetimeValue: 3450.0,
        monthlyRecurringRevenue: customers.reduce((sum, c) => sum + c.totalRevenue, 0) + 2844942,
      },
    }

    return NextResponse.json(customersData)
  } catch (error) {
    console.error("Customers API error:", error)
    return NextResponse.json({ error: "Failed to fetch customer data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case "create_customer":
        try {
          // Plan pricing
          const planPrices = {
            Basic: 199,
            Premium: 899,
            Enterprise: 2499,
            Custom: 0,
          }

          // Create new customer
          const newCustomer = {
            id: `cust_${Date.now()}`,
            name: data.name,
            email: data.email,
            plan: data.plan || "Basic",
            status: "Active",
            totalRevenue: 0,
            subscriptions:
              data.plan && data.plan !== "Custom"
                ? [
                    {
                      id: `sub_${Date.now()}`,
                      plan: data.plan,
                      status: "Active",
                      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                      amount: planPrices[data.plan as keyof typeof planPrices] || 0,
                    },
                  ]
                : [],
            paymentMethods: data.paymentMethods || [],
            churnRisk: "Low",
            lifetimeValue: 0,
            joinDate: new Date().toISOString().split("T")[0],
            lastActivity: new Date().toISOString().split("T")[0],
            country: data.country,
            phone: data.phone || "",
          }

          // Add to in-memory storage
          customers.push(newCustomer)

          console.log("Created new customer:", newCustomer)

          return NextResponse.json({
            success: true,
            customer: newCustomer,
            message: "Customer created successfully",
          })
        } catch (error) {
          console.error("Error creating customer:", error)
          return NextResponse.json(
            {
              success: false,
              error: "Failed to create customer",
            },
            { status: 500 },
          )
        }

      case "update_customer":
        try {
          const customerIndex = customers.findIndex((c) => c.id === data.customerId)
          if (customerIndex !== -1) {
            customers[customerIndex] = { ...customers[customerIndex], ...data.updates }
            return NextResponse.json({
              success: true,
              message: "Customer updated successfully",
              customer: customers[customerIndex],
            })
          } else {
            return NextResponse.json(
              {
                success: false,
                error: "Customer not found",
              },
              { status: 404 },
            )
          }
        } catch (error) {
          console.error("Error updating customer:", error)
          return NextResponse.json(
            {
              success: false,
              error: "Failed to update customer",
            },
            { status: 500 },
          )
        }

      case "predict_churn":
        const churnPrediction = {
          customerId: data.customerId,
          churnProbability: Math.random() * 0.3, // 0-30% for demo
          riskLevel: Math.random() > 0.8 ? "High" : Math.random() > 0.5 ? "Medium" : "Low",
          factors: ["Payment delays", "Reduced usage", "Support tickets"],
          recommendations: ["Offer discount", "Personal outreach", "Feature training"],
        }
        return NextResponse.json(churnPrediction)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Customers POST error:", error)
    return NextResponse.json({ error: "Failed to process customer request" }, { status: 500 })
  }
}
