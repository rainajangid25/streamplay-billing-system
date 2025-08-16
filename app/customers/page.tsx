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
  Users,
  TrendingUp,
  AlertTriangle,
  Wallet,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Globe,
  Building,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  country?: string
  subscription_status: string
  wallet_address?: string
  total_spent: number
  churn_risk_level: string
  created_at: string
  company_name?: string
  industry?: string
  account_type: string
  language: string
  timezone: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error("Error fetching customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.company_name && customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()))

    if (selectedTab === "all") return matchesSearch
    if (selectedTab === "active") return matchesSearch && customer.subscription_status === "active"
    if (selectedTab === "inactive") return matchesSearch && customer.subscription_status === "inactive"
    if (selectedTab === "cancelled") return matchesSearch && customer.subscription_status === "cancelled"
    if (selectedTab === "high-risk") return matchesSearch && customer.churn_risk_level === "high"

    return matchesSearch
  })

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.subscription_status === "active").length,
    inactive: customers.filter((c) => c.subscription_status === "inactive").length,
    cancelled: customers.filter((c) => c.subscription_status === "cancelled").length,
    expired: customers.filter((c) => c.subscription_status === "expired").length,
    highRisk: customers.filter((c) => c.churn_risk_level === "high").length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.total_spent || 0), 0),
    withWallets: customers.filter((c) => c.wallet_address).length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "expired":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "enterprise":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "business":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "individual":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage your OTT platform customers and subscriptions</p>
        </div>
        <div className="flex gap-2">
          <Link href="/seed-data">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Test Data
            </Button>
          </Link>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-red-600">{stats.highRisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Web3</p>
                <p className="text-2xl font-bold text-orange-600">{stats.withWallets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-indigo-600" />
              <div>
                <p className="text-sm text-muted-foreground">Enterprise</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {customers.filter((c) => c.account_type === "enterprise").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Customer Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({stats.inactive})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({stats.cancelled})</TabsTrigger>
          <TabsTrigger value="high-risk">High Risk ({stats.highRisk})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredCustomers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No customers found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Start by adding your first customer or use test data"}
                </p>
                {!searchTerm && (
                  <Link href="/seed-data">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Test Data
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold">{customer.name}</h3>
                          <Badge className={getStatusColor(customer.subscription_status)}>
                            {customer.subscription_status}
                          </Badge>
                          <Badge className={getRiskColor(customer.churn_risk_level)}>
                            {customer.churn_risk_level} risk
                          </Badge>
                          <Badge className={getAccountTypeColor(customer.account_type)}>{customer.account_type}</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{customer.email}</span>
                          </div>

                          {customer.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {customer.phone}
                            </div>
                          )}

                          {customer.company_name && (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              <span className="truncate">{customer.company_name}</span>
                            </div>
                          )}

                          {customer.country && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              {customer.country}
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Joined {new Date(customer.created_at).toLocaleDateString()}
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            {formatCurrency(customer.total_spent)} spent
                          </div>

                          {customer.wallet_address && (
                            <div className="flex items-center gap-2">
                              <Wallet className="h-4 w-4" />
                              <span className="font-mono text-xs">
                                {customer.wallet_address.slice(0, 6)}...{customer.wallet_address.slice(-4)}
                              </span>
                            </div>
                          )}

                          {customer.industry && (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {customer.industry}
                            </div>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
