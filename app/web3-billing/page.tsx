"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Coins, Shield, Zap, TrendingUp, Wallet, Lock, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function Web3BillingPage() {
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum")
  const [isProcessing, setIsProcessing] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)

  const [cryptoMetrics] = useState({
    totalVolume: 2450000,
    transactionCount: 15420,
    averageGasFee: 0.0023,
    successRate: 99.2,
    networks: [
      { name: "Ethereum", volume: 1200000, transactions: 8500, color: "#627EEA" },
      { name: "Bitcoin", volume: 800000, transactions: 3200, color: "#F7931A" },
      { name: "Polygon", volume: 300000, transactions: 2800, color: "#8247E5" },
      { name: "USDC", volume: 150000, transactions: 920, color: "#2775CA" },
    ],
  })

  const [nftSubscriptions] = useState([
    {
      id: 1,
      name: "Premium Access NFT",
      price: 0.1,
      currency: "ETH",
      holders: 234,
      benefits: ["Unlimited API calls", "Priority support", "Advanced analytics"],
    },
    {
      id: 2,
      name: "Enterprise Tier NFT",
      price: 0.5,
      currency: "ETH",
      holders: 89,
      benefits: ["White-label solution", "Custom integrations", "Dedicated manager"],
    },
    {
      id: 3,
      name: "Developer Pass NFT",
      price: 0.05,
      currency: "ETH",
      holders: 567,
      benefits: ["SDK access", "Beta features", "Community access"],
    },
  ])

  const [defiOpportunities] = useState([
    { protocol: "Aave", apy: 4.2, tvl: 12500000, risk: "Low", token: "USDC" },
    { protocol: "Compound", apy: 3.8, tvl: 8900000, risk: "Low", token: "DAI" },
    { protocol: "Uniswap V3", apy: 12.5, tvl: 2300000, risk: "Medium", token: "ETH/USDC" },
    { protocol: "Curve", apy: 6.7, tvl: 5600000, risk: "Low", token: "3Pool" },
  ])

  const [smartContracts] = useState([
    { name: "Subscription Manager", address: "0x1234...5678", status: "Active", gasUsed: 2.3, interactions: 15420 },
    { name: "Payment Processor", address: "0xabcd...efgh", status: "Active", gasUsed: 1.8, interactions: 8900 },
    { name: "NFT Minter", address: "0x9876...5432", status: "Active", gasUsed: 0.9, interactions: 3400 },
    { name: "Yield Optimizer", address: "0xfedc...ba98", status: "Pending", gasUsed: 0.0, interactions: 0 },
  ])

  const [transactionHistory] = useState([
    {
      hash: "0x1a2b3c...",
      amount: 150.0,
      currency: "USDC",
      status: "Confirmed",
      timestamp: "2024-01-15 14:30",
      network: "Ethereum",
    },
    {
      hash: "0x4d5e6f...",
      amount: 0.05,
      currency: "ETH",
      status: "Confirmed",
      timestamp: "2024-01-15 13:45",
      network: "Ethereum",
    },
    {
      hash: "0x7g8h9i...",
      amount: 75.5,
      currency: "USDC",
      status: "Pending",
      timestamp: "2024-01-15 13:20",
      network: "Polygon",
    },
    {
      hash: "0xjklmno...",
      amount: 0.001,
      currency: "BTC",
      status: "Confirmed",
      timestamp: "2024-01-15 12:15",
      network: "Bitcoin",
    },
  ])

  const connectWallet = async () => {
    setIsProcessing(true)
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setWalletConnected(true)
    setIsProcessing(false)
  }

  const processPayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsProcessing(false)
  }

  const COLORS = ["#627EEA", "#F7931A", "#8247E5", "#2775CA"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Confirmed":
      case "Deployed":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Failed":
      case "Inactive":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Coins className="h-8 w-8 text-purple-600" />
              Web3 Billing & Payments
            </h1>
            <p className="text-gray-600">Blockchain-powered billing with DeFi integration</p>
          </div>
          <div className="flex gap-3">
            {!walletConnected ? (
              <Button onClick={connectWallet} disabled={isProcessing} className="bg-purple-600 hover:bg-purple-700">
                {isProcessing ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
            ) : (
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2">
                <Wallet className="h-4 w-4 mr-2" />
                Wallet Connected
              </Badge>
            )}
          </div>
        </div>

        {/* Crypto Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${cryptoMetrics.totalVolume.toLocaleString()}</div>
              <p className="text-xs opacity-75">Across all networks</p>
              <div className="mt-2 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+12.5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cryptoMetrics.transactionCount.toLocaleString()}</div>
              <p className="text-xs opacity-75">This month</p>
              <div className="mt-2 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+8.3% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cryptoMetrics.successRate}%</div>
              <p className="text-xs opacity-75">Transaction success</p>
              <div className="mt-2 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+0.3% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Avg Gas Fee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cryptoMetrics.averageGasFee} ETH</div>
              <p className="text-xs opacity-75">Average gas cost</p>
              <div className="mt-2 flex items-center">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-sm">-15.2% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="payments">Crypto Payments</TabsTrigger>
            <TabsTrigger value="nft">NFT Subscriptions</TabsTrigger>
            <TabsTrigger value="defi">DeFi Integration</TabsTrigger>
            <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
            <TabsTrigger value="analytics">Blockchain Analytics</TabsTrigger>
            <TabsTrigger value="security">Security & Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-purple-500" />
                    Payment Networks
                  </CardTitle>
                  <CardDescription>Transaction volume by blockchain network</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={cryptoMetrics.networks}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, volume }) => `${name}: $${(volume / 1000).toFixed(0)}K`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="volume"
                      >
                        {cryptoMetrics.networks.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Volume"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Process Crypto Payment</CardTitle>
                  <CardDescription>Accept payments in multiple cryptocurrencies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input id="amount" placeholder="0.00" type="number" />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                          <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                          <SelectItem value="matic">Polygon (MATIC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input id="recipient" placeholder="0x..." />
                  </div>
                  <Button onClick={processPayment} disabled={isProcessing || !walletConnected} className="w-full">
                    {isProcessing ? (
                      <>
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Process Payment
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest blockchain transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionHistory.map((tx, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Coins className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {tx.amount} {tx.currency}
                          </div>
                          <div className="text-sm text-gray-600">{tx.hash}</div>
                          <div className="text-xs text-gray-500">{tx.timestamp}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={tx.status === "Confirmed" ? "default" : "secondary"}
                          className={
                            tx.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {tx.status}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">{tx.network}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nft" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nftSubscriptions.map((nft) => (
                <Card key={nft.id} className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{nft.name}</span>
                      <Badge variant="secondary">{nft.holders} holders</Badge>
                    </CardTitle>
                    <CardDescription>
                      <span className="text-2xl font-bold text-purple-600">
                        {nft.price} {nft.currency}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Benefits:</h4>
                      <ul className="space-y-1">
                        {nft.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                        <Lock className="h-4 w-4 mr-2" />
                        Mint NFT Subscription
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>NFT Subscription Analytics</CardTitle>
                <CardDescription>Performance metrics for NFT-based subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">890</div>
                    <div className="text-sm text-gray-600">Total NFT Holders</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">12.5 ETH</div>
                    <div className="text-sm text-gray-600">Total Volume</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-gray-600">Retention Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="defi" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  DeFi Yield Opportunities
                </CardTitle>
                <CardDescription>Optimize idle crypto assets with yield farming</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {defiOpportunities.map((opportunity, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {opportunity.protocol[0]}
                        </div>
                        <div>
                          <div className="font-semibold">{opportunity.protocol}</div>
                          <div className="text-sm text-gray-600">{opportunity.token}</div>
                          <Badge
                            variant="secondary"
                            className={
                              opportunity.risk === "Low"
                                ? "bg-green-100 text-green-800"
                                : opportunity.risk === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {opportunity.risk} Risk
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{opportunity.apy}%</div>
                        <div className="text-sm text-gray-600">APY</div>
                        <div className="text-xs text-gray-500">TVL: ${(opportunity.tvl / 1000000).toFixed(1)}M</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Allocation</CardTitle>
                  <CardDescription>Current DeFi investment distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Lending Protocols</span>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-24 h-2" />
                        <span className="text-sm text-gray-600">45%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Liquidity Pools</span>
                      <div className="flex items-center gap-2">
                        <Progress value={30} className="w-24 h-2" />
                        <span className="text-sm text-gray-600">30%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Yield Farming</span>
                      <div className="flex items-center gap-2">
                        <Progress value={25} className="w-24 h-2" />
                        <span className="text-sm text-gray-600">25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Yield Performance</CardTitle>
                  <CardDescription>Historical yield performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-600">8.4%</div>
                    <div className="text-sm text-gray-600">Average APY</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This Month</span>
                      <span className="text-green-600">+$2,340</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Month</span>
                      <span className="text-green-600">+$2,180</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Earned</span>
                      <span className="text-green-600 font-semibold">+$28,450</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Smart Contract Management
                </CardTitle>
                <CardDescription>Deploy and manage automated billing contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {smartContracts.map((contract, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{contract.name}</div>
                          <div className="text-sm text-gray-600">{contract.address}</div>
                          <div className="text-xs text-gray-500">
                            {contract.interactions.toLocaleString()} interactions
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={contract.status === "Active" ? "default" : "secondary"}
                          className={
                            contract.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {contract.status}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">{contract.gasUsed} ETH gas used</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Deploy New Contract
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Volume Trends</CardTitle>
                  <CardDescription>Monthly crypto payment volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={[
                        { month: "Jan", volume: 180000 },
                        { month: "Feb", volume: 220000 },
                        { month: "Mar", volume: 280000 },
                        { month: "Apr", volume: 320000 },
                        { month: "May", volume: 380000 },
                        { month: "Jun", volume: 450000 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Volume"]} />
                      <Area type="monotone" dataKey="volume" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Network Performance</CardTitle>
                  <CardDescription>Transaction success rates by network</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cryptoMetrics.networks}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="transactions" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    Security Status
                  </CardTitle>
                  <CardDescription>Blockchain security and compliance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Multi-sig Wallets</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Smart Contract Audits</span>
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">KYC/AML Compliance</span>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Insurance Coverage</span>
                      <Badge className="bg-blue-100 text-blue-800">$5M Coverage</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Dashboard</CardTitle>
                  <CardDescription>Regulatory compliance tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">AML Screening</span>
                        <span className="text-sm text-green-600">100% Compliant</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Transaction Monitoring</span>
                        <span className="text-sm text-green-600">99.8% Coverage</span>
                      </div>
                      <Progress value={99.8} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Regulatory Reporting</span>
                        <span className="text-sm text-blue-600">Up to Date</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
