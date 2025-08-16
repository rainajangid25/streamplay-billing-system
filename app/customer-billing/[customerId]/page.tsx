'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Bitcoin, 
  Wallet, 
  Shield, 
  CheckCircle,
  ArrowLeft,
  Crown,
  Clock,
  Star,
  Zap,
  Lock
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { PaymentService, StripePaymentService, RazorpayPaymentService, CryptoPaymentService } from '@/lib/payments-client'
import { SubscriptionService } from '@/lib/subscription'
import { emailService } from '@/lib/email-client'
import { useBillingStore } from '@/lib/store'

export default function CustomerBillingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { customers, addCustomer, addSubscription, addInvoice } = useBillingStore()
  
  const customerId = params?.customerId as string
  const plan = searchParams?.get('plan') || 'mega'
  const price = searchParams?.get('price') || '399'
  const billing = searchParams?.get('billing') || 'monthly'

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cryptoMethod, setCryptoMethod] = useState('bitcoin')
  const [isProcessing, setIsProcessing] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Get customer from store or create new one
  const existingCustomer = customers.find(c => c.id === customerId)
  const [customer] = useState(existingCustomer || {
    id: customerId,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+91 9876543210',
    currentPlan: 'Basic',
    isExistingCustomer: !!existingCustomer
  })

  const planDetails = {
    basic: { name: 'Basic', price: 199, annualPrice: 1990, apps: 15, features: ['Mobile & Laptop', 'HD Quality', '2 Devices'] },
    mega: { name: 'Mega', price: 399, annualPrice: 3990, apps: 33, features: ['Mobile, Laptop & TV', 'HD Quality', 'Multiple Devices', 'Premium Content'] },
    premium: { name: 'Premium', price: 599, annualPrice: 5990, apps: 50, features: ['All Devices', '4K Quality', 'Unlimited Devices', 'Premium + Exclusive Content'] }
  }

  const selectedPlan = planDetails[plan as keyof typeof planDetails]
  const finalPrice = billing === 'annual' ? selectedPlan.annualPrice : selectedPlan.price
  const savings = billing === 'annual' ? Math.round(((selectedPlan.price * 12) - selectedPlan.annualPrice) / (selectedPlan.price * 12) * 100) : 0

  const handlePayment = async () => {
    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to terms and conditions to proceed.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    
    try {
      // Process payment based on selected method
      let paymentResult
      const totalAmount = finalPrice + Math.round(finalPrice * 0.18)
      
      if (paymentMethod === 'crypto') {
        paymentResult = await PaymentService.processPayment(cryptoMethod as any, totalAmount, {
          userId: customerId,
          plan: selectedPlan.name,
          billingCycle: billing
        })
      } else {
        paymentResult = await PaymentService.processPayment('stripe', totalAmount, {
          userId: customerId,
          plan: selectedPlan.name,
          billingCycle: billing
        })
      }

      // Create subscription and add to store
      const subscription = await SubscriptionService.createSubscription(
        customerId,
        plan,
        billing as 'monthly' | 'annual',
        paymentMethod === 'crypto' ? cryptoMethod : 'stripe',
        finalPrice
      )
      addSubscription(subscription)

      // Add customer to store if new
      if (!existingCustomer) {
        const newCustomer = {
          ...customer,
          plan,
          subscription_status: 'active' as any,
          subscription_end_date: subscription.end_date,
          created_at: new Date().toISOString(),
          total_spent: totalAmount,
          last_login: new Date().toISOString(),
          status: 'active' as any
        }
        addCustomer(newCustomer)
      }

      // Create invoice and add to store
      const invoice = {
        id: `inv_${customerId}_${Date.now()}`,
        customer_id: customerId,
        customer_name: customer.name,
        amount: totalAmount,
        status: 'paid' as any,
        due_date: new Date().toISOString().split('T')[0],
        payment_method: paymentMethod === 'crypto' ? cryptoMethod : 'card',
        created_at: new Date().toISOString(),
        items: [{
          description: `${selectedPlan.name} Plan Subscription`,
          amount: totalAmount
        }]
      }
      addInvoice(invoice)

      // Send welcome email and receipt
      await emailService.sendWelcomeEmail(customer.email, customer.name, selectedPlan.name)
      await emailService.sendPaymentReceipt(customer.email, customer.name, {
        amount: totalAmount,
        plan: selectedPlan.name,
        paymentMethod: paymentMethod === 'crypto' ? cryptoMethod : 'card',
        transactionId: paymentResult.id || 'TXN_' + Date.now(),
        billingCycle: billing
      })

      setIsProcessing(false)
      
      toast({
        title: "Payment Successful! 🎉",
        description: `Welcome to ${selectedPlan.name} plan! Check your email for confirmation.`,
      })

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        window.location.href = `/my-plan?success=true&plan=${selectedPlan.name}`
      }, 2000)

    } catch (error) {
      setIsProcessing(false)
      console.error('Payment failed:', error)
      
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/change-plan">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Plans
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Complete Your Subscription</h1>
              <p className="text-gray-300">Secure checkout for {customer.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-green-600 text-white px-3 py-1">
              <Shield className="h-3 w-3 mr-1" />
              256-bit SSL Secured
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span>Customer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Full Name</Label>
                    <Input 
                      value={customer.name} 
                      className="bg-white/5 border-white/20 text-white"
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Email</Label>
                    <Input 
                      value={customer.email} 
                      className="bg-white/5 border-white/20 text-white"
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Phone</Label>
                    <Input 
                      value={customer.phone} 
                      className="bg-white/5 border-white/20 text-white"
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Customer ID</Label>
                    <Input 
                      value={customer.id} 
                      className="bg-white/5 border-white/20 text-white"
                      disabled
                    />
                  </div>
                </div>
                {customer.isExistingCustomer && (
                  <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
                    <p className="text-blue-200 text-sm flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Welcome back! You're upgrading from {customer.currentPlan} to {selectedPlan.name} plan.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Choose Payment Method</CardTitle>
                <CardDescription className="text-gray-300">
                  Select your preferred payment option
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 bg-white/5">
                    <TabsTrigger value="card" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      Traditional Payment
                    </TabsTrigger>
                    <TabsTrigger value="crypto" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      Cryptocurrency
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-6">
                    <RadioGroup defaultValue="card" className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/20">
                        <RadioGroupItem value="card" id="card" />
                        <CreditCard className="h-5 w-5 text-purple-400" />
                        <div className="flex-1">
                          <Label htmlFor="card" className="text-white font-medium">Credit/Debit Card</Label>
                          <p className="text-gray-400 text-sm">Visa, Mastercard, Rupay</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/20">
                        <RadioGroupItem value="upi" id="upi" />
                        <Smartphone className="h-5 w-5 text-green-400" />
                        <div className="flex-1">
                          <Label htmlFor="upi" className="text-white font-medium">UPI</Label>
                          <p className="text-gray-400 text-sm">PhonePe, Google Pay, Paytm</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/20">
                        <RadioGroupItem value="netbanking" id="netbanking" />
                        <Building2 className="h-5 w-5 text-blue-400" />
                        <div className="flex-1">
                          <Label htmlFor="netbanking" className="text-white font-medium">Net Banking</Label>
                          <p className="text-gray-400 text-sm">All major banks supported</p>
                        </div>
                      </div>
                    </RadioGroup>

                    {/* Card Form */}
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label className="text-gray-300">Card Number</Label>
                        <Input 
                          placeholder="1234 5678 9012 3456"
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300">Expiry Date</Label>
                          <Input 
                            placeholder="MM/YY"
                            className="bg-white/5 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">CVV</Label>
                          <Input 
                            placeholder="123"
                            className="bg-white/5 border-white/20 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300">Cardholder Name</Label>
                        <Input 
                          placeholder="Name as on card"
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="crypto" className="space-y-6">
                    <RadioGroup value={cryptoMethod} onValueChange={setCryptoMethod} className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/20">
                        <RadioGroupItem value="bitcoin" id="bitcoin" />
                        <Bitcoin className="h-5 w-5 text-orange-400" />
                        <div className="flex-1">
                          <Label htmlFor="bitcoin" className="text-white font-medium">Bitcoin (BTC)</Label>
                          <p className="text-gray-400 text-sm">Pay with Bitcoin</p>
                        </div>
                        <Badge className="bg-orange-600/20 text-orange-200">BTC</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/20">
                        <RadioGroupItem value="ethereum" id="ethereum" />
                        <Wallet className="h-5 w-5 text-blue-400" />
                        <div className="flex-1">
                          <Label htmlFor="ethereum" className="text-white font-medium">Ethereum (ETH)</Label>
                          <p className="text-gray-400 text-sm">Pay with Ethereum</p>
                        </div>
                        <Badge className="bg-blue-600/20 text-blue-200">ETH</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/20">
                        <RadioGroupItem value="usdt" id="usdt" />
                        <Zap className="h-5 w-5 text-green-400" />
                        <div className="flex-1">
                          <Label htmlFor="usdt" className="text-white font-medium">USDT (Tether)</Label>
                          <p className="text-gray-400 text-sm">Pay with USDT stablecoin</p>
                        </div>
                        <Badge className="bg-green-600/20 text-green-200">USDT</Badge>
                      </div>
                    </RadioGroup>

                    {/* Crypto Payment Info */}
                    <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Bitcoin className="h-5 w-5 text-yellow-400 mt-0.5" />
                        <div>
                          <p className="text-yellow-200 font-medium text-sm">Cryptocurrency Payment</p>
                          <p className="text-yellow-300 text-sm mt-1">
                            You'll be redirected to our secure crypto payment gateway. 
                            Payment confirmation may take 5-15 minutes depending on network congestion.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={setAgreedToTerms}
                    className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="text-white text-sm cursor-pointer">
                      I agree to the{' '}
                      <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                        Privacy Policy
                      </Link>
                    </Label>
                    <p className="text-gray-400 text-xs mt-1">
                      Your subscription will auto-renew. You can cancel anytime from your account settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{selectedPlan.name} Plan</h3>
                      <p className="text-gray-400 text-sm">{selectedPlan.apps} streaming apps</p>
                    </div>
                    <Crown className="h-8 w-8 text-yellow-500" />
                  </div>
                  
                  <div className="space-y-2">
                    {selectedPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-white/20" />

                {/* Pricing */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Plan ({billing})</span>
                    <span>₹{finalPrice}</span>
                  </div>
                  
                  {billing === 'annual' && savings > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Annual Savings</span>
                      <span>-₹{(selectedPlan.price * 12) - selectedPlan.annualPrice}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-300">
                    <span>Taxes & Fees</span>
                    <span>₹{Math.round(finalPrice * 0.18)}</span>
                  </div>
                  
                  <Separator className="bg-white/20" />
                  
                  <div className="flex justify-between text-white text-lg font-bold">
                    <span>Total</span>
                    <span>₹{finalPrice + Math.round(finalPrice * 0.18)}</span>
                  </div>
                </div>

                {billing === 'annual' && (
                  <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-3">
                    <p className="text-green-200 text-sm text-center">
                      <Star className="h-4 w-4 inline mr-1" />
                      You save {savings}% with annual billing!
                    </p>
                  </div>
                )}

                {/* Payment Button */}
                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing || !agreedToTerms}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Complete Payment</span>
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-gray-400 text-xs">
                    <Shield className="h-3 w-3 inline mr-1" />
                    Secured by 256-bit SSL encryption
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
