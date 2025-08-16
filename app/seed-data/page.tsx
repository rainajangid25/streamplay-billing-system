"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Database,
  Users,
  CreditCard,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react"
import { seedCustomers, clearTestData } from "@/scripts/seed-customers"

export default function SeedDataPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [seedResult, setSeedResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeedData = async () => {
    setIsSeeding(true)
    setError(null)
    setSeedResult(null)

    try {
      const result = await seedCustomers()
      setSeedResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to seed data")
    } finally {
      setIsSeeding(false)
    }
  }

  const handleClearData = async () => {
    setIsClearing(true)
    setError(null)

    try {
      await clearTestData()
      setSeedResult(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear data")
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Database className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Database Seeding</h1>
          <p className="text-muted-foreground">Add test data to see your OTT billing platform in action</p>
        </div>
      </div>

      {/* Status Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {seedResult && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Successfully seeded {seedResult.customers} customers, {seedResult.subscriptions} subscriptions, and{" "}
            {seedResult.transactions} transactions!
          </AlertDescription>
        </Alert>
      )}

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              Seed Test Data
            </CardTitle>
            <CardDescription>Add realistic customer data to test all platform features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm">10 diverse customers from different countries</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600" />
                <span className="text-sm">5 active subscriptions with different plans</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-600" />
                <span className="text-sm">5 transactions (crypto & fiat payments)</span>
              </div>
            </div>

            <Separator />

            <Button onClick={handleSeedData} disabled={isSeeding} className="w-full">
              {isSeeding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Seeding Data...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Seed Test Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Clear Test Data
            </CardTitle>
            <CardDescription>Remove all test data to start fresh</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This will permanently delete all customers, subscriptions, and transactions from your database.
              </AlertDescription>
            </Alert>

            <Button onClick={handleClearData} disabled={isClearing} variant="destructive" className="w-full">
              {isClearing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Clearing Data...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* What You'll Get */}
      <Card>
        <CardHeader>
          <CardTitle>Test Data Overview</CardTitle>
          <CardDescription>Here's what will be added to your database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Customers
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active customers:</span>
                  <Badge variant="secondary">6</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Inactive/Cancelled:</span>
                  <Badge variant="secondary">4</Badge>
                </div>
                <div className="flex justify-between">
                  <span>With crypto wallets:</span>
                  <Badge variant="secondary">7</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Countries represented:</span>
                  <Badge variant="secondary">9</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600" />
                Subscriptions
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Basic plans:</span>
                  <Badge variant="secondary">1</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Premium plans:</span>
                  <Badge variant="secondary">2</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Enterprise plans:</span>
                  <Badge variant="secondary">2</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Multiple currencies:</span>
                  <Badge variant="secondary">USD, EUR, GBP</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-600" />
                Transactions
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Crypto payments:</span>
                  <Badge variant="secondary">4</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Fiat payments:</span>
                  <Badge variant="secondary">1</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <Badge variant="secondary">4</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <Badge variant="secondary">1</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>After Seeding Data</CardTitle>
          <CardDescription>Explore these features with your test data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Customer Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View customer profiles and subscription status</li>
                <li>• Filter by active, inactive, and high-risk customers</li>
                <li>• See churn risk analysis and wallet addresses</li>
                <li>• Track customer lifetime value and spending</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Billing & Payments</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Monitor crypto and fiat transactions</li>
                <li>• View blockchain transaction hashes</li>
                <li>• Track subscription billing cycles</li>
                <li>• Analyze payment method preferences</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
