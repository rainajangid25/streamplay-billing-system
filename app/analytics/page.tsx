"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart as LineChartIcon, BarChart as BarChartIcon, PieChart as PieChartIcon } from "recharts"
import { Button } from "@/components/ui/button" // Placeholder icons

export default function AnalyticsPage() {
  const [revenueData] = useState([
    { name: "Jan", total: 4000, subscription: 2400, onetime: 1600 },
    { name: "Feb", total: 3000, subscription: 1398, onetime: 1602 },
    { name: "Mar", total: 2000, subscription: 980, onetime: 1020 },
    { name: "Apr", total: 2780, subscription: 3908, onetime: -1128 }, // Example of negative one-time (refunds)
    { name: "May", total: 1890, subscription: 4800, onetime: -2910 },
    { name: "Jun", total: 2390, subscription: 3800, onetime: -1410 },
    { name: "Jul", total: 3490, subscription: 4300, onetime: -810 },
  ])

  const [customerChurnData] = useState([
    { name: "Jan", active: 400, churned: 20 },
    { name: "Feb", active: 380, churned: 25 },
    { name: "Mar", active: 355, churned: 30 },
    { name: "Apr", active: 325, churned: 15 },
    { name: "May", active: 310, churned: 10 },
    { name: "Jun", active: 300, churned: 5 },
    { name: "Jul", active: 295, churned: 8 },
  ])

  const [paymentMethodData] = useState([
    { name: "Credit Card", value: 600000 },
    { name: "Bitcoin", value: 150000 },
    { name: "Ethereum", value: 100000 },
    { name: "USDC", value: 50000 },
    { name: "Other", value: 20000 },
  ])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header removed, now handled by app/layout.tsx and components/app-sidebar.tsx */}
      {/* <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">BillChain AI</span>
          </Link>
          <nav className="flex space-x-4">
            <Link href="/">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/customers">
              <Button variant="ghost">Customers</Button>
            </Link>
            <Link href="/billing">
              <Button variant="ghost">Billing</Button>
            </Link>
            <Link href="/blockchain">
              <Button variant="ghost">Blockchain</Button>
            </Link>
            <Button variant="ghost" className="bg-blue-50 text-blue-700">
              Analytics
            </Button>
          </nav>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Comprehensive data insights and reporting</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChartIcon className="h-5 w-5" />
                <span>Revenue Trends</span>
              </CardTitle>
              <CardDescription>Monthly recurring revenue over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                Chart Placeholder
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChartIcon className="h-5 w-5" />
                <span>Subscription Growth</span>
              </CardTitle>
              <CardDescription>New subscriptions vs. churn rate.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                Chart Placeholder
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="h-5 w-5" />
                <span>Payment Method Distribution</span>
              </CardTitle>
              <CardDescription>Breakdown of payments by method (fiat vs. crypto).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                Chart Placeholder
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>Generate and download custom analytical reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Generate Report</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
