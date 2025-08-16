"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Check,
  Star,
  Shield,
  Zap,
  Globe,
  CreditCard,
  Smartphone,
  Tv,
  Users,
  PlayCircle,
  Crown,
  Sparkles,
  ArrowRight,
  Heart,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

interface Plan {
  id: string
  name: string
  price: number
  originalPrice?: number
  period: string
  description: string
  features: string[]
  popular?: boolean
  premium?: boolean
  streamingQuality: string
  devices: number
  downloads: number
  ads: boolean
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "StreamPlay Basic",
    price: 9.99,
    period: "month",
    description: "Perfect for individual viewers who want quality streaming",
    streamingQuality: "HD (1080p)",
    devices: 1,
    downloads: 5,
    ads: true,
    features: [
      "HD streaming on 1 device",
      "5 downloads per month",
      "Basic content library",
      "Email support",
      "Ad-supported viewing"
    ]
  },
  {
    id: "premium",
    name: "StreamPlay Premium",
    price: 15.99,
    originalPrice: 19.99,
    period: "month",
    description: "The most popular choice for families and serious streamers",
    streamingQuality: "Ultra HD (4K)",
    devices: 4,
    downloads: 25,
    ads: false,
    popular: true,
    features: [
      "Ultra HD 4K streaming",
      "Stream on up to 4 devices",
      "25 downloads per month",
      "Full content library",
      "No ads",
      "Priority customer support",
      "Early access to new releases"
    ]
  },
  {
    id: "pro",
    name: "StreamPlay Pro",
    price: 24.99,
    period: "month",
    description: "Ultimate experience with exclusive content and features",
    streamingQuality: "Ultra HD (4K) + HDR",
    devices: 6,
    downloads: 100,
    ads: false,
    premium: true,
    features: [
      "Ultra HD 4K + HDR streaming",
      "Stream on up to 6 devices",
      "Unlimited downloads",
      "Exclusive premium content",
      "No ads",
      "24/7 priority support",
      "Director's cuts & behind scenes",
      "Live streaming events",
      "Family parental controls"
    ]
  }
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Movie Enthusiast",
    content: "The streaming quality is absolutely incredible! 4K content looks amazing on my new TV.",
    rating: 5,
    avatar: "SJ"
  },
  {
    name: "Mike Chen",
    role: "Family of 4",
    content: "Perfect for our family. Kids love the content and we can stream on multiple devices simultaneously.",
    rating: 5,
    avatar: "MC"
  },
  {
    name: "Emily Rodriguez",
    role: "Binge Watcher",
    content: "The download feature is a game changer for my commute. Excellent content library!",
    rating: 5,
    avatar: "ER"
  }
]

