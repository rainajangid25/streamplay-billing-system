"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Coins, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { apiCall } from "@/hooks/use-api"

interface PaymentProcessorProps {
  onPaymentSuccess?: (result: any) => void
  onPaymentError?: (error: string) => void
}

export function PaymentProcessor({ onPaymentSuccess, onPaymentError }: PaymentProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState<any>(null)
  const [formData, setFormData] = useState({
    amount: "",
    currency: "",
    paymentMethod: "",
    customerEmail: "",
    description: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const processPayment = async () => {
    if (!formData.amount || !formData.currency || !formData.paymentMethod) {
      return
    }

    setIsProcessing(true)
    setPaymentResult(null)

    try {
      let result

      if (["ETH", "USDC", "MATIC", "BTC"].includes(formData.currency)) {
        // Process crypto payment
        result = await apiCall("/blockchain", {
          method: "POST",
          body: JSON.stringify({
            action: "process_crypto_payment",
            data: {
              amount: Number.parseFloat(formData.amount),
              currency: formData.currency,
              network: formData.currency === "BTC" ? "Bitcoin" : "Ethereum",
              customerEmail: formData.customerEmail,
              description: formData.description,
            },
          }),
        })
      } else {
        // Process fiat payment
        result = await apiCall("/billing", {
          method: "POST",
          body: JSON.stringify({
            action: "process_payment",
            data: {
              amount: Number.parseFloat(formData.amount),
              currency: formData.currency,
              paymentMethod: formData.paymentMethod,
              customerEmail: formData.customerEmail,
              description: formData.description,
            },
          }),
        })
      }

      setPaymentResult(result)
      onPaymentSuccess?.(result)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Payment processing failed"
      setPaymentResult({
        success: false,
        message: errorMessage,
      })
      onPaymentError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setFormData({
      amount: "",
      currency: "",
      paymentMethod: "",
      customerEmail: "",
      description: "",
    })
    setPaymentResult(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Processor
        </CardTitle>
        <CardDescription>Process fiat and cryptocurrency payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!paymentResult ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD (Fiat)</SelectItem>
                    <SelectItem value="EUR">EUR (Fiat)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                    <SelectItem value="MATIC">Polygon (MATIC)</SelectItem>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {["USD", "EUR"].includes(formData.currency) ? (
                    <>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="metamask">MetaMask</SelectItem>
                      <SelectItem value="walletconnect">WalletConnect</SelectItem>
                      <SelectItem value="coinbase">Coinbase Wallet</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Customer Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@example.com"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Payment description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                Reset
              </Button>
              <Button
                onClick={processPayment}
                disabled={!formData.amount || !formData.currency || !formData.paymentMethod || isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {["ETH", "USDC", "MATIC", "BTC"].includes(formData.currency) ? (
                      <Coins className="h-4 w-4 mr-2" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    Process Payment
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            {paymentResult.success ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-900 mb-2">Payment Successful!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {paymentResult.message || "Your payment has been processed successfully."}
                </p>
                {paymentResult.transactionHash && (
                  <div className="p-3 bg-gray-50 rounded-lg mb-4">
                    <p className="text-xs text-gray-600 mb-1">Transaction Hash:</p>
                    <p className="text-xs font-mono break-all">{paymentResult.transactionHash}</p>
                  </div>
                )}
                <Badge variant="secondary" className="mb-4">
                  Status: {paymentResult.status}
                </Badge>
              </>
            ) : (
              <>
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 mb-2">Payment Failed</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {paymentResult.message || "Something went wrong. Please try again."}
                </p>
              </>
            )}

            <Button onClick={resetForm} className="w-full">
              Process Another Payment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
