"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle,
  PieChart,
  LineChart,
  Target,
  Brain,
  Layers,
  Loader2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Product {
  id: string
  name: string
  description: string
  category: string
  businessUnit: string
  price: number
  currency: string
  billingCycle: string
  status: string
  subscribers: number
  revenue: number
  createdDate: string
  lastUpdated: string
  features: string[]
  tags: string[]
  popularity: number
  conversionRate: number
  churnRate: number
}

interface ProductFormData {
  name: string
  description: string
  category: string
  businessUnit: string
  price: string
  currency: string
  billingCycle: string
  features: string
  tags: string
  status: string
}

const STORAGE_KEY = "billing-system-products"

export default function ProductManagementPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Load products from localStorage or use default data
  const getInitialProducts = (): Product[] => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (error) {
          console.error("Error parsing stored products:", error)
        }
      }
    }

    // Default data if nothing in localStorage
    return [
      {
        id: "PROD-001",
        name: "Basic Plan",
        description: "Essential features for small businesses",
        category: "Subscription",
        businessUnit: "Core Services",
        price: 29.99,
        currency: "USD",
        billingCycle: "monthly",
        status: "Active",
        subscribers: 1247,
        revenue: 37410,
        createdDate: "2023-01-15",
        lastUpdated: "2024-01-20",
        features: ["Basic Analytics", "Email Support", "5GB Storage"],
        tags: ["starter", "small-business"],
        popularity: 85,
        conversionRate: 12.5,
        churnRate: 3.2,
      },
      {
        id: "PROD-002",
        name: "Premium Plan",
        description: "Advanced features for growing companies",
        category: "Subscription",
        businessUnit: "Core Services",
        price: 99.99,
        currency: "USD",
        billingCycle: "monthly",
        status: "Active",
        subscribers: 892,
        revenue: 89208,
        createdDate: "2023-02-10",
        lastUpdated: "2024-01-19",
        features: ["Advanced Analytics", "Priority Support", "50GB Storage", "API Access"],
        tags: ["popular", "growing-business"],
        popularity: 92,
        conversionRate: 18.7,
        churnRate: 2.1,
      },
      {
        id: "PROD-003",
        name: "Enterprise Plan",
        description: "Full-featured solution for large organizations",
        category: "Subscription",
        businessUnit: "Enterprise Solutions",
        price: 299.99,
        currency: "USD",
        billingCycle: "monthly",
        status: "Active",
        subscribers: 234,
        revenue: 70197,
        createdDate: "2023-03-05",
        lastUpdated: "2024-01-18",
        features: ["Custom Analytics", "24/7 Support", "Unlimited Storage", "Full API", "White Label"],
        tags: ["enterprise", "custom"],
        popularity: 78,
        conversionRate: 25.3,
        churnRate: 1.8,
      },
      {
        id: "PROD-004",
        name: "AI Analytics Add-on",
        description: "Machine learning powered insights",
        category: "Add-on",
        businessUnit: "AI Services",
        price: 49.99,
        currency: "USD",
        billingCycle: "monthly",
        status: "Beta",
        subscribers: 156,
        revenue: 7799,
        createdDate: "2023-11-20",
        lastUpdated: "2024-01-15",
        features: ["Predictive Analytics", "ML Models", "Custom Reports"],
        tags: ["ai", "beta", "analytics"],
        popularity: 67,
        conversionRate: 8.9,
        churnRate: 5.4,
      },
    ]
  }

  const [products, setProducts] = useState<Product[]>(getInitialProducts)

  // Save products to localStorage whenever products change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    }
  }, [products])

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "",
    businessUnit: "",
    price: "",
    currency: "USD",
    billingCycle: "monthly",
    features: "",
    tags: "",
    status: "active",
  })

  const [editFormData, setEditFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "",
    businessUnit: "",
    price: "",
    currency: "USD",
    billingCycle: "monthly",
    features: "",
    tags: "",
    status: "active",
  })

  // Real-time metrics with animation
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalRevenue: 0,
    averagePrice: 0,
  })

  // Calculate metrics on load and when products change
  useEffect(() => {
    const totalProducts = products.length
    const activeProducts = products.filter((p) => p.status === "Active").length
    const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0)
    const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / totalProducts

    setMetrics({
      totalProducts,
      activeProducts,
      totalRevenue,
      averagePrice,
    })
  }, [products])

  const handleFormChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEditFormChange = (field: keyof ProductFormData, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsViewDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setEditFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      businessUnit: product.businessUnit,
      price: product.price.toString(),
      currency: product.currency,
      billingCycle: product.billingCycle,
      features: product.features.join(", "),
      tags: product.tags.join(", "),
      status: product.status.toLowerCase(),
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedProduct) {
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id))
      toast({
        title: "Product Deleted",
        description: `${selectedProduct.name} has been removed from the catalog.`,
      })
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !editFormData.name ||
      !editFormData.description ||
      !editFormData.category ||
      !editFormData.businessUnit ||
      !editFormData.price
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const price = Number.parseFloat(editFormData.price)
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      })
      return
    }

    if (!selectedProduct) return

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setProducts((prev) =>
        prev.map((product) =>
          product.id === selectedProduct.id
            ? {
                ...product,
                name: editFormData.name,
                description: editFormData.description,
                category: editFormData.category,
                businessUnit: editFormData.businessUnit,
                price: price,
                currency: editFormData.currency,
                billingCycle: editFormData.billingCycle,
                status: editFormData.status === "active" ? "Active" : "Inactive",
                features: editFormData.features ? editFormData.features.split(",").map((f) => f.trim()) : [],
                tags: editFormData.tags ? editFormData.tags.split(",").map((t) => t.trim()) : [],
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : product,
        ),
      )

      setIsEditDialogOpen(false)
      setSelectedProduct(null)

      toast({
        title: "Success!",
        description: `Product "${editFormData.name}" has been updated successfully`,
      })
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.description || !formData.category || !formData.businessUnit || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const price = Number.parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newProduct: Product = {
        id: `PROD-${String(products.length + 1).padStart(3, "0")}`,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        businessUnit: formData.businessUnit,
        price: price,
        currency: formData.currency,
        billingCycle: formData.billingCycle,
        status: formData.status === "active" ? "Active" : "Inactive",
        subscribers: 0,
        revenue: 0,
        createdDate: new Date().toISOString().split("T")[0],
        lastUpdated: new Date().toISOString().split("T")[0],
        features: formData.features ? formData.features.split(",").map((f) => f.trim()) : [],
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
        popularity: 0,
        conversionRate: 0,
        churnRate: 0,
      }

      setProducts((prev) => [...prev, newProduct])

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        businessUnit: "",
        price: "",
        currency: "USD",
        billingCycle: "monthly",
        features: "",
        tags: "",
        status: "active",
      })

      setIsAddProductOpen(false)

      toast({
        title: "Success!",
        description: `Product "${formData.name}" has been created successfully`,
      })
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
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
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Beta":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Deprecated":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Subscription":
        return "bg-purple-100 text-purple-800"
      case "Add-on":
        return "bg-blue-100 text-blue-800"
      case "One-time":
        return "bg-green-100 text-green-800"
      case "Usage-based":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Product Management
              </h1>
              <p className="text-xl text-gray-600 mt-1">AI-powered product lifecycle and revenue optimization</p>
            </div>
          </div>

          {/* Real-time Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Products</p>
                    <p className="text-3xl font-bold mt-2">{metrics.totalProducts}</p>
                    <p className="text-purple-100 text-xs mt-1">Across all categories</p>
                  </div>
                  <Package className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active Products</p>
                    <p className="text-3xl font-bold mt-2">{metrics.activeProducts}</p>
                    <p className="text-green-100 text-xs mt-1">
                      {((metrics.activeProducts / metrics.totalProducts) * 100).toFixed(1)}% active rate
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold mt-2">${(metrics.totalRevenue / 1000).toFixed(0)}K</p>
                    <p className="text-blue-100 text-xs mt-1">Monthly recurring</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Average Price</p>
                    <p className="text-3xl font-bold mt-2">${metrics.averagePrice.toFixed(0)}</p>
                    <p className="text-orange-100 text-xs mt-1">Per product/month</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Main Tabs */}
        <Tabs defaultValue="catalog" className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-2">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 bg-transparent gap-1">
              <TabsTrigger
                value="catalog"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 text-sm font-medium"
              >
                Product Catalog
              </TabsTrigger>
              <TabsTrigger
                value="pricing"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 text-sm font-medium"
              >
                Pricing Strategy
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 text-sm font-medium"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="lifecycle"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 text-sm font-medium"
              >
                Lifecycle
              </TabsTrigger>
              <TabsTrigger
                value="bundles"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 text-sm font-medium"
              >
                Bundles
              </TabsTrigger>
              <TabsTrigger
                value="promotions"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 text-sm font-medium"
              >
                Promotions
              </TabsTrigger>
              <TabsTrigger
                value="integrations"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 text-sm font-medium"
              >
                Integrations
              </TabsTrigger>
              <TabsTrigger
                value="ai-insights"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 text-sm font-medium"
              >
                AI Insights
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="catalog" className="space-y-6">
            {/* Advanced Search and Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center space-x-2">
                      <Search className="h-5 w-5 text-purple-600" />
                      <span>Product Catalog Management</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Comprehensive product management with AI-powered insights and optimization
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Dialog open={isAdvancedSearchOpen} onOpenChange={setIsAdvancedSearchOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-purple-200 hover:bg-purple-50 bg-transparent">
                          <Filter className="h-4 w-4 mr-2" />
                          Advanced Search
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-semibold">Advanced Product Search</DialogTitle>
                          <DialogDescription>Use multiple criteria to find specific products</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Product Name</Label>
                              <Input placeholder="Enter name..." />
                            </div>
                            <div className="space-y-2">
                              <Label>Category</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Any Category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="subscription">Subscription</SelectItem>
                                  <SelectItem value="add-on">Add-on</SelectItem>
                                  <SelectItem value="one-time">One-time</SelectItem>
                                  <SelectItem value="usage-based">Usage-based</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                          <Button variant="outline" onClick={() => setIsAdvancedSearchOpen(false)}>
                            Cancel
                          </Button>
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            <Search className="h-4 w-4 mr-2" />
                            Search Products
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="border-green-200 hover:bg-green-50 bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export Catalog
                    </Button>
                    <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-semibold">Add New Product</DialogTitle>
                          <DialogDescription>Create a new product with pricing and feature details</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Product Name *
                              </Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                                className="mt-1"
                                placeholder="Enter product name"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                                Price *
                              </Label>
                              <Input
                                id="price"
                                value={formData.price}
                                onChange={(e) => handleFormChange("price", e.target.value)}
                                className="mt-1"
                                placeholder="$0.00"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                              Description *
                            </Label>
                            <Textarea
                              id="description"
                              value={formData.description}
                              onChange={(e) => handleFormChange("description", e.target.value)}
                              className="mt-1"
                              placeholder="Enter product description"
                              rows={3}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                                Category *
                              </Label>
                              <Select
                                value={formData.category}
                                onValueChange={(value) => handleFormChange("category", value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Subscription">Subscription</SelectItem>
                                  <SelectItem value="Add-on">Add-on</SelectItem>
                                  <SelectItem value="One-time">One-time</SelectItem>
                                  <SelectItem value="Usage-based">Usage-based</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="businessUnit" className="text-sm font-medium text-gray-700">
                                Business Unit *
                              </Label>
                              <Select
                                value={formData.businessUnit}
                                onValueChange={(value) => handleFormChange("businessUnit", value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select business unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Core Services">Core Services</SelectItem>
                                  <SelectItem value="Enterprise Solutions">Enterprise Solutions</SelectItem>
                                  <SelectItem value="AI Services">AI Services</SelectItem>
                                  <SelectItem value="Mobile Solutions">Mobile Solutions</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3 pt-4 border-t">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsAddProductOpen(false)}
                              disabled={isLoading}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Creating...
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Create Product
                                </>
                              )}
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
                        placeholder="Search products by name, description, or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-purple-500"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[140px] border-gray-200">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                        <SelectItem value="Add-on">Add-on</SelectItem>
                        <SelectItem value="One-time">One-time</SelectItem>
                        <SelectItem value="Usage-based">Usage-based</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-[140px] border-gray-200">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Beta">Beta</SelectItem>
                        <SelectItem value="Deprecated">Deprecated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Enhanced Product Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-purple-50">
                        <TableHead className="font-semibold text-gray-700">Product Details</TableHead>
                        <TableHead className="font-semibold text-gray-700">Category & Unit</TableHead>
                        <TableHead className="font-semibold text-gray-700">Pricing</TableHead>
                        <TableHead className="font-semibold text-gray-700">Performance</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id} className="hover:bg-purple-50 transition-colors">
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">
                                <Package className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                                <div className="text-xs text-gray-400">{product.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-2">
                              <Badge className={`${getCategoryColor(product.category)} font-medium`}>
                                {product.category}
                              </Badge>
                              <div className="text-sm text-gray-600">{product.businessUnit}</div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div>
                              <div className="font-semibold text-lg text-gray-900">${product.price.toFixed(2)}</div>
                              <div className="text-sm text-gray-600">
                                {product.currency} / {product.billingCycle}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Users className="h-3 w-3 text-gray-400" />
                                <span className="text-sm font-medium">{product.subscribers.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-3 w-3 text-gray-400" />
                                <span className="text-sm text-gray-600">${product.revenue.toLocaleString()}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge className={`${getStatusColor(product.status)} border font-medium`}>
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-purple-100 hover:text-purple-700"
                                onClick={() => handleViewProduct(product)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-green-100 hover:text-green-700"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-red-100 hover:text-red-700"
                                onClick={() => handleDeleteProduct(product)}
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

            {/* AI-Powered Product Recommendations */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Brain className="h-6 w-6 text-blue-600" />
                  <span>AI-Powered Product Insights</span>
                </CardTitle>
                <CardDescription>Smart recommendations to optimize your product portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Target className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Pricing Optimization</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Premium Plan shows 23% price elasticity. Consider testing $119.99 pricing.
                    </p>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Optimize Pricing
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Layers className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">Bundle Opportunities</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      AI Analytics Add-on pairs well with Premium Plan. Create bundle for 15% uplift.
                    </p>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Create Bundle
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Market Expansion</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Enterprise segment shows 34% growth potential. Consider new enterprise features.
                    </p>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Expand Market
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional tab contents */}
          <TabsContent value="pricing" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Pricing Strategy</CardTitle>
                <CardDescription>Dynamic pricing optimization and strategy management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Pricing strategy tools and analytics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Product Analytics</CardTitle>
                <CardDescription>Comprehensive analytics and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Product analytics dashboard will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <span>AI-Powered Product Intelligence</span>
                </CardTitle>
                <CardDescription>Advanced AI insights for product optimization and strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <PieChart className="h-6 w-6 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Revenue Prediction</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-600 mb-2">$2.8M</p>
                    <p className="text-sm text-gray-600">Projected Q2 2024 revenue</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <LineChart className="h-6 w-6 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Market Trends</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mb-2">+18%</p>
                    <p className="text-sm text-gray-600">AI services market growth</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-green-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Target className="h-6 w-6 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Optimization Score</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-600 mb-2">87/100</p>
                    <p className="text-sm text-gray-600">Portfolio optimization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Product Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Product Details</DialogTitle>
              <DialogDescription>Complete product information and performance metrics</DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                    <Package className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h3>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                    <Badge className={`${getStatusColor(selectedProduct.status)} border font-medium mt-2`}>
                      {selectedProduct.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Category</Label>
                      <p className="text-lg font-semibold text-gray-900">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Business Unit</Label>
                      <p className="text-lg font-semibold text-gray-900">{selectedProduct.businessUnit}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Price</Label>
                      <p className="text-lg font-semibold text-gray-900">
                        ${selectedProduct.price.toFixed(2)} / {selectedProduct.billingCycle}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Subscribers</Label>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedProduct.subscribers.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Revenue</Label>
                      <p className="text-lg font-semibold text-gray-900">${selectedProduct.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Conversion Rate</Label>
                      <p className="text-lg font-semibold text-gray-900">{selectedProduct.conversionRate}%</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Features</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-sm">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(selectedProduct.createdDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {new Date(selectedProduct.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Edit Product</DialogTitle>
              <DialogDescription>Update product information and pricing details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">
                    Product Name *
                  </Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) => handleEditFormChange("name", e.target.value)}
                    className="mt-1"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-price" className="text-sm font-medium text-gray-700">
                    Price *
                  </Label>
                  <Input
                    id="edit-price"
                    value={editFormData.price}
                    onChange={(e) => handleEditFormChange("price", e.target.value)}
                    className="mt-1"
                    placeholder="$0.00"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">
                  Description *
                </Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) => handleEditFormChange("description", e.target.value)}
                  className="mt-1"
                  placeholder="Enter product description"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category" className="text-sm font-medium text-gray-700">
                    Category *
                  </Label>
                  <Select
                    value={editFormData.category}
                    onValueChange={(value) => handleEditFormChange("category", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Subscription">Subscription</SelectItem>
                      <SelectItem value="Add-on">Add-on</SelectItem>
                      <SelectItem value="One-time">One-time</SelectItem>
                      <SelectItem value="Usage-based">Usage-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-businessUnit" className="text-sm font-medium text-gray-700">
                    Business Unit *
                  </Label>
                  <Select
                    value={editFormData.businessUnit}
                    onValueChange={(value) => handleEditFormChange("businessUnit", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select business unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Core Services">Core Services</SelectItem>
                      <SelectItem value="Enterprise Solutions">Enterprise Solutions</SelectItem>
                      <SelectItem value="AI Services">AI Services</SelectItem>
                      <SelectItem value="Mobile Solutions">Mobile Solutions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                <span className="font-semibold">{selectedProduct?.name}</span> and remove it from your product catalog.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
                Delete Product
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
