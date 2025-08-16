"use client"

import { useState } from "react"
import { StreamPlaySubscriptionWidget } from "@/components/streamplay-subscription-widget"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Code, Play, Users, Database, CheckCircle } from "lucide-react"

export default function StreamPlayIntegrationPage() {
  const [userId, setUserId] = useState("user_123")
  const [apiKey, setApiKey] = useState("streamplay_demo_key_2024")
  const [showWidget, setShowWidget] = useState(false)

  const handleSubscriptionChange = (subscription: any) => {
    console.log("Subscription updated:", subscription)
  }

  // Simulate different users for testing
  const testUsers = [
    { id: "user_123", name: "John Doe", email: "john@streamplay.com", hasSubscription: true },
    { id: "user_456", name: "Jane Smith", email: "jane@streamplay.com", hasSubscription: true },
    { id: "user_789", name: "Mike Johnson", email: "mike@streamplay.com", hasSubscription: false },
    { id: "user_101", name: "Sarah Wilson", email: "sarah@streamplay.com", hasSubscription: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            StreamPlay Integration
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Dynamic billing integration that works for every StreamPlay user
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="secondary" className="px-3 py-1">
              <Users className="h-4 w-4 mr-1" />
              Multi-User Support
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Database className="h-4 w-4 mr-1" />
              User-Specific Data
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              Auto-Detection
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 max-w-md mx-auto">
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Live Demo
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Integration
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="demo">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>StreamPlay Widget Demo</CardTitle>
                <CardDescription>
                  Test how the billing widget works for different StreamPlay users after login
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="userId">StreamPlay User ID (from login)</Label>
                    <Input
                      id="userId"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Enter user ID from StreamPlay auth"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This would come from your StreamPlay authentication system
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter StreamPlay API key"
                    />
                  </div>
                </div>
                <Button onClick={() => setShowWidget(true)} className="w-full">
                  Load Widget for User: {userId}
                </Button>
              </CardContent>
            </Card>

            {showWidget && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center mb-4">
                  <Badge variant="outline">StreamPlay Widget for User: {userId}</Badge>
                </div>
                <StreamPlaySubscriptionWidget
                  userId={userId}
                  apiKey={apiKey}
                  userEmail={`${userId}@streamplay.com`}
                  userName={`User ${userId}`}
                  onSubscriptionChange={handleSubscriptionChange}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="integration">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. StreamPlay Authentication Integration</CardTitle>
                  <CardDescription>How to integrate with your existing StreamPlay user authentication</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
                      {`// In your StreamPlay app after user login
import { StreamPlaySubscriptionWidget } from '@/components/streamplay-subscription-widget'

function SubscriptionPage() {
  // Get user data from your StreamPlay authentication
  const { user, isAuthenticated } = useStreamPlayAuth()
  
  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  return (
    <div className="container mx-auto py-8">
      <StreamPlaySubscriptionWidget
        userId={user.id}                    // Unique user ID from StreamPlay
        userEmail={user.email}              // User email from StreamPlay
        userName={user.name}                // User name from StreamPlay
        apiKey={process.env.NEXT_PUBLIC_STREAMPLAY_API_KEY}
        onSubscriptionChange={(subscription) => {
          // Handle successful subscription
          console.log('User subscribed:', subscription)
          // Redirect to dashboard or update UI
          router.push('/dashboard')
        }}
      />
    </div>
  )
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. API Endpoints for User-Specific Data</CardTitle>
                  <CardDescription>The API automatically handles different users based on their IDs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
                      {`// API automatically handles any user ID
const getUserSubscription = async (userId) => {
  const response = await fetch(
    \`/api/integrations/streamplay?action=get_user_subscription&user_id=\${userId}\`,
    {
      headers: {
        'x-streamplay-api-key': STREAMPLAY_API_KEY
      }
    }
  )
  return response.json()
}

// Create subscription for specific user
const createSubscription = async (userId, planId, userEmail) => {
  const response = await fetch('/api/integrations/streamplay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-streamplay-api-key': STREAMPLAY_API_KEY
    },
    body: JSON.stringify({
      action: 'create_subscription',
      data: {
        user_id: userId,        // Works for any user ID
        user_email: userEmail,  // User's email
        plan_id: planId,
        payment_method: { type: 'upi', upi_id: 'user@paytm' }
      }
    })
  })
  return response.json()
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Database Schema for User Subscriptions</CardTitle>
                  <CardDescription>How to store subscriptions for different users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
                      {`-- Database table for user subscriptions
CREATE TABLE streamplay_subscriptions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,           -- StreamPlay user ID
  user_email VARCHAR(255),
  plan_id VARCHAR(100) NOT NULL,
  plan_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  renewal_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT true,
  payment_method JSON,
  
  INDEX idx_user_id (user_id),             -- Fast lookup by user
  INDEX idx_status (status),
  INDEX idx_renewal_date (renewal_date)
);

-- Each user can have their own subscription
-- user_123 -> Mega Plan ₹399
-- user_456 -> Basic Plan ₹299
-- user_789 -> No subscription (will see plan selection)`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Different StreamPlay Users</CardTitle>
                  <CardDescription>
                    See how the widget behaves for different users with different subscription states
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testUsers.map((user) => (
                      <Card key={user.id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{user.name}</h4>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400">ID: {user.id}</p>
                          </div>
                          <Badge variant={user.hasSubscription ? "default" : "secondary"}>
                            {user.hasSubscription ? "Has Subscription" : "No Subscription"}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() => {
                            setUserId(user.id)
                            setShowWidget(true)
                          }}
                        >
                          Test as {user.name}
                        </Button>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Flow Explanation</CardTitle>
                  <CardDescription>How the system works for each type of user</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge className="mt-1">1</Badge>
                      <div>
                        <h4 className="font-semibold">User Logs into StreamPlay</h4>
                        <p className="text-sm text-gray-600">
                          StreamPlay authentication provides user ID, email, and name
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="mt-1">2</Badge>
                      <div>
                        <h4 className="font-semibold">User Navigates to Subscription Page</h4>
                        <p className="text-sm text-gray-600">Widget automatically loads with their specific user ID</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="mt-1">3</Badge>
                      <div>
                        <h4 className="font-semibold">System Checks User's Subscription</h4>
                        <p className="text-sm text-gray-600">
                          API queries database for this specific user's subscription status
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="mt-1">4</Badge>
                      <div>
                        <h4 className="font-semibold">Display Appropriate UI</h4>
                        <p className="text-sm text-gray-600">
                          Shows current plan if subscribed, or plan selection if not subscribed
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Reference Images */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Design Reference - Works for Every User</CardTitle>
            <CardDescription>
              Each StreamPlay user will see this personalized interface based on their subscription status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Active Subscription View</h4>
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-13%20at%205.35.13%20PM-Fm9ypjJ69yBgHzsALwpn6Bahaupfeq.jpeg"
                  alt="StreamPlay subscription page showing Mega plan with app icons"
                  className="rounded-lg border shadow-sm w-full"
                />
                <p className="text-sm text-gray-600">Users with active subscriptions see their current plan and apps</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Plan Selection View</h4>
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-13%20at%205.35.13%20PM%20%281%29-FPzbvD8lslOTJEmb6kXhIZhhTiWL7O.jpeg"
                  alt="StreamPlay app collection with renewal reminder"
                  className="rounded-lg border shadow-sm w-full"
                />
                <p className="text-sm text-gray-600">New users or users without subscriptions see plan selection</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
