"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useBillingStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Brain,
  Target,
  Shield,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  CreditCard,
  Wallet,
  Globe,
  Filter,
} from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  plan: string
  status: string
  totalRevenue: number
  subscriptions: Array<{
    id: string
    plan: string
    status: string
    nextBilling: string
    amount: number
  }>
  paymentMethods: string[]
  churnRisk: string
  lifetimeValue: number
  joinDate: string
  lastActivity: string
  country?: string
  phone?: string
}

interface FormData {
  name: string
  email: string
  plan: string
  country: string
  phone: string
  paymentMethods: string[]
}

const STORAGE_KEY = "billing-system-customers"

export default function SubscriberManagementPage() {
  const { toast } = useToast()
  const { 
    customers, 
    updateCustomer, 
    addCustomer, 
    removeCustomer,
    subscriptions,
    isLoading,
    lastUpdated
  } = useBillingStore()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false)
  const [isAddSubscriberOpen, setIsAddSubscriberOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Convert customers from store to local format with subscription data
  const enhancedCustomers = customers.map(customer => {
    const customerSubscriptions = subscriptions.filter(sub => sub.user_id === customer.id)
    return {
      ...customer,
      totalRevenue: customer.total_spent || 0,
      subscriptions: customerSubscriptions.map(sub => ({
        id: sub.id,
        plan: sub.plan_name || sub.plan_id,
        status: sub.status === 'active' ? 'Active' : sub.status === 'paused' ? 'Paused' : 'Cancelled',
        nextBilling: sub.end_date || '2024-12-31',
        amount: sub.amount
      })),
      paymentMethods: customer.payment_methods?.map(pm => pm.type) || ['Credit Card'],
      churnRisk: customer.churnRisk || 'Low',
      lifetimeValue: customer.total_spent * 1.5 || 0, // Estimate LTV
      joinDate: customer.created_at?.split('T')[0] || '2024-01-01',
      lastActivity: customer.last_login?.split('T')[0] || '2024-01-01',
      country: customer.billing_address?.country || 'Unknown',
      phone: customer.phone || ''
    }
  })

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    plan: "",
    country: "",
    phone: "",
    paymentMethods: [],
  })

  const [editFormData, setEditFormData] = useState<FormData>({
    name: "",
    email: "",
    plan: "",
    country: "",
    phone: "",
    paymentMethods: [],
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateForm = (data: FormData, isEdit = false) => {
    const errors: Record<string, string> = {}

    if (!data.name.trim()) {
      errors.name = "Name is required"
    }

    if (!data.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Please enter a valid email address"
    } else if (!isEdit && customers.some((c) => c.email.toLowerCase() === data.email.toLowerCase())) {
      errors.email = "Email already exists"
    } else if (
      isEdit &&
      selectedCustomer &&
      customers.some((c) => c.email.toLowerCase() === data.email.toLowerCase() && c.id !== selectedCustomer.id)
    ) {
      errors.email = "Email already exists"
    }

    if (!data.plan) {
      errors.plan = "Plan is required"
    }

    if (!data.country.trim()) {
      errors.country = "Country is required"
    }

    if (data.paymentMethods.length === 0) {
      errors.paymentMethods = "At least one payment method is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleEditInputChange = (field: keyof FormData, value: string | string[]) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handlePaymentMethodChange = (method: string, checked: boolean, isEdit = false) => {
    if (isEdit) {
      setEditFormData((prev) => ({
        ...prev,
        paymentMethods: checked ? [...prev.paymentMethods, method] : prev.paymentMethods.filter((m) => m !== method),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        paymentMethods: checked ? [...prev.paymentMethods, method] : prev.paymentMethods.filter((m) => m !== method),
      }))
    }
    if (formErrors.paymentMethods) {
      setFormErrors((prev) => ({ ...prev, paymentMethods: "" }))
    }
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsViewDialogOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setEditFormData({
      name: customer.name,
      email: customer.email,
      plan: customer.plan,
      country: customer.country || "",
      phone: customer.phone || "",
      paymentMethods: customer.paymentMethods,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedCustomer) {
      removeCustomer(selectedCustomer.id)
      toast({
        title: "Customer Deleted",
        description: `${selectedCustomer.name} has been removed from the system.`,
      })
      setIsDeleteDialogOpen(false)
      setSelectedCustomer(null)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm(editFormData, true) || !selectedCustomer) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      updateCustomer(selectedCustomer.id, {
        name: editFormData.name,
        email: editFormData.email,
        plan: editFormData.plan,
        billing_address: {
          ...selectedCustomer.billing_address,
          country: editFormData.country
        },
        phone: editFormData.phone,
        payment_methods: editFormData.paymentMethods.map(method => ({
          id: `pm_${Date.now()}_${Math.random()}`,
          type: method.toLowerCase() as any,
          is_default: false
        })),
        last_login: new Date().toISOString(),
      })

      setIsEditDialogOpen(false)
      setSelectedCustomer(null)

      toast({
        title: "Success!",
        description: `Customer "${editFormData.name}" has been updated successfully`,
      })
    } catch (error) {
      console.error("Error updating customer:", error)
      toast({
        title: "Error",
        description: "Failed to update customer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm(formData)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Plan pricing
      const planPrices = {
        Basic: 29.99,
        Premium: 99.99,
        Enterprise: 299.99,
        Custom: 0,
      }

      // Create new customer
      const newCustomer: Customer = {
        id: `cust_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        plan: formData.plan,
        status: "Active",
        totalRevenue: 0,
        subscriptions:
          formData.plan !== "Custom"
            ? [
                {
                  id: `sub_${Date.now()}`,
                  plan: formData.plan,
                  status: "Active",
                  nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                  amount: planPrices[formData.plan as keyof typeof planPrices] || 0,
                },
              ]
            : [],
        paymentMethods: formData.paymentMethods,
        churnRisk: "Low",
        lifetimeValue: 0,
        joinDate: new Date().toISOString().split("T")[0],
        lastActivity: new Date().toISOString().split("T")[0],
        country: formData.country,
        phone: formData.phone || "",
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add to customers list
      addCustomer(newCustomer as any)

      // Reset form
      setFormData({
        name: "",
        email: "",
        plan: "",
        country: "",
        phone: "",
        paymentMethods: [],
      })

      setIsAddSubscriberOpen(false)

      toast({
        title: "Success!",
        description: `Customer "${formData.name}" has been created successfully`,
      })
    } catch (error) {
      console.error("Error creating customer:", error)
      toast({
        title: "Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "At Risk":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Churned":
        return "bg-red-100 text-red-800 border-red-200"
      case "Suspended":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600"
      case "Medium":
        return "text-yellow-600"
      case "High":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  // Filter customers based on search term
  const filteredCustomers = enhancedCustomers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.plan?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate metrics
  const totalCustomers = enhancedCustomers.length
  const activeCustomers = enhancedCustomers.filter((c) => c.status === "active" || c.status === "Active").length
  const totalRevenue = enhancedCustomers.reduce((sum, c) => sum + (c.totalRevenue || 0), 0)
  const averageLifetimeValue = enhancedCustomers.reduce((sum, c) => sum + (c.lifetimeValue || 0), 0) / totalCustomers || 0

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Subscriber Management
              </h1>
              <p className="text-xl text-gray-600 mt-1">AI-powered customer lifecycle and retention optimization</p>
            </div>
          </div>

          {/* Real-time Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Customers</p>
                    <p className="text-3xl font-bold mt-2">{totalCustomers.toLocaleString()}</p>
                    <p className="text-blue-100 text-xs mt-1">+12% from last month</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active Subscribers</p>
                    <p className="text-3xl font-bold mt-2">{activeCustomers.toLocaleString()}</p>
                    <p className="text-green-100 text-xs mt-1">
                      {((activeCustomers / totalCustomers) * 100).toFixed(1)}% active rate
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold mt-2">{formatCurrency(totalRevenue, '₹')}</p>
                    <p className="text-purple-100 text-xs mt-1">Monthly recurring</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Avg Lifetime Value</p>
                    <p className="text-3xl font-bold mt-2">{formatCurrency(averageLifetimeValue, '₹')}</p>
                    <p className="text-orange-100 text-xs mt-1">Per customer</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-2">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 lg:grid-cols-11 bg-transparent gap-1">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-sm font-medium"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="customers"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-sm font-medium"
              >
                Customers
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-sm font-medium"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="retention"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-sm font-medium"
              >
                Retention
              </TabsTrigger>
              <TabsTrigger
                value="segments"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-sm font-medium"
              >
                Segments
              </TabsTrigger>
              <TabsTrigger
                value="campaigns"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-sm font-medium"
              >
                Campaigns
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-sm font-medium"
              >
                Payments
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-sm font-medium"
              >
                Support
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-sm font-medium"
              >
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="automation"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-sm font-medium"
              >
                Automation
              </TabsTrigger>
              <TabsTrigger
                value="ai-insights"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-sm font-medium"
              >
                AI Insights
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Advanced Search and Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center space-x-2">
                      <Search className="h-5 w-5 text-blue-600" />
                      <span>Customer Search & Management</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Advanced search with AI-powered filtering and customer insights
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Dialog open={isAdvancedSearchOpen} onOpenChange={setIsAdvancedSearchOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-blue-200 hover:bg-blue-50 bg-transparent">
                          <Filter className="h-4 w-4 mr-2" />
                          Advanced Search
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-semibold">Advanced Customer Search</DialogTitle>
                          <DialogDescription>Use multiple criteria to find specific customers</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Customer Name</Label>
                              <Input placeholder="Enter name..." />
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input placeholder="Enter email..." />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Plan</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Any Plan" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="basic">Basic</SelectItem>
                                  <SelectItem value="premium">Premium</SelectItem>
                                  <SelectItem value="enterprise">Enterprise</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Any Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="at-risk">At Risk</SelectItem>
                                  <SelectItem value="churned">Churned</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Churn Risk</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Any Risk" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                          <Button variant="outline" onClick={() => setIsAdvancedSearchOpen(false)}>
                            Cancel
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Search className="h-4 w-4 mr-2" />
                            Search Customers
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="border-green-200 hover:bg-green-50 bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Dialog open={isAddSubscriberOpen} onOpenChange={setIsAddSubscriberOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Subscriber
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-semibold">Add New Subscriber</DialogTitle>
                          <DialogDescription>Create a new customer account with subscription details</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                  Full Name *
                                </Label>
                                <Input
                                  id="name"
                                  value={formData.name}
                                  onChange={(e) => handleInputChange("name", e.target.value)}
                                  className="mt-1"
                                  placeholder="Enter full name"
                                  required
                                />
                                {formErrors.name && <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>}
                              </div>
                              <div>
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                  Email Address *
                                </Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => handleInputChange("email", e.target.value)}
                                  className="mt-1"
                                  placeholder="Enter email address"
                                  required
                                />
                                {formErrors.email && <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="plan" className="text-sm font-medium text-gray-700">
                                  Subscription Plan *
                                </Label>
                                <Select
                                  value={formData.plan}
                                  onValueChange={(value) => handleInputChange("plan", value)}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select plan" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Basic">Basic - $29.99/month</SelectItem>
                                    <SelectItem value="Premium">Premium - $99.99/month</SelectItem>
                                    <SelectItem value="Enterprise">Enterprise - $299.99/month</SelectItem>
                                    <SelectItem value="Custom">Custom - Contact Sales</SelectItem>
                                  </SelectContent>
                                </Select>
                                {formErrors.plan && <p className="text-sm text-red-600 mt-1">{formErrors.plan}</p>}
                              </div>
                              <div>
                                <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                                  Country *
                                </Label>
                                <Input
                                  id="country"
                                  value={formData.country}
                                  onChange={(e) => handleInputChange("country", e.target.value)}
                                  className="mt-1"
                                  placeholder="Enter country"
                                  required
                                />
                                {formErrors.country && (
                                  <p className="text-sm text-red-600 mt-1">{formErrors.country}</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                Phone Number
                              </Label>
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                className="mt-1"
                                placeholder="Enter phone number"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-3 block">Payment Methods *</Label>
                              <div className="grid grid-cols-2 gap-3">
                                {["Credit Card", "Bank Transfer", "Bitcoin", "Ethereum", "USDC", "USDT"].map(
                                  (method) => (
                                    <label key={method} className="flex items-center space-x-2 cursor-pointer">
                                      <Checkbox
                                        checked={formData.paymentMethods.includes(method)}
                                        onCheckedChange={(checked) =>
                                          handlePaymentMethodChange(method, checked as boolean)
                                        }
                                      />
                                      <span className="text-sm text-gray-700">{method}</span>
                                    </label>
                                  ),
                                )}
                              </div>
                              {formErrors.paymentMethods && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.paymentMethods}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3 pt-4 border-t">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsAddSubscriberOpen(false)}
                              disabled={isLoading}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              disabled={isLoading}
                            >
                              {isLoading ? "Creating..." : "Create Subscriber"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4 items-end justify-between mb-6">
                  <div className="flex flex-1 items-center space-x-3">
                    <div className="relative min-w-[300px]">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name, email, or plan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <Select>
                      <SelectTrigger className="w-[140px] border-gray-200">
                        <SelectValue placeholder="All Plans" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Plans</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[140px] border-gray-200">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="at-risk">At Risk</SelectItem>
                        <SelectItem value="churned">Churned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Enhanced Customer Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50">
                        <TableHead className="font-semibold text-gray-700">Customer Details</TableHead>
                        <TableHead className="font-semibold text-gray-700">Plan & Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Revenue & Value</TableHead>
                        <TableHead className="font-semibold text-gray-700">Payment Methods</TableHead>
                        <TableHead className="font-semibold text-gray-700">Risk & Activity</TableHead>
                        <TableHead className="font-semibold text-gray-700">Location</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((customer) => (
                        <TableRow key={customer.id} className="hover:bg-blue-50 transition-colors">
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{customer.name}</div>
                                <div className="text-sm text-gray-500">{customer.email}</div>
                                <div className="text-xs text-gray-400">{customer.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div>
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-2">{customer.plan}</Badge>
                              <div>
                                <Badge className={`${getStatusColor(customer.status)} border font-medium`}>
                                  {customer.status}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div>
                              <div className="font-semibold text-lg text-gray-900">
                                ${customer.totalRevenue.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                LTV: ${customer.lifetimeValue.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {customer.subscriptions.length} subscription(s)
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex flex-wrap gap-1">
                              {customer.paymentMethods.slice(0, 2).map((method) => (
                                <div key={method} className="flex items-center space-x-1">
                                  {method.includes("Card") ? (
                                    <CreditCard className="h-3 w-3 text-gray-400" />
                                  ) : (
                                    <Wallet className="h-3 w-3 text-gray-400" />
                                  )}
                                  <span className="text-xs text-gray-600">{method}</span>
                                </div>
                              ))}
                              {customer.paymentMethods.length > 2 && (
                                <span className="text-xs text-gray-500">+{customer.paymentMethods.length - 2}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div>
                              <div className={`font-medium ${getChurnRiskColor(customer.churnRisk)} mb-1`}>
                                {customer.churnRisk} Risk
                              </div>
                              <div className="text-sm text-gray-600">
                                Last: {new Date(customer.lastActivity).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                Joined: {new Date(customer.joinDate).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{customer.country}</div>
                                {customer.phone && <div className="text-xs text-gray-500">{customer.phone}</div>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-blue-100 hover:text-blue-700"
                                onClick={() => handleViewCustomer(customer)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-green-100 hover:text-green-700"
                                onClick={() => handleEditCustomer(customer)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-red-100 hover:text-red-700"
                                onClick={() => handleDeleteCustomer(customer)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Customer Insights */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <span>AI-Powered Customer Insights</span>
                </CardTitle>
                <CardDescription>Smart recommendations to optimize customer relationships and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Target className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">Retention Opportunity</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      3 customers at high churn risk. Automated retention campaigns could save $12,400 ARR.
                    </p>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Launch Campaigns
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Upsell Potential</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      8 Basic plan customers show usage patterns suitable for Premium upgrade.
                    </p>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Create Upsell Campaign
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Payment Optimization</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Customers using crypto payments have 23% higher lifetime value. Promote adoption.
                    </p>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Promote Crypto
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional tab contents would go here */}
          <TabsContent value="customers" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Customer Database</CardTitle>
                <CardDescription>Comprehensive customer management and detailed profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Detailed customer management tools will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Customer Analytics</span>
                </CardTitle>
                <CardDescription>Advanced analytics and customer behavior insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Customer analytics dashboard will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <span>AI-Powered Customer Intelligence</span>
                </CardTitle>
                <CardDescription>Advanced AI insights for customer optimization and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <PieChart className="h-6 w-6 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Churn Prediction</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-600 mb-2">94.2%</p>
                    <p className="text-sm text-gray-600">Prediction accuracy</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Activity className="h-6 w-6 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Engagement Score</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mb-2">8.7/10</p>
                    <p className="text-sm text-gray-600">Average customer engagement</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-green-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Zap className="h-6 w-6 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Automation Rate</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-600 mb-2">87%</p>
                    <p className="text-sm text-gray-600">Tasks automated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Customer Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Customer Details</DialogTitle>
              <DialogDescription>Complete customer information and subscription details</DialogDescription>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedCustomer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                    <p className="text-gray-600">{selectedCustomer.email}</p>
                    <Badge className={`${getStatusColor(selectedCustomer.status)} border font-medium mt-2`}>
                      {selectedCustomer.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Subscription Plan</Label>
                      <p className="text-lg font-semibold text-gray-900">{selectedCustomer.plan}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Total Revenue</Label>
                      <p className="text-lg font-semibold text-gray-900">
                        ${selectedCustomer.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Lifetime Value</Label>
                      <p className="text-lg font-semibold text-gray-900">
                        ${selectedCustomer.lifetimeValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Location</Label>
                      <p className="text-lg font-semibold text-gray-900">{selectedCustomer.country}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Phone</Label>
                      <p className="text-lg font-semibold text-gray-900">{selectedCustomer.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Churn Risk</Label>
                      <p className={`text-lg font-semibold ${getChurnRiskColor(selectedCustomer.churnRisk)}`}>
                        {selectedCustomer.churnRisk}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Payment Methods</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.paymentMethods.map((method) => (
                      <Badge key={method} variant="outline" className="text-sm">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Subscriptions</Label>
                  <div className="space-y-2">
                    {selectedCustomer.subscriptions.map((sub) => (
                      <div key={sub.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{sub.plan}</p>
                          <p className="text-sm text-gray-600">Next billing: {sub.nextBilling}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${sub.amount}/month</p>
                          <Badge className={`${getStatusColor(sub.status)} text-xs`}>{sub.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Joined:</span>{" "}
                    {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Last Activity:</span>{" "}
                    {new Date(selectedCustomer.lastActivity).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Customer Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Edit Customer</DialogTitle>
              <DialogDescription>Update customer information and subscription details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="edit-name"
                      value={editFormData.name}
                      onChange={(e) => handleEditInputChange("name", e.target.value)}
                      className="mt-1"
                      placeholder="Enter full name"
                      required
                    />
                    {formErrors.name && <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="edit-email" className="text-sm font-medium text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => handleEditInputChange("email", e.target.value)}
                      className="mt-1"
                      placeholder="Enter email address"
                      required
                    />
                    {formErrors.email && <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-plan" className="text-sm font-medium text-gray-700">
                      Subscription Plan *
                    </Label>
                    <Select value={editFormData.plan} onValueChange={(value) => handleEditInputChange("plan", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic - $29.99/month</SelectItem>
                        <SelectItem value="Premium">Premium - $99.99/month</SelectItem>
                        <SelectItem value="Enterprise">Enterprise - $299.99/month</SelectItem>
                        <SelectItem value="Custom">Custom - Contact Sales</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.plan && <p className="text-sm text-red-600 mt-1">{formErrors.plan}</p>}
                  </div>
                  <div>
                    <Label htmlFor="edit-country" className="text-sm font-medium text-gray-700">
                      Country *
                    </Label>
                    <Input
                      id="edit-country"
                      value={editFormData.country}
                      onChange={(e) => handleEditInputChange("country", e.target.value)}
                      className="mt-1"
                      placeholder="Enter country"
                      required
                    />
                    {formErrors.country && <p className="text-sm text-red-600 mt-1">{formErrors.country}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="edit-phone"
                    value={editFormData.phone}
                    onChange={(e) => handleEditInputChange("phone", e.target.value)}
                    className="mt-1"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Payment Methods *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Credit Card", "Bank Transfer", "Bitcoin", "Ethereum", "USDC", "USDT"].map((method) => (
                      <label key={method} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={editFormData.paymentMethods.includes(method)}
                          onCheckedChange={(checked) => handlePaymentMethodChange(method, checked as boolean, true)}
                        />
                        <span className="text-sm text-gray-700">{method}</span>
                      </label>
                    ))}
                  </div>
                  {formErrors.paymentMethods && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.paymentMethods}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Customer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this customer?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                <span className="font-semibold">{selectedCustomer?.name}</span> and remove all their data from the
                system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
                Delete Customer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  )
}
