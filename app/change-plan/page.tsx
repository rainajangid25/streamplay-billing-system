'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Check, Star, Smartphone, Tv, Laptop, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ChangePlanPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('mega')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 199,
      annualPrice: 1990,
      appsCount: 15,
      features: [
        'Mobile & Laptop',
        'HD Quality',
        '2 Devices',
        'Basic Content Library'
      ],
      popularApps: ['Prime Video', 'JioCinema', 'Zee5', 'Fancode', 'Discovery+'],
      color: 'from-blue-500 to-cyan-500',
      badge: null
    },
    {
      id: 'mega',
      name: 'Mega',
      monthlyPrice: 399,
      annualPrice: 3990,
      appsCount: 33,
      features: [
        'Mobile, Laptop & TV',
        'HD Quality',
        'Multiple Devices',
        'Premium Content',
        'Live Sports',
        'Original Series'
      ],
      popularApps: ['Prime Video', 'Apple TV+', 'JioCinema', 'Zee5', 'LionsgatePlay', 'BBC Player'],
      color: 'from-purple-500 to-pink-500',
      badge: 'Most Popular'
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 599,
      annualPrice: 5990,
      appsCount: 50,
      features: [
        'All Devices',
        '4K Quality',
        'Unlimited Devices',
        'Premium + Exclusive Content',
        'Live Sports & News',
        'Original Series',
        'Early Access',
        'Download Offline'
      ],
      popularApps: ['All Apps', 'Exclusive Content', '4K Streaming', 'Premium Sports'],
      color: 'from-yellow-500 to-orange-500',
      badge: 'Best Value'
    }
  ]

  const allStreamingApps = [
    { name: "Prime Video", icon: "🎬", category: "movies" },
    { name: "Apple TV+", icon: "🍎", category: "premium" },
    { name: "JioCinema", icon: "🎭", category: "indian" },
    { name: "Zee5", icon: "Z5", category: "indian" },
    { name: "LionsgatePlay", icon: "🦁", category: "hollywood" },
    { name: "BBC Player", icon: "📺", category: "news" },
    { name: "SunNXT", icon: "☀️", category: "regional" },
    { name: "Aha", icon: "🎪", category: "regional" },
    { name: "Fancode", icon: "⚽", category: "sports" },
    { name: "Discovery+", icon: "🔍", category: "documentary" },
    { name: "Watcho", icon: "👁️", category: "indian" },
    { name: "Epic On", icon: "⚡", category: "indian" },
    { name: "Klikk", icon: "📱", category: "regional" },
    { name: "Chaupal", icon: "🏛️", category: "regional" },
    { name: "Travelxp", icon: "✈️", category: "lifestyle" },
    { name: "DocuBay", icon: "📖", category: "documentary" },
    { name: "Stage", icon: "🎭", category: "theatre" },
    { name: "PlayFlix", icon: "▶️", category: "movies" },
    { name: "VR", icon: "🥽", category: "tech" },
    { name: "Fuse+", icon: "🔥", category: "music" },
    { name: "Champions TV", icon: "🏆", category: "sports" },
    { name: "Nammaflix", icon: "🎪", category: "regional" },
    { name: "DishaTV", icon: "📡", category: "regional" },
    { name: "Netflix", icon: "🎬", category: "premium" },
    { name: "Disney+ Hotstar", icon: "🏰", category: "premium" },
    { name: "Sony LIV", icon: "📺", category: "sports" },
    { name: "Voot", icon: "📱", category: "indian" },
    { name: "MX Player", icon: "🎮", category: "free" },
    { name: "YouTube Premium", icon: "▶️", category: "video" },
    { name: "Spotify", icon: "🎵", category: "music" }
  ]

  const getPrice = (plan: any) => {
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice
    const period = billingCycle === 'monthly' ? '/month' : '/year'
    const savings = billingCycle === 'annual' ? Math.round(((plan.monthlyPrice * 12) - plan.annualPrice) / (plan.monthlyPrice * 12) * 100) : 0
    
    return { price, period, savings }
  }

  const handleProceed = () => {
    const plan = plans.find(p => p.id === selectedPlan)
    const { price } = getPrice(plan!)
    
    // Navigate to billing management page with plan details
    router.push(`/billing-management?plan=${selectedPlan}&price=${price}&billing=${billingCycle}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/my-plan">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Plan
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">StreamPlay - Choose Your Plan</h1>
              <p className="text-gray-300">Select the perfect StreamPlay plan for your streaming needs</p>
            </div>
          </div>
          
          {/* Billing Cycle Toggle */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-1 border border-white/20">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('monthly')}
              className={billingCycle === 'monthly' ? 'bg-purple-600 text-white' : 'text-white hover:bg-white/10'}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === 'annual' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('annual')}
              className={billingCycle === 'annual' ? 'bg-purple-600 text-white' : 'text-white hover:bg-white/10'}
            >
              Annual
              {billingCycle === 'annual' && (
                <Badge className="ml-2 bg-green-600 text-white">Save 20%</Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const { price, period, savings } = getPrice(plan)
            const isSelected = selectedPlan === plan.id
            
            return (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-purple-400 bg-white/20 backdrop-blur-lg border-purple-400/50 scale-105'
                    : 'bg-white/10 backdrop-blur-lg border-white/20 hover:border-purple-400/30 hover:bg-white/15'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {plan.appsCount} streaming apps
                      </CardDescription>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-r ${plan.color}`}>
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="text-center py-4">
                    <div className="text-4xl font-bold text-white">
                      ₹{price}
                      <span className="text-lg text-gray-300">{period}</span>
                    </div>
                    {savings > 0 && (
                      <Badge className="bg-green-600 text-white mt-2">
                        Save {savings}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Popular Apps */}
                  <div>
                    <p className="text-white font-semibold mb-2">Popular Apps:</p>
                    <div className="flex flex-wrap gap-1">
                      {plan.popularApps.map((app, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-600/20 text-purple-200 text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Device Support */}
                  <div className="flex items-center justify-center space-x-4 pt-4">
                    <div className="flex items-center space-x-1 text-gray-300">
                      <Smartphone className="h-4 w-4" />
                      <span className="text-xs">Mobile</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-300">
                      <Laptop className="h-4 w-4" />
                      <span className="text-xs">Laptop</span>
                    </div>
                    {(plan.id === 'mega' || plan.id === 'premium') && (
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Tv className="h-4 w-4" />
                        <span className="text-xs">TV</span>
                      </div>
                    )}
                  </div>
                  
                  {isSelected && (
                    <div className="pt-4">
                      <Badge className="w-full justify-center bg-purple-600 text-white py-2">
                        <Check className="h-4 w-4 mr-2" />
                        Selected
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* All Available Apps */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white">All Available Streaming Apps</CardTitle>
            <CardDescription className="text-gray-300">
              Access to premium content across all major platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-15 gap-3">
              {allStreamingApps.map((app, index) => (
                <div
                  key={index}
                  className="group relative aspect-square bg-white/10 rounded-lg border border-white/20 hover:border-purple-400/50 hover:bg-white/20 transition-all duration-300 cursor-pointer p-2"
                  title={app.name}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl mb-1">{app.icon}</div>
                    <p className="text-white text-xs text-center leading-tight truncate w-full px-1">
                      {app.name}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleProceed}
            className="px-8 py-3 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-lg"
          >
            Proceed to Billing
          </Button>
        </div>
      </div>
    </div>
  )
}

