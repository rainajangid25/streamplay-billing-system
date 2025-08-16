"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Bitcoin,
  Wallet,
  Calendar,
  ExternalLink,
  Filter,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Transaction {
  id: string
  customer_id: string
  amount: number
  currency: string
  payment_method: string
  blockchain_tx_hash?: string
  status: string
  transaction_type: string
  created_at: string
  customers?: {
    name: string
    email: string
  }
}

interface Subscription {
  id: string
  customer_id: string
  plan_name: string
  amount: number
  currency: string
  billing_cycle: string
  status: string
  next_billing_date?: string
  created_at: string
  customers?: {
    name: string
    email: string
  }
}

export default function BillingPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("transactions")

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    try {
      // Fetch transactions with customer data
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .select(`
          *,
          customers (
            name,
            email
          )
        `)
        .order("created_at", { ascending: false })

      if (transactionError) throw transactionError

      // Fetch subscriptions with customer data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select(`
          *,
          customers (
            name,
            email
          )
        `)
        .order("created_at", { ascending: false })

      if (subscriptionError) throw subscriptionError

      setTransactions(transactionData || [])
      setSubscriptions(subscriptionData || [])
    } catch (error) {
      console.error("Error fetching billing data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const customerName = transaction.customers?.name || ""
    const customerEmail = transaction.customers?.email || ""

    return (
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.blockchain_tx_hash?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const customerName = subscription.customers?.name || ""
    const customerEmail = subscription.customers?.email || ""

    return (
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Calculate stats
  const transactionStats = {
    total: transactions.length,
    completed: transactions.filter((t) => t.status === "completed").length,
    pending: transactions.filter((t) => t.status === "pending").length,
    failed: transactions.filter((t) => t.status === "failed").length,
    totalAmount: transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0),
    cryptoPayments: transactions.filter((t) => ["ethereum", "bitcoin", "usdc", "polygon"].includes(t.payment_method))
      .length,
    fiatPayments: transactions.filter((t) => ["credit_card", "bank_transfer", "paypal"].includes(t.payment_method))
      .length,
  }

  const subscriptionStats = {
    total: subscriptions.length,
    active: subscriptions.filter((s) => s.status === "active").length,
    cancelled: subscriptions.filter((s) => s.status === "cancelled").length,
    expired: subscriptions.filter((s) => s.status === "expired").length,
    monthlyRevenue: subscriptions
      .filter((s) => s.status === "active" && s.billing_cycle === "monthly")
      .reduce((sum, s) => sum + s.amount, 0),
    yearlyRevenue: subscriptions
      .filter((s) => s.status === "active" && s.billing_cycle === "yearly")
      .reduce((sum, s) => sum + s.amount * 12, 0),
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "ethereum":
      case "bitcoin":
      case "usdc":
      case "polygon":
        return <Bitcoin className="h-4 w-4" />
      case "credit_card":
        return <CreditCard className="h-4 w-4" />
      default:
        return <Wallet className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
          <p className="text-muted-foreground">Monitor transactions, subscriptions, and revenue</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(transactionStats.totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">MRR</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(subscriptionStats.monthlyRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{transactionStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{transactionStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Crypto</p>
                <p className="text-2xl font-bold text-orange-600">{transactionStats.cryptoPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Fiat</p>
                <p className="text-2xl font-bold text-purple-600">{transactionStats.fiatPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, payment method, or transaction hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="transactions">Transactions ({transactionStats.total})</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions ({subscriptionStats.total})</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Transactions will appear here once customers make payments"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredTransactions.map((transaction) => (
                <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            {getPaymentMethodIcon(transaction.payment_method)}
                            <span className="font-semibold capitalize">
                              {transaction.payment_method.replace("_", " ")}
                            </span>
                          </div>
                          <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                          <span className="text-2xl font-bold">
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="font-medium text-foreground">Customer</p>
                            <p>{transaction.customers?.name}</p>
                            <p>{transaction.customers?.email}</p>
                          </div>

                          <div>
                            <p className="font-medium text-foreground">Transaction</p>
                            <p>Type: {transaction.transaction_type.replace("_", " ")}</p>
                            <p>Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
                          </div>

                          {transaction.blockchain_tx_hash && (
                            <div>
                              <p className="font-medium text-foreground">Blockchain</p>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs">
                                  {transaction.blockchain_tx_hash.slice(0, 10)}...
                                  {transaction.blockchain_tx_hash.slice(-8)}
                                </span>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-foreground">Status</p>
                            <div className="flex items-center gap-2">
                              {transaction.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                              {transaction.status === "pending" && <Clock className="h-4 w-4 text-yellow-600" />}
                              {transaction.status === "failed" && <AlertCircle className="h-4 w-4 text-red-600" />}
                              <span className="capitalize">{transaction.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          {filteredSubscriptions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No subscriptions found</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Subscriptions will appear here once customers subscribe"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredSubscriptions.map((subscription) => (
                <Card key={subscription.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold">{subscription.plan_name}</h3>
                          <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                          <span className="text-xl font-bold">
                            {formatCurrency(subscription.amount, subscription.currency)}
                            <span className="text-sm font-normal text-muted-foreground">
                              /{subscription.billing_cycle}
                            </span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="font-medium text-foreground">Customer</p>
                            <p>{subscription.customers?.name}</p>
                            <p>{subscription.customers?.email}</p>
                          </div>

                          <div>
                            <p className="font-medium text-foreground">Billing</p>
                            <p>Cycle: {subscription.billing_cycle}</p>
                            <p>Started: {new Date(subscription.created_at).toLocaleDateString()}</p>
                          </div>

                          {subscription.next_billing_date && (
                            <div>
                              <p className="font-medium text-foreground">Next Billing</p>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(subscription.next_billing_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-foreground">Status</p>
                            <div className="flex items-center gap-2">
                              {subscription.status === "active" && <CheckCircle className="h-4 w-4 text-green-600" />}
                              {subscription.status === "cancelled" && <AlertCircle className="h-4 w-4 text-red-600" />}
                              <span className="capitalize">{subscription.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
