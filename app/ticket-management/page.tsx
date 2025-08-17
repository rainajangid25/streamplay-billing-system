"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Download, Eye, Edit, Trash2, Ticket, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useBillingStore } from "@/lib/store"

interface TicketFormData {
  title: string
  businessUnit: string
  category: string
  priority: string
  customerName: string
  phoneNumber: string
  email: string
  customerId: string
  promiseDate: string
  estimatedHours: string
  description: string
  isRecurring: boolean
  hasParentTicket: boolean
}

interface TicketData {
  businessUnit: string
  createdDate: string
  modifiedDate: string
  ticketId: string
  category: string
  title: string
  level1: string
  level2: string
  level3: string
  cpCustomerId: string
  assignedUser: string
  assignedQueue: string
  status: string
  subStatus: string
  priority: string
  customerName?: string
  phoneNumber?: string
  email?: string
  description?: string
}

const STORAGE_KEY = "billing-system-tickets"

export default function TicketManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateTicketDialogOpen, setIsCreateTicketDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  // Use tickets from global store
  const { tickets: storeTickets, addTicket, updateTicket, removeTicket } = useBillingStore()

  // Load tickets from localStorage or use default data
  const getInitialTickets = (): TicketData[] => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (error) {
          console.error("Error parsing stored tickets:", error)
        }
      }
    }

    // Default data if nothing in localStorage
    return [
      {
        businessUnit: "Support",
        createdDate: "2024-01-25 10:00",
        modifiedDate: "2024-01-25 11:30",
        ticketId: "TKT-001",
        category: "Billing",
        title: "Invoice Dispute - Incorrect Charges",
        level1: "Customer Service",
        level2: "Billing Department",
        level3: "Finance Team",
        cpCustomerId: "CP-001-ABC",
        assignedUser: "Agent Smith",
        assignedQueue: "Billing Queue",
        status: "Open",
        subStatus: "Pending Review",
        priority: "High",
        customerName: "John Doe",
        phoneNumber: "+1-555-0123",
        email: "john.doe@example.com",
        description: "Customer disputes charges on recent invoice INV-2024-001",
      },
      {
        businessUnit: "Technical",
        createdDate: "2024-01-24 14:15",
        modifiedDate: "2024-01-24 16:00",
        ticketId: "TKT-002",
        category: "Connectivity",
        title: "Internet Service Outage",
        level1: "Technical Support",
        level2: "Network Operations",
        level3: "Infrastructure Team",
        cpCustomerId: "CP-002-XYZ",
        assignedUser: "Tech Jones",
        assignedQueue: "Network Issues",
        status: "Resolved",
        subStatus: "Closed",
        priority: "Critical",
        customerName: "Jane Smith",
        phoneNumber: "+1-555-0456",
        email: "jane.smith@example.com",
        description: "Complete internet service outage affecting multiple customers in downtown area",
      },
      {
        businessUnit: "Support",
        createdDate: "2024-01-23 09:30",
        modifiedDate: "2024-01-23 15:45",
        ticketId: "TKT-003",
        category: "Account",
        title: "Password Reset Request",
        level1: "Customer Service",
        level2: "Account Management",
        level3: "Security Team",
        cpCustomerId: "CP-003-DEF",
        assignedUser: "Support Agent",
        assignedQueue: "General Support",
        status: "In Progress",
        subStatus: "Awaiting Customer",
        priority: "Medium",
        customerName: "Bob Wilson",
        phoneNumber: "+1-555-0789",
        email: "bob.wilson@example.com",
        description: "Customer unable to access account and needs password reset assistance",
      },
    ]
  }

  const [localTickets, setLocalTickets] = useState<TicketData[]>(getInitialTickets)

  // Convert store tickets to local ticket format and combine with local tickets
  const convertStoreTicketsToLocal = (storeTickets: any[]): TicketData[] => {
    return storeTickets.map(ticket => ({
      businessUnit: "StreamPlay",
      createdDate: ticket.createdAt || new Date().toISOString(),
      modifiedDate: ticket.updatedAt || ticket.createdAt || new Date().toISOString(),
      ticketId: ticket.id,
      category: "Customer Support",
      title: ticket.subject,
      level1: "Support",
      level2: "Customer Issue",
      level3: ticket.priority,
      cpCustomerId: ticket.customerId || '',
      assignedUser: "Support Team",
      assignedQueue: "General Support",
      status: ticket.status === 'open' ? 'Open' : 
               ticket.status === 'in_progress' ? 'In Progress' : 
               ticket.status === 'resolved' ? 'Resolved' : 'Open',
      subStatus: ticket.status === 'open' ? 'New' : 'Active',
      priority: ticket.priority || 'medium',
      customerName: ticket.customerName,
      email: ticket.email,
      description: ticket.message
    }))
  }

  // Combine local tickets with store tickets
  const allTickets = [...localTickets, ...convertStoreTicketsToLocal(storeTickets)]

  // Use allTickets instead of tickets
  const tickets = allTickets

  // Save local tickets to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localTickets))
    }
  }, [localTickets])

  // Debug: Log when store tickets change
  useEffect(() => {
    console.log('Ticket Management - Store tickets updated:', storeTickets)
  }, [storeTickets])

  const [formData, setFormData] = useState<TicketFormData>({
    title: "",
    businessUnit: "",
    category: "",
    priority: "",
    customerName: "",
    phoneNumber: "",
    email: "",
    customerId: "",
    promiseDate: "",
    estimatedHours: "",
    description: "",
    isRecurring: false,
    hasParentTicket: false,
  })

  const [editFormData, setEditFormData] = useState<TicketFormData>({
    title: "",
    businessUnit: "",
    category: "",
    priority: "",
    customerName: "",
    phoneNumber: "",
    email: "",
    customerId: "",
    promiseDate: "",
    estimatedHours: "",
    description: "",
    isRecurring: false,
    hasParentTicket: false,
  })

  const [formErrors, setFormErrors] = useState<Partial<TicketFormData>>({})

  const validateForm = (data: TicketFormData): boolean => {
    const errors: Partial<TicketFormData> = {}

    if (!data.title.trim()) {
      errors.title = "Title is required"
    }

    if (!data.businessUnit) {
      errors.businessUnit = "Business unit is required"
    }

    if (!data.category) {
      errors.category = "Category is required"
    }

    if (!data.priority) {
      errors.priority = "Priority is required"
    }

    if (!data.customerName.trim()) {
      errors.customerName = "Customer name is required"
    }

    if (!data.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!data.customerId.trim()) {
      errors.customerId = "Customer ID is required"
    }

    if (!data.description.trim()) {
      errors.description = "Description is required"
    }

    if (data.estimatedHours && isNaN(Number(data.estimatedHours))) {
      errors.estimatedHours = "Please enter a valid number"
    }

    if (data.promiseDate) {
      const selectedDate = new Date(data.promiseDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        errors.promiseDate = "Promise date cannot be in the past"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof TicketFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleEditInputChange = (field: keyof TicketFormData, value: string | boolean) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleViewTicket = (ticket: TicketData) => {
    setSelectedTicket(ticket)
    setIsViewDialogOpen(true)
  }

  const handleEditTicket = (ticket: TicketData) => {
    setSelectedTicket(ticket)
    setEditFormData({
      title: ticket.title,
      businessUnit: ticket.businessUnit.toLowerCase(),
      category: ticket.category.toLowerCase(),
      priority: ticket.priority.toLowerCase(),
      customerName: ticket.customerName || "",
      phoneNumber: ticket.phoneNumber || "",
      email: ticket.email || "",
      customerId: ticket.cpCustomerId,
      promiseDate: "",
      estimatedHours: "",
      description: ticket.description || "",
      isRecurring: false,
      hasParentTicket: false,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteTicket = (ticket: TicketData) => {
    setSelectedTicket(ticket)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedTicket) {
      // Check if it's a store ticket (from My Account) or local ticket
      const isStoreTicket = selectedTicket.ticketId.startsWith('TKT_')
      
      if (isStoreTicket) {
        // Remove from store
        removeTicket(selectedTicket.ticketId)
      } else {
        // Remove from local tickets
        setLocalTickets((prev) => prev.filter((t) => t.ticketId !== selectedTicket.ticketId))
      }
      
      toast({
        title: "Ticket Deleted",
        description: `${selectedTicket.ticketId} has been removed from the system.`,
      })
      setIsDeleteDialogOpen(false)
      setSelectedTicket(null)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm(editFormData) || !selectedTicket) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check if it's a store ticket or local ticket
      const isStoreTicket = selectedTicket.ticketId.startsWith('TKT_')
      
      if (isStoreTicket) {
        // Update in store
        updateTicket(selectedTicket.ticketId, {
          subject: editFormData.title,
          priority: editFormData.priority,
          customerName: editFormData.customerName,
          email: editFormData.email,
          message: editFormData.description,
          updatedAt: new Date().toISOString()
        })
      } else {
        // Update local tickets
        setLocalTickets((prev) =>
          prev.map((ticket) =>
            ticket.ticketId === selectedTicket.ticketId
              ? {
                  ...ticket,
                  title: editFormData.title,
                  businessUnit: editFormData.businessUnit,
                  category: editFormData.category,
                  priority: editFormData.priority,
                  customerName: editFormData.customerName,
                  phoneNumber: editFormData.phoneNumber,
                  email: editFormData.email,
                  cpCustomerId: editFormData.customerId,
                  description: editFormData.description,
                  modifiedDate: new Date().toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }),
                }
              : ticket,
          ),
        )
      }

      setIsEditDialogOpen(false)
      setSelectedTicket(null)

      toast({
        title: "Success!",
        description: `Ticket ${selectedTicket.ticketId} has been updated successfully`,
      })
    } catch (error) {
      console.error("Error updating ticket:", error)
      toast({
        title: "Error",
        description: "Failed to update ticket. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm(formData)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Generate new ticket ID
      const newTicketId = `TKT-${String(tickets.length + 1).padStart(3, "0")}`
      const currentDate = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })

      // Create new ticket object
      const newTicket: TicketData = {
        businessUnit: formData.businessUnit,
        createdDate: currentDate,
        modifiedDate: currentDate,
        ticketId: newTicketId,
        category: formData.category,
        title: formData.title,
        level1: getLevel1FromBusinessUnit(formData.businessUnit),
        level2: getLevel2FromCategory(formData.category),
        level3: getLevel3FromPriority(formData.priority),
        cpCustomerId: formData.customerId,
        assignedUser: "Auto-Assigned",
        assignedQueue: getQueueFromCategory(formData.category),
        status: "Open",
        subStatus: "New",
        priority: formData.priority,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        description: formData.description,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add to local tickets list (admin created tickets)
      setLocalTickets((prev) => [newTicket, ...prev])

      // Reset form
      setFormData({
        title: "",
        businessUnit: "",
        category: "",
        priority: "",
        customerName: "",
        phoneNumber: "",
        email: "",
        customerId: "",
        promiseDate: "",
        estimatedHours: "",
        description: "",
        isRecurring: false,
        hasParentTicket: false,
      })

      setIsCreateTicketDialogOpen(false)

      toast({
        title: "Ticket Created Successfully!",
        description: `Ticket ${newTicketId} has been created and assigned to the appropriate queue.`,
      })
    } catch (error) {
      console.error("Error creating ticket:", error)
      toast({
        title: "Error Creating Ticket",
        description: "There was an error creating the ticket. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getLevel1FromBusinessUnit = (businessUnit: string): string => {
    const mapping: Record<string, string> = {
      support: "Customer Service",
      technical: "Technical Support",
      billing: "Billing Department",
      sales: "Sales Team",
    }
    return mapping[businessUnit] || "General Support"
  }

  const getLevel2FromCategory = (category: string): string => {
    const mapping: Record<string, string> = {
      billing: "Billing Department",
      connectivity: "Network Operations",
      account: "Account Management",
      technical: "Technical Operations",
    }
    return mapping[category] || "General Operations"
  }

  const getLevel3FromPriority = (priority: string): string => {
    const mapping: Record<string, string> = {
      critical: "Emergency Response Team",
      high: "Priority Support Team",
      medium: "Standard Support Team",
      low: "General Support Team",
    }
    return mapping[priority] || "General Support Team"
  }

  const getQueueFromCategory = (category: string): string => {
    const mapping: Record<string, string> = {
      billing: "Billing Queue",
      connectivity: "Network Issues",
      account: "Account Management",
      technical: "Technical Support",
    }
    return mapping[category] || "General Support"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800 border-red-200"
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "Resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ticket Management</h1>
              <p className="text-lg text-gray-600">Manage and track all customer support tickets</p>
            </div>
          </div>
        </div>

        {/* Ticket Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-700 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Open Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{tickets.filter((t) => t.status === "Open").length}</div>
              <p className="text-xs text-red-700 mt-1">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {tickets.filter((t) => t.status === "In Progress").length}
              </div>
              <p className="text-xs text-blue-700 mt-1">Being worked on</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolved Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {tickets.filter((t) => t.status === "Resolved").length}
              </div>
              <p className="text-xs text-green-700 mt-1">Successfully closed</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">2.4h</div>
              <p className="text-xs text-purple-700 mt-1">Below target of 4h</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filter */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Search & Filter Tickets</CardTitle>
            <CardDescription>Find and manage support tickets efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 items-end justify-between">
              <div className="flex flex-1 items-center space-x-3 flex-wrap gap-3">
                <div className="relative min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tickets by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-[140px] border-gray-200">
                    <SelectValue placeholder="Business Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[120px] border-gray-200">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="connectivity">Connectivity</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[120px] border-gray-200">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50 bg-transparent">
                    Reset
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Search
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog open={isCreateTicketDialogOpen} onOpenChange={setIsCreateTicketDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">Create New Support Ticket</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Fill in the details for the new support ticket
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Ticket Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="ticket-title" className="text-sm font-medium text-gray-700">
                              Title *
                            </Label>
                            <Input
                              id="ticket-title"
                              className="mt-1"
                              placeholder="Brief description of the issue"
                              value={formData.title}
                              onChange={(e) => handleInputChange("title", e.target.value)}
                            />
                            {formErrors.title && <p className="text-sm text-red-600 mt-1">{formErrors.title}</p>}
                          </div>
                          <div>
                            <Label htmlFor="ticket-business-unit" className="text-sm font-medium text-gray-700">
                              Business Unit *
                            </Label>
                            <Select
                              value={formData.businessUnit}
                              onValueChange={(value) => handleInputChange("businessUnit", value)}
                            >
                              <SelectTrigger id="ticket-business-unit" className="mt-1">
                                <SelectValue placeholder="Select Business Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="support">Customer Support</SelectItem>
                                <SelectItem value="technical">Technical Support</SelectItem>
                                <SelectItem value="billing">Billing Department</SelectItem>
                                <SelectItem value="sales">Sales Team</SelectItem>
                              </SelectContent>
                            </Select>
                            {formErrors.businessUnit && (
                              <p className="text-sm text-red-600 mt-1">{formErrors.businessUnit}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="ticket-category" className="text-sm font-medium text-gray-700">
                              Category *
                            </Label>
                            <Select
                              value={formData.category}
                              onValueChange={(value) => handleInputChange("category", value)}
                            >
                              <SelectTrigger id="ticket-category" className="mt-1">
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="billing">Billing Issue</SelectItem>
                                <SelectItem value="connectivity">Connectivity Problem</SelectItem>
                                <SelectItem value="account">Account Management</SelectItem>
                                <SelectItem value="technical">Technical Issue</SelectItem>
                              </SelectContent>
                            </Select>
                            {formErrors.category && <p className="text-sm text-red-600 mt-1">{formErrors.category}</p>}
                          </div>
                          <div>
                            <Label htmlFor="ticket-priority" className="text-sm font-medium text-gray-700">
                              Priority *
                            </Label>
                            <Select
                              value={formData.priority}
                              onValueChange={(value) => handleInputChange("priority", value)}
                            >
                              <SelectTrigger id="ticket-priority" className="mt-1">
                                <SelectValue placeholder="Select Priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="critical">Critical - Service Down</SelectItem>
                                <SelectItem value="high">High - Major Impact</SelectItem>
                                <SelectItem value="medium">Medium - Minor Impact</SelectItem>
                                <SelectItem value="low">Low - General Inquiry</SelectItem>
                              </SelectContent>
                            </Select>
                            {formErrors.priority && <p className="text-sm text-red-600 mt-1">{formErrors.priority}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Customer Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="customer-name" className="text-sm font-medium text-gray-700">
                              Customer Name *
                            </Label>
                            <Input
                              id="customer-name"
                              className="mt-1"
                              placeholder="Full name"
                              value={formData.customerName}
                              onChange={(e) => handleInputChange("customerName", e.target.value)}
                            />
                            {formErrors.customerName && (
                              <p className="text-sm text-red-600 mt-1">{formErrors.customerName}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="alternative-phone" className="text-sm font-medium text-gray-700">
                              Phone Number
                            </Label>
                            <Input
                              id="alternative-phone"
                              className="mt-1"
                              placeholder="Contact number"
                              value={formData.phoneNumber}
                              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="alternate-email" className="text-sm font-medium text-gray-700">
                              Email Address *
                            </Label>
                            <Input
                              id="alternate-email"
                              type="email"
                              className="mt-1"
                              placeholder="customer@example.com"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                            />
                            {formErrors.email && <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>}
                          </div>
                          <div>
                            <Label htmlFor="cp-customer-id" className="text-sm font-medium text-gray-700">
                              Customer ID *
                            </Label>
                            <Input
                              id="cp-customer-id"
                              className="mt-1"
                              placeholder="CP-XXX-XXX"
                              value={formData.customerId}
                              onChange={(e) => handleInputChange("customerId", e.target.value)}
                            />
                            {formErrors.customerId && (
                              <p className="text-sm text-red-600 mt-1">{formErrors.customerId}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Assignment & Timeline</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="promise-date" className="text-sm font-medium text-gray-700">
                              Promise Date
                            </Label>
                            <Input
                              id="promise-date"
                              type="date"
                              className="mt-1"
                              value={formData.promiseDate}
                              onChange={(e) => handleInputChange("promiseDate", e.target.value)}
                            />
                            {formErrors.promiseDate && (
                              <p className="text-sm text-red-600 mt-1">{formErrors.promiseDate}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="estimated-hours" className="text-sm font-medium text-gray-700">
                              Estimated Hours
                            </Label>
                            <Input
                              id="estimated-hours"
                              type="number"
                              className="mt-1"
                              placeholder="0"
                              value={formData.estimatedHours}
                              onChange={(e) => handleInputChange("estimatedHours", e.target.value)}
                            />
                            {formErrors.estimatedHours && (
                              <p className="text-sm text-red-600 mt-1">{formErrors.estimatedHours}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
                            Detailed Description *
                          </Label>
                          <Textarea
                            id="reason"
                            className="mt-1"
                            placeholder="Provide detailed information about the issue"
                            rows={4}
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                          />
                          {formErrors.description && (
                            <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Options</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="recurring-issue"
                              checked={formData.isRecurring}
                              onCheckedChange={(checked) => handleInputChange("isRecurring", checked as boolean)}
                            />
                            <Label htmlFor="recurring-issue" className="text-sm text-gray-700">
                              This is a recurring issue
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="parent-ticket"
                              checked={formData.hasParentTicket}
                              onCheckedChange={(checked) => handleInputChange("hasParentTicket", checked as boolean)}
                            />
                            <Label htmlFor="parent-ticket" className="text-sm text-gray-700">
                              This ticket has a parent ticket
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateTicketDialogOpen(false)}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                          {isSubmitting ? "Creating..." : "Create Ticket"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tickets Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Support Tickets</CardTitle>
            <CardDescription>Overview and management of all support tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Ticket Info</TableHead>
                    <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                    <TableHead className="font-semibold text-gray-700">Assignment</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Priority</TableHead>
                    <TableHead className="font-semibold text-gray-700">Timeline</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets
                    .filter(
                      (ticket) =>
                        searchTerm === "" ||
                        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((ticket, index) => (
                      <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="py-4">
                          <div>
                            <div className="font-medium text-gray-900 mb-1">{ticket.title}</div>
                            <div className="text-sm text-gray-500">ID: {ticket.ticketId}</div>
                            <div className="text-xs text-gray-400">
                              {ticket.category} • {ticket.businessUnit}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div>
                            <div className="font-medium text-gray-900">{ticket.cpCustomerId}</div>
                            <div className="text-sm text-gray-500">Customer ID</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div>
                            <div className="font-medium text-gray-900">{ticket.assignedUser}</div>
                            <div className="text-sm text-gray-500">{ticket.assignedQueue}</div>
                            <div className="text-xs text-gray-400">{ticket.level1}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(ticket.status)}
                              <Badge className={`${getStatusColor(ticket.status)} border font-medium`}>
                                {ticket.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500">{ticket.subStatus}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={`${getPriorityColor(ticket.priority)} border font-medium`}>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="text-sm">
                            <div className="text-gray-900">Created: {ticket.createdDate}</div>
                            <div className="text-gray-500">Modified: {ticket.modifiedDate}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-blue-50 hover:text-blue-700"
                              onClick={() => handleViewTicket(ticket)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-green-50 hover:text-green-700"
                              onClick={() => handleEditTicket(ticket)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleDeleteTicket(ticket)}
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

        {/* View Ticket Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Ticket Details</DialogTitle>
              <DialogDescription>View complete information for {selectedTicket?.ticketId}</DialogDescription>
            </DialogHeader>
            {selectedTicket && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Ticket ID</Label>
                    <p className="text-sm text-gray-900 mt-1">{selectedTicket.ticketId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                    <div className="mt-1">
                      <Badge className={`${getStatusColor(selectedTicket.status)} border font-medium`}>
                        {selectedTicket.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Priority</Label>
                    <div className="mt-1">
                      <Badge className={`${getPriorityColor(selectedTicket.priority)} border font-medium`}>
                        {selectedTicket.priority}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Category</Label>
                    <p className="text-sm text-gray-900 mt-1">{selectedTicket.category}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Title</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedTicket.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Customer Name</Label>
                    <p className="text-sm text-gray-900 mt-1">{selectedTicket.customerName || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Customer ID</Label>
                    <p className="text-sm text-gray-900 mt-1">{selectedTicket.cpCustomerId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Phone</Label>
                    <p className="text-sm text-gray-900 mt-1">{selectedTicket.phoneNumber || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <p className="text-sm text-gray-900 mt-1">{selectedTicket.email || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedTicket.description || "No description provided"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Assigned User</Label>
                    <p className="text-sm text-gray-900 mt-1">{selectedTicket.assignedUser}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Queue</Label>
                    <p className="text-sm text-gray-900 mt-1">{selectedTicket.assignedQueue}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Created</Label>
                    <p className="text-sm text-gray-900 mt-1">{selectedTicket.createdDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Last Modified</Label>
                    <p className="text-sm text-gray-900 mt-1">{selectedTicket.modifiedDate}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Ticket Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Edit Ticket</DialogTitle>
              <DialogDescription>Update ticket information for {selectedTicket?.ticketId}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="grid gap-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Ticket Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-ticket-title" className="text-sm font-medium text-gray-700">
                      Title *
                    </Label>
                    <Input
                      id="edit-ticket-title"
                      className="mt-1"
                      placeholder="Brief description of the issue"
                      value={editFormData.title}
                      onChange={(e) => handleEditInputChange("title", e.target.value)}
                    />
                    {formErrors.title && <p className="text-sm text-red-600 mt-1">{formErrors.title}</p>}
                  </div>
                  <div>
                    <Label htmlFor="edit-ticket-business-unit" className="text-sm font-medium text-gray-700">
                      Business Unit *
                    </Label>
                    <Select
                      value={editFormData.businessUnit}
                      onValueChange={(value) => handleEditInputChange("businessUnit", value)}
                    >
                      <SelectTrigger id="edit-ticket-business-unit" className="mt-1">
                        <SelectValue placeholder="Select Business Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="support">Customer Support</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing Department</SelectItem>
                        <SelectItem value="sales">Sales Team</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.businessUnit && <p className="text-sm text-red-600 mt-1">{formErrors.businessUnit}</p>}
                  </div>
                  <div>
                    <Label htmlFor="edit-ticket-category" className="text-sm font-medium text-gray-700">
                      Category *
                    </Label>
                    <Select
                      value={editFormData.category}
                      onValueChange={(value) => handleEditInputChange("category", value)}
                    >
                      <SelectTrigger id="edit-ticket-category" className="mt-1">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="billing">Billing Issue</SelectItem>
                        <SelectItem value="connectivity">Connectivity Problem</SelectItem>
                        <SelectItem value="account">Account Management</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.category && <p className="text-sm text-red-600 mt-1">{formErrors.category}</p>}
                  </div>
                  <div>
                    <Label htmlFor="edit-ticket-priority" className="text-sm font-medium text-gray-700">
                      Priority *
                    </Label>
                    <Select
                      value={editFormData.priority}
                      onValueChange={(value) => handleEditInputChange("priority", value)}
                    >
                      <SelectTrigger id="edit-ticket-priority" className="mt-1">
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical - Service Down</SelectItem>
                        <SelectItem value="high">High - Major Impact</SelectItem>
                        <SelectItem value="medium">Medium - Minor Impact</SelectItem>
                        <SelectItem value="low">Low - General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.priority && <p className="text-sm text-red-600 mt-1">{formErrors.priority}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-customer-name" className="text-sm font-medium text-gray-700">
                      Customer Name *
                    </Label>
                    <Input
                      id="edit-customer-name"
                      className="mt-1"
                      placeholder="Full name"
                      value={editFormData.customerName}
                      onChange={(e) => handleEditInputChange("customerName", e.target.value)}
                    />
                    {formErrors.customerName && <p className="text-sm text-red-600 mt-1">{formErrors.customerName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="edit-alternative-phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="edit-alternative-phone"
                      className="mt-1"
                      placeholder="Contact number"
                      value={editFormData.phoneNumber}
                      onChange={(e) => handleEditInputChange("phoneNumber", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-alternate-email" className="text-sm font-medium text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="edit-alternate-email"
                      type="email"
                      className="mt-1"
                      placeholder="customer@example.com"
                      value={editFormData.email}
                      onChange={(e) => handleEditInputChange("email", e.target.value)}
                    />
                    {formErrors.email && <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="edit-cp-customer-id" className="text-sm font-medium text-gray-700">
                      Customer ID *
                    </Label>
                    <Input
                      id="edit-cp-customer-id"
                      className="mt-1"
                      placeholder="CP-XXX-XXX"
                      value={editFormData.customerId}
                      onChange={(e) => handleEditInputChange("customerId", e.target.value)}
                    />
                    {formErrors.customerId && <p className="text-sm text-red-600 mt-1">{formErrors.customerId}</p>}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-reason" className="text-sm font-medium text-gray-700">
                  Detailed Description *
                </Label>
                <Textarea
                  id="edit-reason"
                  className="mt-1"
                  placeholder="Provide detailed information about the issue"
                  rows={4}
                  value={editFormData.description}
                  onChange={(e) => handleEditInputChange("description", e.target.value)}
                />
                {formErrors.description && <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Ticket"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete ticket{" "}
                <span className="font-semibold">{selectedTicket?.ticketId}</span> and remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
                Delete Ticket
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
