"use client"

import { useState, useEffect } from "react"
import { formatNumber, formatCurrency } from "@/lib/utils"
import { SyncIndicator, DataFreshnessIndicator } from "@/components/ui/sync-indicator"
import { useBillingStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  CreditCard,
  Globe,
  Brain,
  Wifi,
  Zap,
  DollarSign,
  Activity,
  RefreshCw,
  ImageIcon,
  MapPin,
  Database,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  Smartphone,
} from "lucide-react"
import Link from "next/link"
import { useApi } from "@/hooks/use-api"
import { NFTMintDialog } from "@/components/nft-mint-dialog"
import { PaymentProcessor } from "@/components/payment-processor"

export default function HomePage() {
  const { customers, subscriptions, invoices, products, lastUpdated } = useBillingStore()
  const [isOnline, setIsOnline] = useState(true)
  const [cacheStatus, setCacheStatus] = useState("synced")
  const [retryQueue, setRetryQueue] = useState(12)

  // API data hooks
  const { data: billingData, loading: billingLoading } = useApi("/billing")
  const { data: nftData, loading: nftLoading } = useApi("/nft")
  const { data: aiData, loading: aiLoading } = useApi("/ai")
  const { data: blockchainData, loading: blockchainLoading } = useApi("/blockchain")

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRetryQueue((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Default data for loading states
  const defaultBillingMetrics = {
    totalRevenue: 2847392,
    fiatRevenue: 1985674,
    cryptoRevenue: 861718,
    nftSubscriptions: 1247,
    activeRegions: 47,
    currencies: 23,
    paymentMethods: [
      { name: "Credit Cards", volume: 1985674, percentage: 69.7, color: "#3B82F6" },
      { name: "USDC", volume: 485320, percentage: 17.0, color: "#2775CA" },
      { name: "ETH", volume: 256890, percentage: 9.0, color: "#627EEA" },
      { name: "MATIC", volume: 119508, percentage: 4.2, color: "#8247E5" },
    ],
  }

  // Calculate real-time metrics from store data with safe array handling
  const realTimeBillingMetrics = {
    ...defaultBillingMetrics,
    totalRevenue: (customers && customers.length > 0) ? 
      Math.max(customers.reduce((sum, c) => sum + (c.total_spent || 0), 0), defaultBillingMetrics.totalRevenue) :
      defaultBillingMetrics.totalRevenue,
    activeSubscriptions: (subscriptions && subscriptions.length > 0) ? 
      subscriptions.filter(s => s.status === 'active').length : 
      defaultBillingMetrics.nftSubscriptions,
    totalCustomers: customers ? customers.length : 0,
    totalInvoices: invoices ? invoices.length : 0,
    activeProducts: (products && products.length > 0) ? 
      products.filter(p => p.is_active).length : 0
  }
  
  const billingMetrics = billingData || realTimeBillingMetrics
  const nftPasses = nftData?.passes || []
  const aiInsights = aiData?.insights || {}
  const blockchainInfo = blockchainData || {}

  const [regionalPricing] = useState([
    { region: "North America", currency: "USD", basePrice: 99, adjustment: 1.0, volume: 45.2 },
    { region: "Europe", currency: "EUR", basePrice: 89, adjustment: 0.9, volume: 28.7 },
    { region: "Asia Pacific", currency: "USD", basePrice: 79, adjustment: 0.8, volume: 15.3 },
    { region: "Latin America", currency: "USD", basePrice: 69, adjustment: 0.7, volume: 6.8 },
    { region: "Africa", currency: "USD", basePrice: 49, adjustment: 0.5, volume: 4.0 },
  ])

  const [aiRetryMetrics] = useState({
    totalRetries: 1247,
    successRate: 87.3,
    avgRetryTime: 2.4,
    intelligentRouting: 94.7,
    patterns: [
      { reason: "Network Timeout", count: 456, successRate: 89.2 },
      { reason: "Insufficient Funds", count: 234, successRate: 76.5 },
      { reason: "Card Declined", count: 189, successRate: 92.1 },
      { reason: "Gateway Error", count: 156, successRate: 95.8 },
      { reason: "3DS Challenge", count: 212, successRate: 83.4 },
    ],
  })

  const [cacheMetrics] = useState({
    hitRate: 94.7,
    totalRequests: 2847392,
    cachedData: 2.3,
    syncStatus: "Real-time",
    offlineCapable: 89.2,
    bandwidthSaved: 67.8,
    regions: [
      { name: "Low Bandwidth", users: 12450, cacheHit: 97.2 },
      { name: "Mobile 3G", users: 8930, cacheHit: 95.8 },
      { name: "Satellite", users: 3420, cacheHit: 98.9 },
      { name: "Rural Areas", users: 5670, cacheHit: 96.4 },
    ],
  })

  const [revenueData] = useState([
    { month: "Jan", fiat: 180000, crypto: 45000, nft: 12000 },
    { month: "Feb", fiat: 220000, crypto: 58000, nft: 18000 },
    { month: "Mar", fiat: 280000, crypto: 72000, nft: 25000 },
    { month: "Apr", fiat: 320000, crypto: 89000, nft: 34000 },
    { month: "May", fiat: 380000, crypto: 105000, nft: 42000 },
    { month: "Jun", fiat: 450000, crypto: 128000, nft: 58000 },
  ])

  const handlePaymentSuccess = (result: any) => {
    console.log("Payment successful:", result)
    // Handle successful payment
  }

  const handleMintSuccess = (result: any) => {
    console.log("NFT minted successfully:", result)
    // Handle successful NFT mint
  }

  return (
    <div style={{ minHeight: '100%', background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)', width: '100%' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Next-Generation Billing Platform</h1>
          <p style={{ color: '#4b5563' }}>Cloud-Native & Web3 Hybrid • API-First • Smart Contract-Driven • AI-Powered</p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(billingMetrics.totalRevenue)}</div>
              <p className="text-xs opacity-75">
                Fiat: {formatCurrency(billingMetrics.fiatRevenue)} • Crypto: {formatCurrency(billingMetrics.cryptoRevenue)}
              </p>
              <div className="mt-2 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+18.5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                NFT Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(billingMetrics.nftSubscriptions)}</div>
              <p className="text-xs opacity-75">Active access passes</p>
              <div className="mt-2 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+43 minted today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Global Reach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{billingMetrics.activeRegions}</div>
              <p className="text-xs opacity-75">{billingMetrics.currencies} currencies supported</p>
              <div className="mt-2 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+3 new regions</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Retry Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aiRetryMetrics.successRate}%</div>
              <p className="text-xs opacity-75">{retryQueue} in queue</p>
              <div className="mt-2 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+5.2% improvement</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="billing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="billing">Hybrid Billing</TabsTrigger>
            <TabsTrigger value="nft">NFT Access Passes</TabsTrigger>
            <TabsTrigger value="regional">Regional Pricing</TabsTrigger>
            <TabsTrigger value="ai-retry">AI Retry Logic</TabsTrigger>
            <TabsTrigger value="caching">Off-chain Caching</TabsTrigger>
          </TabsList>

          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    Payment Method Distribution
                  </CardTitle>
                  <CardDescription>Fiat & crypto payment volume breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={billingMetrics.paymentMethods}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="volume"
                      >
                        {(billingMetrics.paymentMethods || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrency(value), "Volume"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <PaymentProcessor
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={(error) => console.error("Payment error:", error)}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends by Payment Type</CardTitle>
                <CardDescription>Monthly revenue breakdown across payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value), ""]} />
                    <Area
                      type="monotone"
                      dataKey="fiat"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="crypto"
                      stackId="1"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.8}
                    />
                    <Area type="monotone" dataKey="nft" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nft" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(nftPasses || []).map((nft: any) => (
                <Card key={nft.id} className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <ImageIcon className="h-5 w-5 text-purple-500" />
                          {nft.name}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {nft.tier} Tier
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {nft.price} {nft.currency}
                        </div>
                        <div className="text-sm text-gray-600">
                          Floor: {nft.floorPrice} {nft.currency}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Active Holders</span>
                        <span className="font-bold">{nft.holders}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Minted Today</span>
                        <Badge className="bg-green-100 text-green-800">+{nft.mintedToday}</Badge>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Access Benefits:</h4>
                        <ul className="space-y-1">
                          {(nft.benefits || []).map((benefit: string, index: number) => (
                            <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <NFTMintDialog nftPass={nft} onMintSuccess={handleMintSuccess} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>NFT Subscription Analytics</CardTitle>
                <CardDescription>Performance metrics for NFT-based access passes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{nftData?.analytics?.totalHolders || 890}</div>
                    <div className="text-sm text-gray-600">Total Holders</div>
                    <div className="text-xs text-green-600 mt-1">+12.5% this month</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {nftData?.analytics?.totalVolume || 47.2} ETH
                    </div>
                    <div className="text-sm text-gray-600">Total Volume</div>
                    <div className="text-xs text-green-600 mt-1">+18.3% this month</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {nftData?.analytics?.retentionRate || 94.7}%
                    </div>
                    <div className="text-sm text-gray-600">Retention Rate</div>
                    <div className="text-xs text-green-600 mt-1">+2.1% improvement</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">
                      ${((nftData?.analytics?.lifetimeValue || 2400000) / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-600">Lifetime Value</div>
                    <div className="text-xs text-green-600 mt-1">+34.2% vs traditional</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-500" />
                    Regional Pricing Strategy
                  </CardTitle>
                  <CardDescription>Localized pricing across global markets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(regionalPricing || []).map((region, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Globe className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{region.region}</div>
                            <div className="text-sm text-gray-600">{region.currency}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {region.currency === "EUR" ? "€" : "$"}
                            {region.basePrice}
                          </div>
                          <div className="text-sm text-gray-600">{region.volume}% of volume</div>
                          <Badge
                            variant="secondary"
                            className={
                              region.adjustment < 1 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                            }
                          >
                            {region.adjustment < 1 ? `-${((1 - region.adjustment) * 100).toFixed(0)}%` : "Standard"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Multi-Currency Performance</CardTitle>
                  <CardDescription>Revenue distribution by currency</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={regionalPricing}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, "Volume Share"]} />
                      <Bar dataKey="volume" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Currency Exchange & Hedging</CardTitle>
                <CardDescription>Real-time currency management and risk mitigation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <div className="text-sm text-gray-600">Supported Currencies</div>
                    <div className="text-xs text-green-600 mt-1">+3 added this quarter</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0.12%</div>
                    <div className="text-sm text-gray-600">FX Risk Exposure</div>
                    <div className="text-xs text-green-600 mt-1">-0.08% vs target</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">$2.1M</div>
                    <div className="text-sm text-gray-600">Hedged Volume</div>
                    <div className="text-xs text-green-600 mt-1">87% of exposure</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-retry" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    AI-Driven Retry Intelligence
                  </CardTitle>
                  <CardDescription>Machine learning optimized payment recovery</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className="text-2xl font-bold text-green-600">{aiRetryMetrics.successRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Avg Retry Time</span>
                      <span className="text-lg font-bold text-blue-600">{aiRetryMetrics.avgRetryTime}s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Intelligent Routing</span>
                      <span className="text-lg font-bold text-purple-600">{aiRetryMetrics.intelligentRouting}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Retries</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-orange-600">{retryQueue}</span>
                        <RefreshCw className="h-4 w-4 text-orange-500 animate-spin" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Failure Pattern Analysis</CardTitle>
                  <CardDescription>AI-identified patterns and recovery strategies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(aiRetryMetrics.patterns || []).map((pattern, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{pattern.reason}</div>
                            <div className="text-xs text-gray-600">{pattern.count} occurrences</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{pattern.successRate}%</div>
                          <div className="text-xs text-gray-600">recovery rate</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="caching" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-blue-500" />
                    Off-chain Caching Performance
                  </CardTitle>
                  <CardDescription>Optimized for low-bandwidth and offline scenarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cache Hit Rate</span>
                      <span className="text-2xl font-bold text-green-600">{cacheMetrics.hitRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Bandwidth Saved</span>
                      <span className="text-lg font-bold text-blue-600">{cacheMetrics.bandwidthSaved}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cached Data</span>
                      <span className="text-lg font-bold text-purple-600">{cacheMetrics.cachedData} GB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Offline Capable</span>
                      <span className="text-lg font-bold text-orange-600">{cacheMetrics.offlineCapable}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Low-Bandwidth Optimization</CardTitle>
                  <CardDescription>Performance across different connection types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(cacheMetrics.regions || []).map((region, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Smartphone className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{region.name}</div>
                            <div className="text-xs text-gray-600">{formatNumber(region.users)} users</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{region.cacheHit}%</div>
                          <div className="text-xs text-gray-600">cache hit</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  )
}
