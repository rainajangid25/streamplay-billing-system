import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const aiData = {
      insights: {
        predictiveAccuracy: 94.7,
        automatedDecisions: 15420,
        churnPrevention: 234000,
        revenueOptimization: 18.3,
        fraudDetection: 99.2,
        customerSegments: 8,
        mlModelsActive: 12,
        dataPointsProcessed: 2847392,
      },
      models: [
        {
          name: "Churn Prediction",
          accuracy: 94.7,
          status: "Active",
          lastTrained: "2024-01-10",
          predictions: 1247,
        },
        {
          name: "Revenue Forecasting",
          accuracy: 91.2,
          status: "Active",
          lastTrained: "2024-01-08",
          predictions: 892,
        },
        {
          name: "Fraud Detection",
          accuracy: 99.2,
          status: "Active",
          lastTrained: "2024-01-12",
          predictions: 3456,
        },
        {
          name: "Price Optimization",
          accuracy: 87.8,
          status: "Active",
          lastTrained: "2024-01-09",
          predictions: 567,
        },
      ],
      recommendations: [
        {
          type: "revenue",
          title: "Dynamic Pricing Opportunity",
          description: "AI predicts 18% revenue increase with dynamic pricing for premium customers",
          impact: "High",
          confidence: 94.2,
        },
        {
          type: "churn",
          title: "At-Risk Customer Alert",
          description: "23 customers showing high churn probability this week",
          impact: "Medium",
          confidence: 87.5,
        },
        {
          type: "fraud",
          title: "Fraud Pattern Detected",
          description: "New fraud pattern identified in crypto payments",
          impact: "High",
          confidence: 99.1,
        },
      ],
    }

    return NextResponse.json(aiData)
  } catch (error) {
    console.error("AI API error:", error)
    return NextResponse.json({ error: "Failed to fetch AI data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case "predict_churn":
        const churnResult = {
          customerId: data.customerId,
          churnProbability: Math.random() * 100,
          riskLevel: Math.random() > 0.7 ? "High" : Math.random() > 0.4 ? "Medium" : "Low",
          factors: ["Payment history", "Usage patterns", "Support interactions"],
          confidence: 85 + Math.random() * 15,
        }
        return NextResponse.json(churnResult)

      case "optimize_pricing":
        const pricingResult = {
          customerId: data.customerId,
          currentPrice: data.currentPrice,
          optimizedPrice: data.currentPrice * (0.9 + Math.random() * 0.3),
          expectedIncrease: 5 + Math.random() * 25,
          confidence: 80 + Math.random() * 20,
        }
        return NextResponse.json(pricingResult)

      case "detect_fraud":
        const fraudResult = {
          transactionId: data.transactionId,
          fraudProbability: Math.random() * 100,
          riskScore: Math.random() * 10,
          factors: ["Transaction amount", "Location", "Time pattern"],
          recommendation: Math.random() > 0.8 ? "Block" : Math.random() > 0.5 ? "Review" : "Allow",
        }
        return NextResponse.json(fraudResult)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("AI POST error:", error)
    return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 })
  }
}
