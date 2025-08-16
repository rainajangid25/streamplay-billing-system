"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Play, Webhook, Key, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("auth")
  const [apiKey, setApiKey] = useState("your_api_key_here")
  const [testResponse, setTestResponse] = useState("")
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    })
  }

  const testEndpoint = async (endpoint: string, method: string, body?: any) => {
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      const result = await response.json()
      setTestResponse(JSON.stringify(result, null, 2))
    } catch (error) {
      setTestResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            GoBill AI API Documentation
          </h1>
          <p className="text-xl text-muted-foreground mb-6">Complete API reference for OTT platform integrations</p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="secondary" className="px-3 py-1">
              <Globe className="h-4 w-4 mr-1" />
              REST API
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Key className="h-4 w-4 mr-1" />
              OAuth 2.0
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Webhook className="h-4 w-4 mr-1" />
              Webhooks
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="streamplay">StreamPlay</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>Quick start guide for integrating with GoBill AI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold">Get API Credentials</h4>
                        <p className="text-sm text-gray-600">Register your application and get your API key</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold">Authenticate</h4>
                        <p className="text-sm text-gray-600">Use OAuth 2.0 to get access tokens</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold">Make API Calls</h4>
                        <p className="text-sm text-gray-600">Start managing subscriptions and billing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold">Set up Webhooks</h4>
                        <p className="text-sm text-gray-600">Receive real-time event notifications</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Base URL</CardTitle>
                  <CardDescription>All API requests should be made to this base URL</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                    <code>https://api.gobill.ai</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 text-gray-300 hover:text-white"
                      onClick={() => copyToClipboard("https://api.gobill.ai")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Rate Limits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 1000 requests per hour for authenticated requests</li>
                      <li>• 100 requests per hour for unauthenticated requests</li>
                      <li>• Webhook endpoints: 10,000 requests per hour</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Supported Platforms</CardTitle>
                  <CardDescription>OTT platforms that can integrate with GoBill AI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-red-600 font-bold">N</span>
                      </div>
                      <h4 className="font-semibold">Netflix</h4>
                      <p className="text-xs text-gray-500">Full Integration</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">D+</span>
                      </div>
                      <h4 className="font-semibold">Disney+</h4>
                      <p className="text-xs text-gray-500">Full Integration</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-purple-600 font-bold">SP</span>
                      </div>
                      <h4 className="font-semibold">StreamPlay</h4>
                      <p className="text-xs text-gray-500">Native Integration</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-green-600 font-bold">+</span>
                      </div>
                      <h4 className="font-semibold">Custom</h4>
                      <p className="text-xs text-gray-500">API Integration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="authentication">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>OAuth 2.0 Authentication</CardTitle>
                  <CardDescription>Get access tokens using client credentials flow</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Endpoint</Label>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm">POST /api/auth</div>
                    </div>

                    <div>
                      <Label>Request Body</Label>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <pre>{`{
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "grant_type": "client_credentials",
  "scope": "billing:read billing:write subscriptions:manage"
}`}</pre>
                      </div>
                    </div>

                    <div>
                      <Label>Response</Label>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <pre>{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "scope": "billing:read billing:write subscriptions:manage"
}`}</pre>
                      </div>
                    </div>

                    <Button
                      onClick={() =>
                        testEndpoint("auth", "POST", {
                          client_id: "streamplay_integration",
                          client_secret: "demo_secret",
                          grant_type: "client_credentials",
                        })
                      }
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Test Authentication
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Using Access Tokens</CardTitle>
                  <CardDescription>Include the access token in your API requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Authorization Header</Label>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm">
                        Authorization: Bearer {`{access_token}`}
                      </div>
                    </div>

                    <div>
                      <Label>Example Request</Label>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <pre>{`curl -X GET "https://api.gobill.ai/api/v1/subscriptions" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "Content-Type: application/json"`}</pre>
                      </div>
                    </div>

                    <div>
                      <Label>Available Scopes</Label>
                      <div className="space-y-2">
                        <Badge variant="outline">billing:read</Badge>
                        <Badge variant="outline">billing:write</Badge>
                        <Badge variant="outline">subscriptions:manage</Badge>
                        <Badge variant="outline">analytics:read</Badge>
                        <Badge variant="outline">webhooks:receive</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subscriptions">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Management API</CardTitle>
                  <CardDescription>Create, read, update, and manage subscriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Get Subscriptions */}
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">GET</Badge>
                        <code className="text-sm">/api/v1/subscriptions</code>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Retrieve a list of subscriptions with filtering and pagination
                      </p>

                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto mb-3">
                        <pre>{`// Query Parameters
?customer_id=cust_123&status=active&limit=50&offset=0

// Response
{
  "data": [
    {
      "id": "sub_001",
      "customer_id": "cust_001",
      "plan": "premium",
      "status": "active",
      "amount": 19.99,
      "currency": "USD",
      "billing_cycle": "monthly",
      "created_at": "2024-01-01T00:00:00Z",
      "next_billing_date": "2024-02-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}`}</pre>
                      </div>

                      <Button size="sm" onClick={() => testEndpoint("v1/subscriptions", "GET")}>
                        <Play className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                    </div>

                    {/* Create Subscription */}
                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          POST
                        </Badge>
                        <code className="text-sm">/api/v1/subscriptions</code>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Create a new subscription for a customer</p>

                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto mb-3">
                        <pre>{`// Request Body
{
  "customer_id": "cust_123",
  "customer_email": "user@example.com",
  "plan": "premium",
  "payment_method": {
    "type": "credit_card",
    "last4": "4242"
  },
  "billing_cycle": "monthly",
  "trial_days": 7
}

// Response
{
  "data": {
    "id": "sub_new_123",
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Subscription created successfully"
}`}</pre>
                      </div>

                      <Button
                        size="sm"
                        onClick={() =>
                          testEndpoint("v1/subscriptions", "POST", {
                            customer_id: "test_customer",
                            customer_email: "test@example.com",
                            plan: "premium",
                            payment_method: { type: "credit_card", last4: "4242" },
                          })
                        }
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                    </div>

                    {/* Update Subscription */}
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          PATCH
                        </Badge>
                        <code className="text-sm">/api/v1/subscriptions?id=sub_123</code>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Update an existing subscription</p>

                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto mb-3">
                        <pre>{`// Request Body
{
  "plan": "enterprise",
  "status": "active",
  "metadata": {
    "updated_reason": "plan_upgrade"
  }
}

// Response
{
  "data": {
    "id": "sub_123",
    "plan": "enterprise",
    "amount": 49.99,
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "message": "Subscription updated successfully"
}`}</pre>
                      </div>

                      <Button
                        size="sm"
                        onClick={() =>
                          testEndpoint("v1/subscriptions?id=sub_001", "PATCH", {
                            plan: "enterprise",
                            status: "active",
                          })
                        }
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="streamplay">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>StreamPlay Integration API</CardTitle>
                  <CardDescription>Native integration endpoints for StreamPlay OTT platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Get Plans */}
                    <div className="border-l-4 border-purple-500 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">GET</Badge>
                        <code className="text-sm">/api/integrations/streamplay?action=get_plans</code>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Get available subscription plans for StreamPlay</p>

                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto mb-3">
                        <pre>{`// Headers
x-streamplay-api-key: your_streamplay_api_key

// Response
{
  "plans": [
    {
      "id": "streamplay_mega",
      "name": "Mega",
      "price": 399,
      "currency": "INR",
      "billing_cycle": "monthly",
      "features": [
        "4K Streaming",
        "4 Devices",
        "Mobile, Laptop & TV",
        "33+ Apps"
      ],
      "apps": [
        {
          "name": "Prime Video",
          "logo": "/apps/prime-video.png",
          "category": "entertainment"
        }
      ]
    }
  ]
}`}</pre>
                      </div>

                      <Button size="sm" onClick={() => testEndpoint("integrations/streamplay?action=get_plans", "GET")}>
                        <Play className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                    </div>

                    {/* Create StreamPlay Subscription */}
                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          POST
                        </Badge>
                        <code className="text-sm">/api/integrations/streamplay</code>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Create a StreamPlay subscription</p>

                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto mb-3">
                        <pre>{`// Headers
x-streamplay-api-key: your_streamplay_api_key
Content-Type: application/json

// Request Body
{
  "action": "create_subscription",
  "data": {
    "plan_id": "streamplay_mega",
    "user_id": "user_123",
    "user_email": "user@streamplay.com",
    "payment_method": {
      "type": "upi",
      "upi_id": "user@paytm"
    }
  }
}

// Response
{
  "subscription": {
    "id": "sub_streamplay_123",
    "plan_name": "Mega",
    "price": 399,
    "currency": "INR",
    "status": "active",
    "renewal_date": "2025-02-13T00:00:00Z"
  },
  "message": "Subscription created successfully",
  "redirect_url": "https://streamplay.com/dashboard?subscription=sub_streamplay_123"
}`}</pre>
                      </div>

                      <Button
                        size="sm"
                        onClick={() =>
                          testEndpoint("integrations/streamplay", "POST", {
                            action: "create_subscription",
                            data: {
                              plan_id: "streamplay_mega",
                              user_id: "demo_user",
                              user_email: "demo@streamplay.com",
                              payment_method: { type: "upi", upi_id: "demo@paytm" },
                            },
                          })
                        }
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                    </div>

                    {/* Widget Integration */}
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold mb-2">React Widget Integration</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Add the StreamPlay subscription widget to your React app
                      </p>

                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <pre>{`import { StreamPlaySubscriptionWidget } from '@/components/streamplay-subscription-widget'

function SubscriptionPage() {
  return (
    <StreamPlaySubscriptionWidget
      userId="user_123"
      apiKey={process.env.NEXT_PUBLIC_STREAMPLAY_API_KEY}
      onSubscriptionChange={(subscription) => {
        console.log('Subscription updated:', subscription)
        // Handle subscription change
      }}
    />
  )
}`}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="webhooks">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Webhook Events</CardTitle>
                  <CardDescription>Real-time notifications for subscription and billing events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Webhook Endpoint</h4>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm">
                        POST https://your-app.com/webhooks/gobill
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Supported Events</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Badge variant="outline">subscription.created</Badge>
                          <Badge variant="outline">subscription.updated</Badge>
                          <Badge variant="outline">subscription.cancelled</Badge>
                          <Badge variant="outline">payment.succeeded</Badge>
                        </div>
                        <div className="space-y-2">
                          <Badge variant="outline">payment.failed</Badge>
                          <Badge variant="outline">user.created</Badge>
                          <Badge variant="outline">content.viewed</Badge>
                          <Badge variant="outline">fraud.detected</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Webhook Payload Example</h4>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <pre>{`{
  "type": "subscription.created",
  "data": {
    "subscription": {
      "id": "sub_streamplay_123",
      "user_id": "user_456",
      "plan_id": "streamplay_mega",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "platform": "streamplay"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "event_id": "evt_789"
}`}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Webhook Verification</h4>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <pre>{`// Node.js example
const crypto = require('crypto')

function verifyWebhook(payload, signature, timestamp, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(timestamp + payload)
    .digest('hex')
    
  return signature === \`sha256=\${expectedSignature}\`
}

// Usage
const isValid = verifyWebhook(
  req.body,
  req.headers['x-webhook-signature'],
  req.headers['x-webhook-timestamp'],
  process.env.WEBHOOK_SECRET
)`}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Test API Response</CardTitle>
                  <CardDescription>View the response from your API tests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="testApiKey">API Key for Testing</Label>
                      <Input
                        id="testApiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                      />
                    </div>

                    <div>
                      <Label htmlFor="testResponse">Response</Label>
                      <Textarea
                        id="testResponse"
                        value={testResponse}
                        readOnly
                        placeholder="API response will appear here..."
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
