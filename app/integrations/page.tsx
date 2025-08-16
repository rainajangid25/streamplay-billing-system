import { IntegrationRecommendations } from "@/components/integration-recommendations"
import { IntegrationSetupGuide } from "@/components/integration-setup-guide"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, DollarSign } from "lucide-react"

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Integration Setup Guide
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Get your OTT billing platform running with these free integrations
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">$0</div>
                <div className="text-sm text-green-700">Monthly Cost</div>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">20 min</div>
                <div className="text-sm text-blue-700">Setup Time</div>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900">MVP Ready</div>
                <div className="text-sm text-purple-700">Production Ready</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="setup-guide" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Setup Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations">
            <IntegrationRecommendations />
          </TabsContent>

          <TabsContent value="setup-guide">
            <IntegrationSetupGuide />
          </TabsContent>
        </Tabs>

        {/* Footer CTA */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Launch Your MVP? 🚀</CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              With these free integrations, you'll have a production-ready OTT billing platform
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">✅</div>
                <div className="text-sm">Database & Auth</div>
              </div>
              <div>
                <div className="text-3xl font-bold">⛓️</div>
                <div className="text-sm">Blockchain Payments</div>
              </div>
              <div>
                <div className="text-3xl font-bold">💳</div>
                <div className="text-sm">NFT Subscriptions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
