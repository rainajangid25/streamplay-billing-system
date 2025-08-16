"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Play, Users, TrendingUp, DollarSign, Activity, CheckCircle, XCircle, Clock } from "lucide-react"

interface StreamPlayUser {
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

interface StreamPlayPlan {
  id: string
  name: string
  price: number
  currency: string
  billing_cycle: "monthly" | "yearly"
  features: string[]
  max_streams: number
  video_quality: string
}

interface Analytics {
  total_subscribers: number
  active_subscribers: number
  trial_users: number
  cancelled_users: number
  monthly_revenue: number
  churn_rate: number
  popular_plans: { plan: string; count: number }[]
}

export default function StreamPlayDemoPage() {
  const [users, setUsers] = useState<StreamPlayUser[]>([])
  const [plans, setPlans] = useState<StreamPlayPlan[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Load users
      const usersResponse = await fetch("/api/integrations/streamplay?action=users")
      const usersData = await usersResponse.json()
      setUsers(usersData.users || [])

      // Load plans
      const plansResponse = await fetch("/api/integrations/streamplay?action=plans")
      const plansData = await plansResponse.json()
      setPlans(plansData || [])

      // Load analytics
      const analyticsResponse = await fetch("/api/integrations/streamplay?action=analytics")
      const analyticsData = await analyticsResponse.json()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error("Error loading data:", error)
      setMessage({ type: "error", text: "Failed to load StreamPlay data" })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSubscription = async () => {
    if (!selectedUser || !selectedPlan) {
      setMessage({ type: "error", text: "Please select both a user and a plan" })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/integrations/streamplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_subscription",
          userId: selectedUser,
          planId: selectedPlan,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: "success", text: "Subscription created successfully!" })
        await loadInitialData() // Refresh data
      } else {
        setMessage({ type: "error", text: result.error || "Failed to create subscription" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error creating subscription" })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async (userId: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/integrations/streamplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel_subscription",
          userId: userId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: "success", text: "Subscription cancelled successfully!" })
        await loadInitialData() // Refresh data
      } else {
        setMessage({ type: "error", text: result.error || "Failed to cancel subscription" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error cancelling subscription" })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "trial":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "trial":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Play className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">StreamPlay Integration Demo</h1>
          <p className="text-gray-600">Interactive demonstration of StreamPlay billing system integration</p>
        </div>
      </div>

      {message && (
        <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.total_subscribers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{analytics.active_subscribers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics.monthly_revenue}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.churn_rate}%</div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Popular Plans</CardTitle>
              <CardDescription>Most subscribed plans by user count</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.popular_plans.map((plan, index) => (
                <div key={plan.plan} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="font-medium capitalize">{plan.plan}</span>
                  </div>
                  <span className="text-sm text-gray-600">{plan.count} subscribers</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>StreamPlay Users</CardTitle>
              <CardDescription>Current users in the StreamPlay system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{user.name}</h3>
                        {getStatusIcon(user.subscription_status)}
                        <Badge className={getStatusColor(user.subscription_status)}>{user.subscription_status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Plan: {user.subscription_plan}</span>
                        <span>Watch Time: {Math.floor(user.total_watch_time / 60)}h</span>
                        <span>Genres: {user.favorite_genres.join(", ")}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {user.subscription_status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelSubscription(user.id)}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card key={plan.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    <Badge variant="secondary">{plan.video_quality}</Badge>
                  </div>
                  <CardDescription>
                    <span className="text-2xl font-bold">${plan.price}</span>
                    <span className="text-sm">/{plan.billing_cycle}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <strong>Max Streams:</strong> {plan.max_streams}
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Features:</p>
                      <ul className="text-xs space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Subscription</CardTitle>
              <CardDescription>Test the subscription creation process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select User</label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Select Plan</label>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - ${plan.price}/{plan.billing_cycle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleCreateSubscription}
                disabled={loading || !selectedUser || !selectedPlan}
                className="w-full"
              >
                {loading ? "Creating..." : "Create Subscription"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
              <CardDescription>Current integration configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mock Mode</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Status</span>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Webhook Endpoint</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">/api/webhooks/streamplay</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
