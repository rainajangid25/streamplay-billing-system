"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Copy, ExternalLink, AlertTriangle, Database, Blocks, Wallet } from "lucide-react"
import { useState } from "react"

export function IntegrationSetupGuide() {
  const [copiedText, setCopiedText] = useState<string>("")

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(""), 2000)
  }

  const setupSteps = [
    {
      id: "supabase",
      title: "Supabase Database + Auth",
      icon: Database,
      priority: "CRITICAL",
      estimatedTime: "10 minutes",
      steps: [
        {
          title: "Create Supabase Account",
          description: "Sign up for free at supabase.com",
          action: "https://supabase.com/dashboard/sign-up",
          code: null,
        },
        {
          title: "Create New Project",
          description: "Click 'New Project' and choose a name like 'gobill-ai-mvp'",
          action: null,
          code: null,
        },
        {
          title: "Get API Keys",
          description: "Go to Settings > API and copy these values:",
          action: null,
          code: `NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`,
        },
        {
          title: "Enable Authentication",
          description: "Go to Authentication > Settings and enable Email auth",
          action: null,
          code: null,
        },
        {
          title: "Set up Database Schema",
          description: "Run this SQL in the SQL Editor:",
          action: null,
          code: `-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_status TEXT DEFAULT 'inactive',
  wallet_address TEXT,
  total_spent DECIMAL(10,2) DEFAULT 0
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  plan_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_billing_date TIMESTAMP WITH TIME ZONE
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  blockchain_tx_hash TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;`,
        },
      ],
    },
    {
      id: "alchemy",
      title: "Alchemy Blockchain API",
      icon: Blocks,
      priority: "CRITICAL",
      estimatedTime: "5 minutes",
      steps: [
        {
          title: "Create Alchemy Account",
          description: "Sign up for free at dashboard.alchemy.com",
          action: "https://dashboard.alchemy.com/signup",
          code: null,
        },
        {
          title: "Create New App",
          description: "Click 'Create App' and select:",
          action: null,
          code: `Name: GoBill AI MVP
Chain: Ethereum
Network: Mainnet (for production) or Sepolia (for testing)`,
        },
        {
          title: "Get API Key",
          description: "Copy your API key from the dashboard:",
          action: null,
          code: `NEXT_PUBLIC_ALCHEMY_API_KEY=your-api-key-here
NEXT_PUBLIC_ALCHEMY_ID=your-app-id-here`,
        },
        {
          title: "Add Polygon Support",
          description: "Create another app for Polygon network:",
          action: null,
          code: `Name: GoBill AI Polygon
Chain: Polygon
Network: Mainnet`,
        },
        {
          title: "Enable Webhooks",
          description: "Go to Webhooks and add your domain for payment notifications",
          action: null,
          code: `Webhook URL: https://your-domain.com/api/webhooks/alchemy
Events: Address Activity, Mined Transactions`,
        },
      ],
    },
    {
      id: "walletconnect",
      title: "WalletConnect Web3 Wallets",
      icon: Wallet,
      priority: "HIGH",
      estimatedTime: "3 minutes",
      steps: [
        {
          title: "Create WalletConnect Account",
          description: "Sign up at cloud.walletconnect.com",
          action: "https://cloud.walletconnect.com/sign-up",
          code: null,
        },
        {
          title: "Create New Project",
          description: "Click 'Create' and fill in your project details:",
          action: null,
          code: `Project Name: GoBill AI
Project URL: https://your-domain.com
Project Description: Next-gen OTT billing platform`,
        },
        {
          title: "Get Project ID",
          description: "Copy your Project ID from the dashboard:",
          action: null,
          code: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here`,
        },
        {
          title: "Configure Domains",
          description: "Add your domains in the settings:",
          action: null,
          code: `Allowed Domains:
- localhost:3000 (for development)
- your-domain.com (for production)`,
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Step-by-Step Setup Guide</h2>
        <p className="text-lg text-muted-foreground">
          Follow these steps to get your integrations running in 30 minutes
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800">⏱️ Total setup time: ~20 minutes | 💰 Total cost: $0/month</p>
        </div>
      </div>

      <Tabs defaultValue="supabase" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {setupSteps.map((step) => {
            const IconComponent = step.icon
            return (
              <TabsTrigger key={step.id} value={step.id} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                {step.title.split(" ")[0]}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {setupSteps.map((setup) => {
          const IconComponent = setup.icon
          return (
            <TabsContent key={setup.id} value={setup.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>{setup.title}</CardTitle>
                        <CardDescription>
                          {setup.estimatedTime} • {setup.priority} priority
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={setup.priority === "CRITICAL" ? "destructive" : "secondary"}>
                      {setup.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {setup.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">{stepIndex + 1}</span>
                            </div>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div>
                              <h4 className="font-semibold">{step.title}</h4>
                              <p className="text-muted-foreground text-sm">{step.description}</p>
                            </div>

                            {step.action && (
                              <Button asChild variant="outline" size="sm">
                                <a href={step.action} target="_blank" rel="noopener noreferrer">
                                  Open {step.title} <ExternalLink className="h-4 w-4 ml-2" />
                                </a>
                              </Button>
                            )}

                            {step.code && (
                              <div className="bg-gray-900 rounded-lg p-4 relative">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                                  onClick={() => copyToClipboard(step.code!, `${setup.title} Step ${stepIndex + 1}`)}
                                >
                                  {copiedText === `${setup.title} Step ${stepIndex + 1}` ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                                <pre className="text-sm text-gray-300 overflow-x-auto">
                                  <code>{step.code}</code>
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-900">
            <AlertTriangle className="h-5 w-5" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-yellow-800">
          <div className="space-y-2">
            <h4 className="font-semibold">Environment Variables:</h4>
            <p className="text-sm">
              Create a <code className="bg-yellow-100 px-2 py-1 rounded">.env.local</code> file in your project root and
              add all the API keys from above.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Security:</h4>
            <p className="text-sm">
              Never commit your <code className="bg-yellow-100 px-2 py-1 rounded">.env.local</code> file to Git. Add it
              to your <code className="bg-yellow-100 px-2 py-1 rounded">.gitignore</code> file.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Testing:</h4>
            <p className="text-sm">
              Use test networks (Sepolia for Ethereum) during development to avoid real transaction costs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