export default function LandingPage() {
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<string>("premium")
  const [isAnnual, setIsAnnual] = useState(false)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSignUpDialog, setShowSignUpDialog] = useState(false)

  // Get plan from URL params (from StreamPlay redirect)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const planFromUrl = urlParams.get('plan')
    const referrer = urlParams.get('ref')
    
    if (planFromUrl && plans.find(p => p.id === planFromUrl)) {
      setSelectedPlan(planFromUrl)
    }
    
    if (referrer === 'streamplay') {
      // Show welcome message for StreamPlay users
      setTimeout(() => {
        toast({
          title: "Welcome from StreamPlay! 🎬",
          description: "Choose your perfect streaming plan below",
        })
      }, 1000)
    }
  }, [toast])

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    setShowSignUpDialog(true)
  }

  const handleStartSubscription = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email to continue",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to billing management with selected plan
      window.location.href = `/billing-management?plan=${selectedPlan}&email=${encodeURIComponent(email)}&new=true`
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getDiscountedPrice = (price: number) => {
    return isAnnual ? price * 10 : price // 2 months free with annual
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <PlayCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">StreamPlay</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                  Billing
                </Badge>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/billing-management" className="text-gray-300 hover:text-white transition-colors">
                Account
              </Link>
              <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
                Support
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Welcome to StreamPlay Premium
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Stream Without
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Limits</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience unlimited entertainment with crystal-clear 4K streaming, exclusive content, 
              and seamless viewing across all your devices. Choose your perfect plan and start streaming today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Choose Your Plan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              Watch Demo
              <PlayCircle className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-gray-400">Movies & Shows</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">2M+</div>
              <div className="text-gray-400">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">4K</div>
              <div className="text-gray-400">Ultra HD Quality</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose StreamPlay?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Industry-leading streaming technology with features designed for the ultimate viewing experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <Tv className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Ultra HD 4K Streaming</CardTitle>
                <CardDescription className="text-gray-300">
                  Crystal clear 4K resolution with HDR support for the most immersive viewing experience
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Multi-Device Support</CardTitle>
                <CardDescription className="text-gray-300">
                  Stream seamlessly across TV, laptop, tablet, and mobile with automatic sync
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription className="text-gray-300">
                  Your data is protected with end-to-end encryption and secure payment processing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription className="text-gray-300">
                  Advanced CDN technology ensures instant loading and buffer-free streaming
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Global Content</CardTitle>
                <CardDescription className="text-gray-300">
                  Exclusive content from around the world with multiple language options
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Family Friendly</CardTitle>
                <CardDescription className="text-gray-300">
                  Parental controls and kid-safe content with personalized profiles for everyone
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Perfect Plan</h2>
            <p className="text-xl text-gray-300 mb-8">
              Flexible plans designed to fit your streaming needs and budget
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white/10 rounded-lg p-1 mb-8">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !isAnnual ? 'bg-white text-gray-900' : 'text-white hover:text-gray-300'
                }`}
                onClick={() => setIsAnnual(false)}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isAnnual ? 'bg-white text-gray-900' : 'text-white hover:text-gray-300'
                }`}
                onClick={() => setIsAnnual(true)}
              >
                Annual
                <Badge className="ml-2 bg-green-600 text-white">Save 20%</Badge>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular
                    ? 'bg-gradient-to-b from-purple-900/50 to-pink-900/50 border-purple-500/50 transform scale-105'
                    : plan.premium
                    ? 'bg-gradient-to-b from-yellow-900/50 to-orange-900/50 border-yellow-500/50'
                    : 'bg-white/5 border-white/10'
                } text-white transition-all duration-300 hover:scale-105`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                {plan.premium && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-300 mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold">
                        ${getDiscountedPrice(plan.price).toFixed(2)}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          ${plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="text-gray-400">
                      per {isAnnual ? 'month (billed annually)' : 'month'}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-black/20 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Quality</div>
                      <div className="font-semibold">{plan.streamingQuality}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Devices</div>
                      <div className="font-semibold">{plan.devices}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Downloads</div>
                      <div className="font-semibold">
                        {plan.downloads === 100 ? 'Unlimited' : plan.downloads}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Ads</div>
                      <div className="font-semibold">{plan.ads ? 'Yes' : 'No'}</div>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-3 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : plan.premium
                        ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
                        : 'bg-white/10 hover:bg-white/20 border-white/20'
                    } text-white`}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-300">
              Join millions of satisfied streamers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/5 border-white/10 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Streaming?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join over 2 million users and experience entertainment like never before
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Your Journey
            <Heart className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <PlayCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">StreamPlay</span>
              </div>
              <p className="text-gray-400">
                Premium streaming experience with unlimited entertainment
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Content</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-white/10" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 StreamPlay. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sign Up Dialog */}
      <Dialog open={showSignUpDialog} onOpenChange={setShowSignUpDialog}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Complete Your Subscription
            </DialogTitle>
            <DialogDescription className="text-center text-gray-300">
              Enter your email to continue with {plans.find(p => p.id === selectedPlan)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {selectedPlan && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">
                    {plans.find(p => p.id === selectedPlan)?.name}
                  </span>
                  <span className="text-2xl font-bold">
                    ${plans.find(p => p.id === selectedPlan)?.price}/month
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {plans.find(p => p.id === selectedPlan)?.description}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Button
              onClick={handleStartSubscription}
              disabled={isLoading || !email}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
            >
              {isLoading ? "Processing..." : "Continue to Payment"}
              <CreditCard className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              You can cancel anytime.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

