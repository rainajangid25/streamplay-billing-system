"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ExternalLink, AlertCircle, DollarSign } from "lucide-react"
import { integrations } from "@/lib/integrations"

export function IntegrationSetup() {
  const requiredIntegrations = Object.entries(integrations).filter(([_, config]) => config.required)
  const optionalIntegrations = Object.entries(integrations).filter(([_, config]) => !config.required)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Integration Setup</h2>
        <p className="text-gray-600">Set up these integrations to get your MVP running</p>
      </div>

      {/* Required Integrations */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Required for MVP (All FREE)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requiredIntegrations.map(([key, config]) => (
            <Card key={key} className="border-red-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{config.name}</CardTitle>
                  <Badge className="bg-green-100 text-green-800">{config.cost}</Badge>
                </div>
                <CardDescription>{config.limit}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href={config.setup} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Set Up {config.name}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Optional Integrations */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-500" />
          Optional Enhancements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {optionalIntegrations.map(([key, config]) => (
            <Card key={key} className="border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{config.name}</CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {config.cost.includes("FREE") ? "FREE TIER" : "PAID"}
                  </Badge>
                </div>
                <CardDescription>{config.limit}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <a href={config.setup} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Set Up {config.name}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Setup Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Quick Setup Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-900">1. Database (Supabase - FREE)</h4>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>
                • Go to{" "}
                <a href="https://supabase.com" className="underline">
                  supabase.com
                </a>
              </li>
              <li>• Create new project</li>
              <li>• Copy URL and anon key to .env</li>
              <li>• Run database migrations</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-blue-900">2. Blockchain (Alchemy - FREE)</h4>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>
                • Go to{" "}
                <a href="https://dashboard.alchemy.com" className="underline">
                  dashboard.alchemy.com
                </a>
              </li>
              <li>• Create new app</li>
              <li>• Select Ethereum Mainnet & Polygon</li>
              <li>• Copy API key to .env</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-blue-900">3. Wallet Connect (FREE)</h4>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>
                • Go to{" "}
                <a href="https://cloud.walletconnect.com" className="underline">
                  cloud.walletconnect.com
                </a>
              </li>
              <li>• Create new project</li>
              <li>• Copy Project ID to .env</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
