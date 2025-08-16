"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, ExternalLink, Database, Blocks, Shield, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export function IntegrationRecommendations() {
  const recommendations = [
    {
      category: "Database",
      icon: Database,
      recommended: "Supabase",
      reason: "Perfect for OTT billing with real-time features",
      features: [
        "Real-time subscriptions (perfect for live billing updates)",
        "Built-in authentication (customer login/signup)",
        "Row Level Security (multi-tenant billing data)",
        "PostgreSQL (complex billing queries & analytics)",
        "Auto-generated APIs (rapid development)",
        "Edge functions (serverless billing logic)",
        "Storage for invoices & documents",
      ],
      alternative: "Neon",
      whyNotAlternative: "No real-time features, no built-in auth, no storage",
      setupUrl: "https://supabase.com/dashboard/new",
      priority: "CRITICAL",
      freeLimit: "500MB storage, 2 CPU hours, 50MB file storage",
      upgradeAt: "When you exceed storage or need more performance",
    },
    {
      category: "Blockchain",
      icon: Blocks,
      recommended: "Alchemy",
      reason: "Best infrastructure for production OTT platform",
      features: [
        "Supports Ethereum + Polygon (multi-chain billing)",
        "Enhanced NFT APIs (perfect for NFT subscriptions)",
        "Reliable infrastructure (99.9% uptime SLA)",
        "Advanced analytics (transaction monitoring)",
        "Webhook support (real-time payment notifications)",
        "Mempool monitoring (transaction status)",
        "Archive data access (historical billing)",
      ],
      alternative: "Infura",
      whyNotAlternative: "Basic features, less reliable, no enhanced NFT APIs",
      setupUrl: "https://dashboard.alchemy.com/",
      priority: "CRITICAL",
      freeLimit: "300M compute units/month (very generous)",
      upgradeAt: "When you exceed 300M API calls (high-scale usage)",
    },
    {
      category: "Authentication",
      icon: Shield,
      recommended: "Supabase Auth",
      reason: "Integrated with database, zero extra setup",
      features: [
        "Social logins (Google, Apple, GitHub, Discord)",
        "Magic links (passwordless login for customers)",
        "JWT tokens (secure API access)",
        "User metadata (billing preferences & settings)",
        "Built into Supabase (no extra integration)",
        "Row Level Security (data isolation)",
        "Multi-factor authentication (enterprise security)",
      ],
      alternative: "NextAuth.js",
      whyNotAlternative: "Requires separate setup, more complex configuration",
      setupUrl: "Included with Supabase setup",
      priority: "HIGH",
      freeLimit: "50,000 monthly active users",
      upgradeAt: "When you exceed 50K active users",
    },
    {
      category: "Web3 Wallet",
      icon: Wallet,
      recommended: "WalletConnect",
      reason: "Industry standard for Web3 connections",
      features: [
        "Supports 300+ wallets (MetaMask, Trust, Coinbase, etc.)",
        "Mobile wallet support (QR code connections)",
        "Secure WalletConnect protocol v2",
        "Cross-platform compatibility",
        "Free for open source projects",
        "Real-time connection status",
        "Multi-chain wallet switching",
      ],
      alternative: "MetaMask only",
      whyNotAlternative: "Limited to one wallet, excludes mobile users",
      setupUrl: "https://cloud.walletconnect.com/",
      priority: "HIGH",
      freeLimit: "Unlimited connections for open source",
      upgradeAt: "Only if you need premium support",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Recommended Free Integrations</h2>
        <p className="text-lg text-muted-foreground">Optimized for your OTT billing & Web3 monetization platform</p>
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-800 font-semibold">💰 Total Monthly Cost: $0 (All free tiers cover MVP needs)</p>
        </div>
      </div>

      {recommendations.map((rec, index) => {
        const IconComponent = rec.icon
        return (
          <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {rec.category}: {rec.recommended}
                    </CardTitle>
                    <CardDescription className="text-base font-medium text-blue-600">{rec.reason}</CardDescription>
                  </div>
                </div>
                <Badge variant={rec.priority === "CRITICAL" ? "destructive" : "secondary"}>{rec.priority}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Why perfect for OTT billing:
                  </h4>
                  <ul className="space-y-1">
                    {rec.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-blue-900 text-sm mb-1">Free Tier Limits:</h5>
                    <p className="text-blue-800 text-sm">{rec.freeLimit}</p>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-yellow-900 text-sm mb-1">Upgrade When:</h5>
                    <p className="text-yellow-800 text-sm">{rec.upgradeAt}</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div className="text-sm">
                    <strong className="text-red-900">Alternative: {rec.alternative}</strong>
                    <p className="text-red-700 mt-1">{rec.whyNotAlternative}</p>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <a href={rec.setupUrl} target="_blank" rel="noopener noreferrer">
                  Set up {rec.recommended} <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        )
      })}

      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">🚀 Setup Priority Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Badge className="bg-red-100 text-red-800">1</Badge>
              <div>
                <strong>Supabase first</strong> - Everything depends on your database
                <p className="text-sm text-muted-foreground">Set up database, auth, and storage</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Badge className="bg-orange-100 text-orange-800">2</Badge>
              <div>
                <strong>Alchemy second</strong> - Powers your Web3 billing features
                <p className="text-sm text-muted-foreground">Enable blockchain payments and NFT subscriptions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Badge className="bg-blue-100 text-blue-800">3</Badge>
              <div>
                <strong>WalletConnect third</strong> - Enables customer wallet connections
                <p className="text-sm text-muted-foreground">Allow customers to connect their crypto wallets</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
