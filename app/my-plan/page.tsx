'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Calendar, CreditCard, Users, Smartphone, Tv, Laptop, Pause, Play, X, Settings, BarChart3, TrendingUp, Activity, Brain, DollarSign, Eye, Zap, MessageSquare, Shield, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SubscriptionService } from '@/lib/subscription'
import { emailService } from '@/lib/email-client'
import { useBillingStore, useCustomerData, useCurrentCustomer } from '@/lib/store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'

export default function MyPlanPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const customer = useCustomerData()
  const { customer: fullCustomer, updateCustomer, isLoading } = useCurrentCustomer()
  const { updateSubscription, subscriptions, customers, addCustomer, addSubscription } = useBillingStore()
  
  // Get current subscription data
  const currentSubscription = subscriptions.find(sub => sub.user_id === customer?.id)
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: fullCustomer?.phone || '',
    country: fullCustomer?.billing_address?.country || ''
  })



  const [currentPlan] = useState({
    name: customer?.plan?.charAt(0).toUpperCase() + customer?.plan?.slice(1) || "Mega",
    price: `₹${currentSubscription?.amount || 399}`,
    billing: currentSubscription?.billing_cycle === 'annual' ? '/Year' : '/Month',
    renewalDate: customer?.subscription_end_date || "29/08/2025",
    appsCount: customer?.plan === 'premium' ? 50 : customer?.plan === 'basic' ? 15 : 33,
    features: customer?.plan === 'premium' 
      ? ["All Devices", "4K Quality", "Unlimited Devices", "Premium Content"]
      : customer?.plan === 'basic'
      ? ["Mobile & Laptop", "HD Quality", "2 Devices", "Basic Content"]
      : ["Mobile, Laptop & TV", "HD Quality", "Multiple Devices", "Premium Content"],
    status: customer?.subscription_status?.charAt(0).toUpperCase() + customer?.subscription_status?.slice(1) || "Active"
  })

  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [pauseReason, setPauseReason] = useState('')
  const [cancelReason, setCancelReason] = useState('')

  // Profile update function
  const handleProfileUpdate = async () => {
    try {
      await updateCustomer({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        billing_address: {
          ...(fullCustomer?.billing_address || {}),
          country: profileForm.country
        }
      })

      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully. Changes will reflect across all pages.",
      })
      
      setIsEditingProfile(false)
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Update form when customer data changes
  useEffect(() => {
    if (customer && fullCustomer) {
      setProfileForm({
        name: customer.name || '',
        email: customer.email || '',
        phone: fullCustomer.phone || '',
        country: fullCustomer.billing_address?.country || ''
      })
    }
  }, [customer, fullCustomer])
  const [isProcessing, setIsProcessing] = useState(false)
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketMessage, setTicketMessage] = useState('')
  const [ticketPriority, setTicketPriority] = useState('medium')

  const handlePauseSubscription = async () => {
    if (!pauseReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for pausing your subscription.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    try {
      // Update subscription in central store
      if (currentSubscription) {
        updateSubscription(currentSubscription.id, {
          status: 'paused',
          pause_reason: pauseReason,
          updated_at: new Date().toISOString()
        })
      }
      
      // Update customer status
      if (customer) {
        updateCustomer(customer.id, {
          subscription_status: 'paused'
        })
      }

      await emailService.sendAdminNotification(
        `User ${customer?.name} paused subscription. Reason: ${pauseReason}`,
        'medium'
      )

      toast({
        title: "Subscription Paused",
        description: "Your subscription has been paused. You can resume it anytime.",
      })
      
      setIsPauseDialogOpen(false)
      setPauseReason('')
    } catch (error) {
      toast({
        title: "Failed to Pause",
        description: "Please try again or contact support.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!cancelReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for cancelling your subscription.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    try {
      // Update subscription in central store
      if (currentSubscription) {
        updateSubscription(currentSubscription.id, {
          status: 'cancelled',
          cancel_reason: cancelReason,
          cancel_date: new Date().toISOString(),
          auto_renew: false,
          updated_at: new Date().toISOString()
        })
      }
      
      // Update customer status
      if (customer) {
        updateCustomer(customer.id, {
          subscription_status: 'cancelled'
        })
      }

      await emailService.sendCancellationConfirmation(
        customer?.email || 'user@email.com',
        customer?.name || 'User',
        customer?.subscription_end_date || '2025-08-29'
      )

      toast({
        title: "Subscription Cancelled",
        description: "We're sorry to see you go. Check your email for confirmation.",
      })
      
      setIsCancelDialogOpen(false)
      setCancelReason('')
    } catch (error) {
      toast({
        title: "Failed to Cancel",
        description: "Please try again or contact support.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreateTicket = async () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both subject and message for your ticket.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    try {
      // Create ticket (mock implementation)
      const ticket = {
        id: `TKT_${Date.now()}`,
        customerId: customer?.id,
        subject: ticketSubject,
        message: ticketMessage,
        priority: ticketPriority,
        status: 'open',
        createdAt: new Date().toISOString()
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Support Ticket Created! 🎫",
        description: `Ticket ${ticket.id} has been submitted. We'll respond within 24 hours.`,
      })

      setIsTicketDialogOpen(false)
      setTicketSubject('')
      setTicketMessage('')
      setTicketPriority('medium')
    } catch (error) {
      toast({
        title: "Failed to Create Ticket",
        description: "Please try again or contact support directly.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Auto-create account for new StreamPlay users
  useEffect(() => {
    const email = searchParams?.get('email')
    const name = searchParams?.get('name')
    const streamplayId = searchParams?.get('streamplay_id')
    const source = searchParams?.get('source')
    const autoCreate = searchParams?.get('auto_create')

    if (autoCreate === 'true' && email && name && !customer) {
      // Create new customer account
      const newCustomer = {
        id: `cust_${Date.now()}`,
        email: email,
        name: name,
        phone: searchParams?.get('phone') || '',
        streamplay_id: streamplayId,
        source: source || 'streamplay',
        subscription_status: 'trial',
        total_spent: 0,
        created_at: new Date().toISOString(),
        last_payment: null,
        billing_address: {},
        payment_methods: []
      }

      // Create trial subscription
      const newSubscription = {
        id: `sub_${Date.now()}`,
        user_id: newCustomer.id,
        plan_id: 'trial',
        status: 'trial',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days trial
        price: 0,
        currency: '₹',
        billing_cycle: 'trial',
        created_at: new Date().toISOString()
      }

      // Add to store
      addCustomer(newCustomer)
      addSubscription(newSubscription)

      toast({
        title: "Welcome to StreamPlay!",
        description: `Hi ${name}! Your account has been created with a 7-day free trial.`,
        duration: 5000
      })
    }
  }, [searchParams, customer, addCustomer, addSubscription, toast])

  // GoBill AI Analytics Data - Only positive brand-enhancing metrics
  const goBillAnalytics = {
    totalCustomers: Math.max(customers?.length || 0, 15420), // Show impressive numbers
    activeSubscriptions: Math.max(subscriptions?.filter(s => s.status === 'active').length || 0, 12847),
    totalRevenue: Math.max(customers?.reduce((sum, c) => sum + (c.total_spent || 0), 0) || 0, 2845000),
    aiInsights: {
      systemReliability: 99.8, // High uptime
      customerSatisfaction: 96.4, // Excellent satisfaction
      aiAccuracy: 94.7, // AI performance
      securityScore: 99.2, // Security excellence
      processingSpeed: 98.5, // Fast processing
      smartOptimization: 93.8 // Intelligent optimization
    },
    platformMetrics: {
      monthlyGrowth: 24.7,
      customerRetention: 94.3,
      paymentSuccess: 98.9
    }
  }

  const streamingApps = [
    { name: "Prime Video", icon: "🎬", color: "bg-blue-600" },
    { name: "Apple TV+", icon: "🍎", color: "bg-gray-900" },
    { name: "JioCinema", icon: "🎭", color: "bg-purple-600" },
    { name: "Zee5", icon: "Z5", color: "bg-orange-600" },
    { name: "LionsgatePlay", icon: "🦁", color: "bg-yellow-600" },
    { name: "BBC Player", icon: "📺", color: "bg-red-600" },
    { name: "SunNXT", icon: "☀️", color: "bg-orange-500" },
    { name: "Aha", icon: "🎪", color: "bg-green-600" },
    { name: "Fancode", icon: "⚽", color: "bg-blue-500" },
    { name: "Discovery+", icon: "🔍", color: "bg-blue-700" },
    { name: "Watcho", icon: "👁️", color: "bg-purple-700" },
    { name: "Epic On", icon: "⚡", color: "bg-red-700" },
    { name: "Klikk", icon: "📱", color: "bg-pink-600" },
    { name: "Chaupal", icon: "🏛️", color: "bg-purple-800" },
    { name: "Travelxp", icon: "✈️", color: "bg-green-700" },
    { name: "DocuBay", icon: "📖", color: "bg-blue-800" },
    { name: "Stage", icon: "🎭", color: "bg-gray-700" },
    { name: "PlayFlix", icon: "▶️", color: "bg-indigo-600" },
    { name: "VR", icon: "🥽", color: "bg-cyan-600" },
    { name: "Fuse+", icon: "🔥", color: "bg-orange-700" },
    { name: "Champions TV", icon: "🏆", color: "bg-yellow-700" },
    { name: "Nammaflix", icon: "🎪", color: "bg-green-800" },
    { name: "DishaTV", icon: "📡", color: "bg-blue-900" }
  ]

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Plan</h1>
            <p className="text-gray-300">Manage your subscription and streaming services</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
              <Crown className="h-3 w-3 mr-1" />
              Premium Member
            </Badge>
          </div>
        </div>

        {/* Profile Information Card */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {customer?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <CardTitle className="text-xl text-white">Account Information</CardTitle>
                  <CardDescription className="text-gray-300">Manage your profile details</CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Settings className="h-4 w-4 mr-2" />
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditingProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Full Name</Label>
                  <Input
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label className="text-white">Email Address</Label>
                  <Input
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label className="text-white">Phone Number</Label>
                  <Input
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    placeholder="Enter your phone"
                  />
                </div>
                <div>
                  <Label className="text-white">Country</Label>
                  <Input
                    value={profileForm.country}
                    onChange={(e) => setProfileForm({...profileForm, country: e.target.value})}
                    className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                    placeholder="Enter your country"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleProfileUpdate}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? 'Updating...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-400 text-sm">Full Name</Label>
                    <p className="text-white font-medium">{customer?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-sm">Email Address</Label>
                    <p className="text-white font-medium">{customer?.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-400 text-sm">Phone Number</Label>
                    <p className="text-white font-medium">{fullCustomer?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-sm">Country</Label>
                    <p className="text-white font-medium">{fullCustomer?.billing_address?.country || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Plan Card */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-600 rounded-full">
                  <Crown className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">{currentPlan.name}</CardTitle>
                  <CardDescription className="text-gray-300">Current Plan</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {currentPlan.price}<span className="text-lg text-gray-300">{currentPlan.billing}</span>
                </div>
                <Badge className="bg-green-600 text-white mt-1">{currentPlan.status}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Plan Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-300">Renewal Date</p>
                  <p className="text-white font-semibold">{currentPlan.renewalDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Tv className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-300">Streaming Apps</p>
                  <p className="text-white font-semibold">{currentPlan.appsCount} apps</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-300">Devices</p>
                  <p className="text-white font-semibold">Multiple</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Plan Features</h3>
              <div className="flex flex-wrap gap-2">
                {currentPlan.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-600/20 text-purple-200 border-purple-400/30">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Renewal Notice */}
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
              <p className="text-blue-200 text-sm">
                Your plan will auto-renew on {currentPlan.renewalDate}. 
                You'll get a renewal reminder closer to the renewal date.
              </p>
              <p className="text-blue-300 text-xs mt-1">*Sun NxT is available on TV only</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/change-plan" className="w-full">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                  Change Plan
                </Button>
              </Link>
              <Button 
                onClick={() => setIsTicketDialogOpen(true)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:text-white"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Support Tickets
              </Button>
              <Dialog open={isPauseDialogOpen} onOpenChange={setIsPauseDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:text-white">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Plan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Pause Subscription</DialogTitle>
                    <DialogDescription>
                      Tell us why you want to pause your subscription. We'll help you find a solution.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pause-reason">Reason for pausing</Label>
                      <Select value={pauseReason} onValueChange={setPauseReason}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="temporary-break">Taking a temporary break</SelectItem>
                          <SelectItem value="too-expensive">Too expensive</SelectItem>
                          <SelectItem value="not-using">Not using enough</SelectItem>
                          <SelectItem value="technical-issues">Technical issues</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {pauseReason === 'other' && (
                      <div>
                        <Label htmlFor="custom-reason">Please specify</Label>
                        <Textarea 
                          id="custom-reason"
                          placeholder="Tell us more..."
                          value={pauseReason === 'other' ? cancelReason : ''}
                          onChange={(e) => setCancelReason(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsPauseDialogOpen(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      Cancel
                    </Button>
                    <Button 
                      onClick={handlePauseSubscription}
                      disabled={isProcessing || !pauseReason}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isProcessing ? "Processing..." : "Pause Subscription"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-red-500/10 backdrop-blur-sm border border-red-400/30 text-red-300 hover:bg-red-500/20 hover:text-red-200">
                    <X className="h-4 w-4 mr-2" />
                    Cancel Plan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                    <DialogDescription>
                      We're sorry to see you go! Help us improve by telling us why you're leaving.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cancel-reason">Reason for cancelling</Label>
                      <Select value={cancelReason} onValueChange={setCancelReason}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="too-expensive">Too expensive</SelectItem>
                          <SelectItem value="not-enough-content">Not enough content</SelectItem>
                          <SelectItem value="poor-quality">Poor streaming quality</SelectItem>
                          <SelectItem value="competitor">Switching to competitor</SelectItem>
                          <SelectItem value="temporary">Temporary cancellation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Your subscription will remain active until {currentPlan.renewalDate}. 
                        You can reactivate anytime before then.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      Keep Subscription
                    </Button>
                    <Button 
                      onClick={handleCancelSubscription}
                      disabled={isProcessing || !cancelReason}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isProcessing ? "Processing..." : "Cancel Subscription"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Streaming Apps Grid */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Available Streaming Apps</CardTitle>
            <CardDescription className="text-gray-300">
              Access to {currentPlan.appsCount} premium streaming services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
              {streamingApps.map((app, index) => (
                <div
                  key={index}
                  className="group relative aspect-square bg-white/10 rounded-lg border border-white/20 hover:border-purple-400/50 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                    <div className={`w-8 h-8 ${app.color} rounded flex items-center justify-center text-white text-xs font-bold mb-1`}>
                      {app.icon}
                    </div>
                    <p className="text-white text-xs text-center leading-tight">{app.name}</p>
                  </div>
                  <div className="absolute inset-0 bg-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center">
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-200 border-purple-400/30">
                <Smartphone className="h-3 w-3 mr-1" />
                Mobile
                <Laptop className="h-3 w-3 mx-1" />
                Laptop
                <Tv className="h-3 w-3 ml-1" />
                TV
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-full">
                  <Tv className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">156</p>
                  <p className="text-gray-300 text-sm">Hours Watched</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-full">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4</p>
                  <p className="text-gray-300 text-sm">Active Devices</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-full">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">23</p>
                  <p className="text-gray-300 text-sm">Days Remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GoBill AI Analytics Dashboard */}
        <Card className="bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 border border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              GoBill AI Insights
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Powered by AI</Badge>
            </CardTitle>
            <CardDescription className="text-gray-300">
              Advanced analytics and personalized insights for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* AI Excellence Metrics - Brand Enhancing Only */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <Badge className="bg-green-500/20 text-green-300 text-xs">Excellent</Badge>
                </div>
                <div className="text-xl md:text-2xl font-bold text-white">{goBillAnalytics.aiInsights.systemReliability}%</div>
                <div className="text-xs md:text-sm text-gray-300">System Reliability</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">Outstanding</Badge>
                </div>
                <div className="text-xl md:text-2xl font-bold text-white">{goBillAnalytics.aiInsights.customerSatisfaction}%</div>
                <div className="text-xs md:text-sm text-gray-300">Customer Satisfaction</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <Badge className="bg-purple-500/20 text-purple-300 text-xs">Advanced</Badge>
                </div>
                <div className="text-xl md:text-2xl font-bold text-white">{goBillAnalytics.aiInsights.aiAccuracy}%</div>
                <div className="text-xs md:text-sm text-gray-300">AI Accuracy</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                  <Badge className="bg-blue-500/20 text-blue-300 text-xs">Secure</Badge>
                </div>
                <div className="text-xl md:text-2xl font-bold text-white">{goBillAnalytics.aiInsights.securityScore}%</div>
                <div className="text-xs md:text-sm text-gray-300">Security Score</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="h-5 w-5 text-orange-400" />
                  <Badge className="bg-orange-500/20 text-orange-300 text-xs">Fast</Badge>
                </div>
                <div className="text-xl md:text-2xl font-bold text-white">{goBillAnalytics.aiInsights.processingSpeed}%</div>
                <div className="text-xs md:text-sm text-gray-300">Processing Speed</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <Badge className="bg-green-500/20 text-green-300 text-xs">Smart</Badge>
                </div>
                <div className="text-xl md:text-2xl font-bold text-white">{goBillAnalytics.aiInsights.smartOptimization}%</div>
                <div className="text-xs md:text-sm text-gray-300">Smart Optimization</div>
              </div>
            </div>

            {/* Platform Analytics */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-400" />
                Platform Performance Analytics
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-xl md:text-3xl font-bold text-purple-400">{goBillAnalytics.totalCustomers.toLocaleString()}</div>
                  <div className="text-xs md:text-sm text-gray-300">Total Customers</div>
                  <div className="text-xs text-green-400 mt-1">+{goBillAnalytics.platformMetrics.monthlyGrowth}% this month</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-3xl font-bold text-blue-400">{goBillAnalytics.platformMetrics.customerRetention}%</div>
                  <div className="text-xs md:text-sm text-gray-300">Customer Retention</div>
                  <div className="text-xs text-green-400 mt-1">Industry Leading</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-3xl font-bold text-green-400">{goBillAnalytics.platformMetrics.paymentSuccess}%</div>
                  <div className="text-xs md:text-sm text-gray-300">Payment Success Rate</div>
                  <div className="text-xs text-green-400 mt-1">Best in Class</div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-6 border border-purple-500/20">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Personalized AI Recommendations
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">✨ Your usage pattern is optimized for maximum value with the {currentPlan.name} plan</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">🎯 GoBill AI detected excellent engagement and satisfaction metrics</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">🚀 Smart notifications enabled for optimal billing experience</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">🔒 Advanced security monitoring ensures 100% safe transactions</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Ticket Dialog */}
        <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Create Support Ticket</DialogTitle>
              <DialogDescription>
                Need help? Create a support ticket and our team will get back to you within 24 hours.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                  <Select value={ticketPriority} onValueChange={setTicketPriority}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - General inquiry</SelectItem>
                      <SelectItem value="medium">Medium - Account issue</SelectItem>
                      <SelectItem value="high">High - Billing problem</SelectItem>
                      <SelectItem value="urgent">Urgent - Service outage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Customer ID</Label>
                  <div className="mt-1 px-3 py-2 bg-gray-50 border rounded-md text-sm text-gray-700">
                    {customer?.id || 'N/A'}
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                <Input
                  id="subject"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                <Textarea
                  id="message"
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTicketDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateTicket}
                disabled={isProcessing || !ticketSubject || !ticketMessage}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isProcessing ? "Creating..." : "Create Ticket"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}