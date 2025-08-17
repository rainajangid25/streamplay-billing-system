"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useBillingStore, useCurrentCustomer } from "@/lib/store"
import {
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Send,
  Plus,
  Brain,
  Zap,
  CreditCard,
  Wallet,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
} from "lucide-react"

interface Invoice {
  id: string
  customer: string
  amount: string
  status: string
  dueDate: string
  paymentMethod: string
  aiGenerated: boolean
  description?: string
  items?: string[]
}

const STORAGE_KEY = "billing-system-invoices"




export default function BillingPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const { customers, subscriptions } = useBillingStore()
  const { customer: currentCustomer } = useCurrentCustomer()
  
  // Log customer data changes for verification
  useEffect(() => {
    console.log('Billing Management - Customer data updated:', customers.length, 'customers')
  }, [customers])
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // ✅ FIX: Initialize with empty array and load after hydration
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // All useState calls must be declared before any conditional returns
  const [formData, setFormData] = useState({
    customer: "",
    amount: "",
    dueDate: "",
    paymentMethod: "",
    description: "",
    items: "",
  })

  const [editFormData, setEditFormData] = useState({
    customer: "",
    amount: "",
    dueDate: "",
    paymentMethod: "",
    description: "",
    items: "",
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [localSubscriptions] = useState([
    {
      id: "SUB-001",
      customer: "John Smith",
      plan: "Premium",
      amount: "$99/month",
      status: "Active",
      nextBilling: "2024-02-01",
      autoRenew: true,
    },
    {
      id: "SUB-002",
      customer: "Sarah Johnson",
      plan: "Enterprise",
      amount: "$299/month",
      status: "Active",
      nextBilling: "2024-02-05",
      autoRenew: true,
    },
    {
      id: "SUB-003",
      customer: "Mike Chen",
      plan: "Basic",
      amount: "$29/month",
      status: "Cancelled",
      nextBilling: "-",
      autoRenew: false,
    },
  ])

  // ✅ FIX: Load data after component mounts (client-side only)
  useEffect(() => {
    // Check for plan parameters from change-plan page
    const plan = searchParams?.get('plan')
    const price = searchParams?.get('price')
    const billing = searchParams?.get('billing')
    
    if (plan && price) {
      toast({
        title: "Plan Selected Successfully!",
        description: `Welcome to ${plan} plan (₹${price}/${billing}). Complete your subscription below.`,
      })
    }
    
    const loadInitialInvoices = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (error) {
          console.error("Error parsing stored invoices:", error)
        }
      }

      // Default data if nothing in localStorage
      return [
      {
        id: "INV-2024-001",
        customer: "John Smith",
        amount: "$2,450.00",
        status: "Paid",
        dueDate: "2024-01-15",
        paymentMethod: "Credit Card",
        aiGenerated: true,
        description: "Monthly subscription and setup fees",
        items: ["Premium Subscription - $99.99", "Setup Fee - $50.00", "Additional Services - $25.00"],
      },
      {
        id: "INV-2024-002",
        customer: "Sarah Johnson",
        amount: "$8,900.00",
        status: "Pending",
        dueDate: "2024-01-20",
        paymentMethod: "Ethereum",
        aiGenerated: true,
        description: "Enterprise plan with custom features",
        items: ["Enterprise Plan - $299.99", "Custom Development - $500.00", "Priority Support - $100.00"],
      },
      {
        id: "INV-2024-003",
        customer: "Mike Chen",
        amount: "$299.00",
        status: "Overdue",
        dueDate: "2024-01-10",
        paymentMethod: "Bitcoin",
        aiGenerated: false,
        description: "Basic plan subscription",
        items: ["Basic Plan - $29.99"],
      },
      {
        id: "INV-2024-004",
        customer: "Emily Davis",
        amount: "$1,850.00",
        status: "Draft",
        dueDate: "2024-01-25",
        paymentMethod: "USDC",
        aiGenerated: true,
        description: "Premium plan with add-ons",
        items: ["Premium Plan - $99.99", "AI Analytics - $49.99", "Extra Storage - $25.00"],
      },
    ]
    }

    setInvoices(loadInitialInvoices())
    setIsHydrated(true)
  }, [])

  // Save invoices to localStorage whenever invoices change
  useEffect(() => {
    if (isHydrated && invoices.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
    }
  }, [invoices, isHydrated])

  // ✅ FIX: Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  const validateForm = (data: typeof formData) => {
    const errors: Record<string, string> = {}

    if (!data.customer.trim()) {
      errors.customer = "Customer is required"
    }

    if (!data.amount.trim()) {
      errors.amount = "Amount is required"
    } else if (isNaN(Number(data.amount)) || Number(data.amount) <= 0) {
      errors.amount = "Amount must be a valid positive number"
    }

    if (!data.dueDate.trim()) {
      errors.dueDate = "Due date is required"
    } else {
      const selectedDate = new Date(data.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        errors.dueDate = "Due date cannot be in the past"
      }
    }

    if (!data.paymentMethod.trim()) {
      errors.paymentMethod = "Payment method is required"
    }

    if (!data.description.trim()) {
      errors.description = "Description is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsViewDialogOpen(true)
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setEditFormData({
      customer: invoice.customer,
      amount: invoice.amount.replace(/[$,]/g, ""),
      dueDate: invoice.dueDate,
      paymentMethod: invoice.paymentMethod,
      description: invoice.description || "",
      items: invoice.items?.join("\n") || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedInvoice) {
      setInvoices((prev) => prev.filter((i) => i.id !== selectedInvoice.id))
      toast({
        title: "Invoice Deleted",
        description: `${selectedInvoice.id} has been removed from the system.`,
      })
      setIsDeleteDialogOpen(false)
      setSelectedInvoice(null)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm(editFormData) || !selectedInvoice) {
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

      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === selectedInvoice.id
            ? {
                ...invoice,
                customer: editFormData.customer,
                amount: `$${Number.parseFloat(editFormData.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                dueDate: editFormData.dueDate,
                paymentMethod: editFormData.paymentMethod,
                description: editFormData.description,
                items: editFormData.items ? editFormData.items.split("\n").filter((item) => item.trim()) : [],
              }
            : invoice,
        ),
      )

      setIsEditDialogOpen(false)
      setSelectedInvoice(null)

      toast({
        title: "Success!",
        description: `Invoice ${selectedInvoice.id} has been updated successfully`,
      })
    } catch (error) {
      console.error("Error updating invoice:", error)
      toast({
        title: "Error",
        description: "Failed to update invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateInvoice = async (e: React.FormEvent) => {
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create new invoice object
      const newInvoice: Invoice = {
        id: `INV-2024-${String(invoices.length + 1).padStart(3, "0")}`,
        customer: formData.customer,
        amount: `$${Number.parseFloat(formData.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        status: "Draft",
        dueDate: formData.dueDate,
        paymentMethod: formData.paymentMethod,
        aiGenerated: false,
        description: formData.description,
        items: formData.items ? formData.items.split("\n").filter((item) => item.trim()) : [],
      }

      // Add to invoices list
      setInvoices((prev) => [newInvoice, ...prev])

      // Reset form
      setFormData({
        customer: "",
        amount: "",
        dueDate: "",
        paymentMethod: "",
        description: "",
        items: "",
      })

      setIsCreateInvoiceOpen(false)

      toast({
        title: "Invoice Created Successfully",
        description: `Invoice ${newInvoice.id} has been created for ${formData.customer}`,
      })
    } catch (error) {
      console.error("Error creating invoice:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create invoice",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending":
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Overdue":
      case "Cancelled":
        return "bg-red-100 text-red-800"
      case "Unpaid":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GoBill AI - Billing Management</h1>
        <p className="text-gray-600">AI-powered billing and financial operations management</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search invoices..." className="pl-8" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Create New Invoice</DialogTitle>
                      <DialogDescription>
                        Generate a new invoice for your customer with AI-powered recommendations.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateInvoice} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customer">Customer *</Label>
                          <Select
                            value={formData.customer}
                            onValueChange={(value) => handleInputChange("customer", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                            <SelectContent>
                              {customers.map(customer => (
                                <SelectItem key={customer.id} value={customer.name}>
                                  {customer.name} ({customer.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {formErrors.customer && <p className="text-sm text-red-600">{formErrors.customer}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (USD) *</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => handleInputChange("amount", e.target.value)}
                          />
                          {formErrors.amount && <p className="text-sm text-red-600">{formErrors.amount}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dueDate">Due Date *</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => handleInputChange("dueDate", e.target.value)}
                          />
                          {formErrors.dueDate && <p className="text-sm text-red-600">{formErrors.dueDate}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="paymentMethod">Payment Method *</Label>
                          <Select
                            value={formData.paymentMethod}
                            onValueChange={(value) => handleInputChange("paymentMethod", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Credit Card">Credit Card</SelectItem>
                              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                              <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                              <SelectItem value="Ethereum">Ethereum</SelectItem>
                              <SelectItem value="USDC">USDC</SelectItem>
                              <SelectItem value="USDT">USDT</SelectItem>
                              <SelectItem value="PayPal">PayPal</SelectItem>
                            </SelectContent>
                          </Select>
                          {formErrors.paymentMethod && (
                            <p className="text-sm text-red-600">{formErrors.paymentMethod}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Input
                          id="description"
                          placeholder="Invoice description"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                        />
                        {formErrors.description && <p className="text-sm text-red-600">{formErrors.description}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="items">Line Items (one per line)</Label>
                        <Textarea
                          id="items"
                          placeholder="Premium Subscription - $99.00&#10;Setup Fee - $50.00&#10;Additional Services - $25.00"
                          value={formData.items}
                          onChange={(e) => handleInputChange("items", e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-start space-x-2">
                          <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-900 mb-1">AI Recommendations</h4>
                            <p className="text-blue-800 text-sm">
                              Based on customer history, consider offering a 5% early payment discount. This customer
                              typically pays within 10 days.
                            </p>
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateInvoiceOpen(false)}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Creating..." : "Create Invoice"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comprehensive Customer & Billing Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Customer & Billing Management</CardTitle>
                <CardDescription>Comprehensive view of customers, subscriptions, and billing status</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Plan & Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Last Invoice</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => {
                  const customerSubscription = subscriptions.find(s => s.user_id === customer.id)
                  const customerInvoices = invoices.filter(i => i.customer === customer.name)
                  const lastInvoice = customerInvoices[0] // Assuming sorted by date
                  
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{customer.phone || 'N/A'}</div>
                          <div className="text-gray-500">{customer.billing_address?.country || 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant={customer.status === 'active' ? 'default' : 'secondary'} className="mb-1">
                            {customer.status}
                          </Badge>
                          <div className="text-sm font-medium">{customer.plan_type}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {customerSubscription ? (
                          <div className="text-sm">
                            <div className="font-medium">₹{customerSubscription.amount}</div>
                            <div className="text-gray-500">{customerSubscription.billing_cycle}</div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">No subscription</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {lastInvoice ? (
                          <div className="text-sm">
                            <div className="font-medium">{lastInvoice.id}</div>
                            <Badge variant={
                              lastInvoice.status === 'paid' ? 'default' :
                              lastInvoice.status === 'pending' ? 'secondary' :
                              'destructive'
                            } className="text-xs">
                              {lastInvoice.status}
                            </Badge>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">No invoices</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">₹{customer.total_spent || 0}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {customerSubscription ? (
                            <div>{customerSubscription.end_date || 'N/A'}</div>
                          ) : (
                            <div className="text-gray-500">-</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // View customer details
                              console.log('View customer:', customer.id)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setIsCreateInvoiceOpen(true)
                              // Pre-fill with customer data
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {customers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>



        {/* Billing Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Active customer accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$124,891</div>
              <p className="text-xs text-muted-foreground">47 pending invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Automation</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.7%</div>
              <p className="text-xs text-muted-foreground">Invoices auto-generated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blockchain Payments</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$357,109</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+24.1%</span> adoption
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span>AI Billing Insights</span>
            </CardTitle>
            <CardDescription>Machine learning recommendations for billing optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Revenue Optimization</h4>
                <p className="text-blue-800 text-sm mb-2">
                  Dynamic pricing could increase revenue by 18% for premium customers
                </p>
                <Button size="sm" variant="outline" className="text-blue-700 border-blue-300 bg-transparent">
                  Apply Suggestions
                </Button>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Collection Efficiency</h4>
                <p className="text-green-800 text-sm mb-2">AI dunning reduced overdue payments by 34% this month</p>
                <Button size="sm" variant="outline" className="text-green-700 border-green-300 bg-transparent">
                  View Details
                </Button>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">Payment Trends</h4>
                <p className="text-purple-800 text-sm mb-2">Crypto payments show 34% higher customer lifetime value</p>
                <Button size="sm" variant="outline" className="text-purple-700 border-purple-300 bg-transparent">
                  Promote Crypto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Invoice Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Invoice Details</DialogTitle>
              <DialogDescription>Complete invoice information and line items</DialogDescription>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedInvoice.id}</h3>
                      <p className="text-sm text-gray-500">Generated for {selectedInvoice.customer}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(selectedInvoice.status)}>
                    {selectedInvoice.status}
                  </Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }