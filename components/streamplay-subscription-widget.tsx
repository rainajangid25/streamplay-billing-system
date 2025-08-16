"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Crown, Smartphone, Laptop, Tv, Check, Star, Zap } from "lucide-react"

interface StreamPlaySubscriptionWidgetProps {
  userId: string
  userEmail?: string
  userName?: string
  apiKey: string
  onSubscriptionChange?: (subscription: any) => void
}

interface SubscriptionPlan {
  id: string
  plan_id: string
  name: string
  description: string
  price_inr: number
  currency: string
  billing_cycle: string
  features: any
  app_count: number
  device_support: string[]
  is_active: boolean
}

interface UserSubscription {
  id: string
  plan: SubscriptionPlan
  status: string
  start_date: string
  end_date: string
  auto_renew: boolean
  next_billing_date: string
}

interface StreamingApp {
  id: string
  app_id: string
  name: string
  logo_url: string
  category: string
}

export function StreamPlaySubscriptionWidget({
  userId,
  userEmail,
  userName,
  apiKey,
  onSubscriptionChange,
}: StreamPlaySubscriptionWidgetProps) {
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null)
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([])
  const [streamingApps, setStreamingApps] = useState<StreamingApp[]>([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const { toast } = useToast()

  // Mock streaming apps data (matching your reference images)
  const mockStreamingApps: StreamingApp[] = [
    {
      id: "1",
      app_id: "prime_video",
      name: "Prime Video",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "2",
      app_id: "apple_tv",
      name: "Apple TV+",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "3",
      app_id: "disney_plus",
      name: "Disney+ Hotstar",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "4",
      app_id: "zee5",
      name: "ZEE5",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "5",
      app_id: "sony_liv",
      name: "SonyLIV",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "6",
      app_id: "voot",
      name: "Voot",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "7",
      app_id: "alt_balaji",
      name: "ALTBalaji",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "8",
      app_id: "mx_player",
      name: "MX Player",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "9",
      app_id: "jio_cinema",
      name: "JioCinema",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "10",
      app_id: "discovery_plus",
      name: "Discovery+",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "documentary",
    },
    {
      id: "11",
      app_id: "epic_on",
      name: "EPIC ON",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "12",
      app_id: "fancode",
      name: "FanCode",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "sports",
    },
    {
      id: "13",
      app_id: "klikk",
      name: "KLIKK",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "14",
      app_id: "chaupal",
      name: "Chaupal",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "15",
      app_id: "travelxp",
      name: "Travelxp",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "travel",
    },
    {
      id: "16",
      app_id: "docubay",
      name: "DocuBay",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "documentary",
    },
    {
      id: "17",
      app_id: "stage",
      name: "STAGE",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "18",
      app_id: "playflix",
      name: "PlayFlix",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "19",
      app_id: "sports18",
      name: "Sports18",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "sports",
    },
    {
      id: "20",
      app_id: "nammaflix",
      name: "NammaFlix",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "21",
      app_id: "vrott",
      name: "VROTT",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "22",
      app_id: "fuse",
      name: "Fuse",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "23",
      app_id: "sun_nxt",
      name: "Sun NXT",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "24",
      app_id: "eros_now",
      name: "Eros Now",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "25",
      app_id: "shemaroo",
      name: "Shemaroo",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "26",
      app_id: "lionsgateplay",
      name: "Lionsgate Play",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "27",
      app_id: "bbc_player",
      name: "BBC Player",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "28",
      app_id: "aaha",
      name: "Aaha",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "29",
      app_id: "hoichoi",
      name: "Hoichoi",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "30",
      app_id: "addatimes",
      name: "Addatimes",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "31",
      app_id: "koode",
      name: "Koode",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "32",
      app_id: "netflix",
      name: "Netflix",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
    {
      id: "33",
      app_id: "youtube_premium",
      name: "YouTube Premium",
      logo_url: "/placeholder.svg?height=60&width=60",
      category: "entertainment",
    },
  ]

  useEffect(() => {
    loadUserData()
  }, [userId])

  const loadUserData = async () => {
    try {
      setLoading(true)

      // Load user subscription and available plans
      const [subscriptionResponse, plansResponse] = await Promise.all([
        fetch(`/api/integrations/streamplay?action=get_user_subscription&user_id=${userId}`, {
          headers: { "x-streamplay-api-key": apiKey },
        }),
        fetch(`/api/integrations/streamplay?action=get_plans`, {
          headers: { "x-streamplay-api-key": apiKey },
        }),
      ])

      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json()
        setCurrentSubscription(subscriptionData.subscription)
      }

      if (plansResponse.ok) {
        const plansData = await plansResponse.json()
        setAvailablePlans(plansData.plans || [])
      }

      // Set mock streaming apps
      setStreamingApps(mockStreamingApps)
    } catch (error) {
      console.error("Error loading user data:", error)
      toast({
        title: "Error",
        description: "Failed to load subscription data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planId: string) => {
    try {
      setSubscribing(planId)

      const response = await fetch("/api/integrations/streamplay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-streamplay-api-key": apiKey,
        },
        body: JSON.stringify({
          action: "create_subscription",
          data: {
            user_id: userId,
            plan_id: planId,
            payment_method: "card",
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create subscription")
      }

      const result = await response.json()
      setCurrentSubscription(result.subscription)

      toast({
        title: "Success!",
        description: `Successfully subscribed to ${result.subscription.plan.name} plan`,
      })

      onSubscriptionChange?.(result.subscription)
    } catch (error) {
      console.error("Error creating subscription:", error)
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubscribing(null)
    }
  }

  const formatPrice = (priceInPaise: number) => {
    return `₹${(priceInPaise / 100).toFixed(0)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getAppsForPlan = (planId: string, appCount: number) => {
    return mockStreamingApps.slice(0, appCount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If user has active subscription, show current plan
  if (currentSubscription) {
    const planApps = getAppsForPlan(currentSubscription.plan.plan_id, currentSubscription.plan.app_count)

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">My Plan</h1>
          <p className="text-gray-600">Welcome back, {userName || "StreamPlay User"}!</p>
        </div>

        {/* Current Subscription Card */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <CardTitle className="text-2xl text-blue-900">{currentSubscription.plan.name}</CardTitle>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {formatPrice(currentSubscription.plan.price_inr)}/1 Month
              </Badge>
              <Badge variant="outline">Renewal on {formatDate(currentSubscription.next_billing_date)}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                {currentSubscription.plan.app_count} apps on Mobile, Laptop & TV*
              </p>

              {/* Device Support Icons */}
              <div className="flex items-center justify-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Mobile</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Laptop className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Laptop</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tv className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600">TV</span>
                </div>
              </div>

              {/* Apps Grid */}
              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 mb-6">
                {planApps.map((app) => (
                  <div key={app.id} className="flex flex-col items-center space-y-1">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                      <img
                        src={app.logo_url || "/placeholder.svg"}
                        alt={app.name}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <span className="text-xs text-gray-600 text-center leading-tight">{app.name}</span>
                  </div>
                ))}
              </div>

              {/* Auto-renewal Info */}
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-700 mb-1">
                  Your plan will auto-renew on {formatDate(currentSubscription.next_billing_date)}
                </p>
                <p className="text-xs text-gray-600">You'll get a renewal reminder closer to the renewal date</p>
                <p className="text-xs text-gray-500 mt-2">*Sun NXT is available on TV only</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Your Plan Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(currentSubscription.plan.features || {}).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm capitalize">
                    {key.replace("_", " ")}: {value === true ? "Yes" : value === false ? "No" : value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If no subscription, show plan selection
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Choose Your StreamPlay Plan</h1>
        <p className="text-xl text-gray-600">Get access to premium streaming apps with one subscription</p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {availablePlans.map((plan) => {
          const planApps = getAppsForPlan(plan.plan_id, plan.app_count)
          const isPopular = plan.plan_id === "streamplay_mega"

          return (
            <Card
              key={plan.id}
              className={`relative ${isPopular ? "border-2 border-blue-500 shadow-lg" : "border border-gray-200"}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-3 py-1">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {plan.plan_id === "streamplay_premium" && <Crown className="h-6 w-6 text-yellow-500" />}
                  {plan.plan_id === "streamplay_mega" && <Zap className="h-6 w-6 text-blue-500" />}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-blue-600">{formatPrice(plan.price_inr)}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Plan Stats */}
                <div className="text-center">
                  <p className="font-semibold text-lg">{plan.app_count} apps included</p>
                  <div className="flex items-center justify-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Smartphone className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-600">Mobile</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Laptop className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-600">Laptop</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tv className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-600">TV</span>
                    </div>
                  </div>
                </div>

                {/* Sample Apps */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Included Apps:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {planApps.slice(0, 8).map((app) => (
                      <div key={app.id} className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded border border-gray-200 bg-white flex items-center justify-center">
                          <img
                            src={app.logo_url || "/placeholder.svg"}
                            alt={app.name}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <span className="text-xs text-gray-600 mt-1 text-center leading-tight">{app.name}</span>
                      </div>
                    ))}
                  </div>
                  {plan.app_count > 8 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">+{plan.app_count - 8} more apps</p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {Object.entries(plan.features || {})
                    .slice(0, 3)
                    .map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm capitalize">
                          {key.replace("_", " ")}: {value === true ? "Yes" : value === false ? "No" : value}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Subscribe Button */}
                <Button
                  onClick={() => handleSubscribe(plan.plan_id)}
                  disabled={subscribing === plan.plan_id}
                  className={`w-full ${isPopular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                >
                  {subscribing === plan.plan_id ? "Subscribing..." : `Subscribe to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Info */}
      <div className="text-center text-sm text-gray-600 space-y-2">
        <p>All plans include HD streaming and multiple device support</p>
        <p>Cancel anytime • No hidden fees • Secure payments</p>
      </div>
    </div>
  )
}

export default StreamPlaySubscriptionWidget
