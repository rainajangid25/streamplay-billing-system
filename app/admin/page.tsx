'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Crown,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Activity,
  Pause,
  Play,
  X,
  Edit,
  Eye,
  Ban,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { getAllMockUsers, User } from '@/lib/auth-client'
import { SubscriptionAnalytics } from '@/lib/subscription'
import { useBillingStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

export default function AdminDashboard() {
  const { toast } = useToast()
  const { 
    customers, 
    subscriptions, 
    updateCustomer, 
    updateSubscription,
    isLoading,
    lastUpdated 
  } = useBillingStore()
  
  const [filteredUsers, setFilteredUsers] = useState(customers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    // Load metrics
    const loadMetrics = async () => {
      const analyticsData = await SubscriptionAnalytics.getMetrics()
      setMetrics(analyticsData)
    }
    
    loadMetrics()
  }, [])

  // Update filtered users when customers change
  useEffect(() => {
    setFilteredUsers(customers)
  }, [customers, lastUpdated.customers])

  useEffect(() => {
    // Filter users based on search and filters
    let filtered = customers

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.subscription_status === statusFilter)
    }

    if (planFilter !== 'all') {
      filtered = filtered.filter(user => user.plan === planFilter)
    }

    setFilteredUsers(filtered)
  }, [customers, searchTerm, statusFilter, planFilter])

  const handleUserAction = async (action: string, user: any) => {
    try {
      let message = ''
      
      switch (action) {
        case 'pause':
          updateCustomer(user.id, { subscription_status: 'paused' })
          // Also update the subscription
          const userSub = subscriptions.find(s => s.user_id === user.id)
          if (userSub) {
            updateSubscription(userSub.id, { status: 'paused' })
          }
          message = `Subscription paused for ${user.name}`
          break
        case 'resume':
          updateCustomer(user.id, { subscription_status: 'active' })
          const resumeSub = subscriptions.find(s => s.user_id === user.id)
          if (resumeSub) {
            updateSubscription(resumeSub.id, { status: 'active' })
          }
          message = `Subscription resumed for ${user.name}`
          break
        case 'cancel':
          updateCustomer(user.id, { subscription_status: 'cancelled' })
          const cancelSub = subscriptions.find(s => s.user_id === user.id)
          if (cancelSub) {
            updateSubscription(cancelSub.id, { 
              status: 'cancelled',
              cancel_date: new Date().toISOString(),
              auto_renew: false
            })
          }
          message = `Subscription cancelled for ${user.name}`
          break
        case 'email':
          message = `Email sent to ${user.name}`
          break
        default:
          message = `Action completed for ${user.name}`
      }

      toast({
        title: "Action Successful",
        description: message,
      })
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Please try again later.",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: { variant: "default", className: "bg-green-100 text-green-800", icon: CheckCircle },
      paused: { variant: "secondary", className: "bg-yellow-100 text-yellow-800", icon: Pause },
      cancelled: { variant: "destructive", className: "bg-red-100 text-red-800", icon: X },
      inactive: { variant: "outline", className: "bg-gray-100 text-gray-800", icon: AlertCircle }
    }

    const config = variants[status] || variants.inactive
    const Icon = config.icon

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    )
  }

  const getPlanBadge = (plan: string) => {
    const colors: Record<string, string> = {
      basic: "bg-blue-100 text-blue-800",
      mega: "bg-purple-100 text-purple-800",
      premium: "bg-orange-100 text-orange-800"
    }

    return (
      <Badge className={colors[plan] || "bg-gray-100 text-gray-800"}>
        <Crown className="h-3 w-3 mr-1" />
        {plan?.charAt(0).toUpperCase() + plan?.slice(1)}
      </Badge>
    )
  }

  if (!metrics) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage customers, subscriptions, and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Mail className="h-4 w-4 mr-2" />
            Send Broadcast
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSubscribers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{metrics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeSubscribers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              {((metrics.activeSubscribers / metrics.totalSubscribers) * 100).toFixed(1)}% active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.churnRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1 text-green-500" />
              -0.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="mega">Mega</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customer Table */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>
                Showing {filteredUsers.length} of {users.length} customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription End</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.plan && getPlanBadge(user.plan)}
                      </TableCell>
                      <TableCell>
                        {user.subscription_status && getStatusBadge(user.subscription_status)}
                      </TableCell>
                      <TableCell>
                        {user.subscription_end_date ? (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{new Date(user.subscription_end_date).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsUserDialogOpen(true)
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserAction('email', user)}
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                          {user.subscription_status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction('pause', user)}
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction('resume', user)}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-blue-500" />
                      <span>Basic</span>
                    </div>
                    <span className="font-semibold">{metrics.planDistribution.basic}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-purple-500" />
                      <span>Mega</span>
                    </div>
                    <span className="font-semibold">{metrics.planDistribution.mega}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-orange-500" />
                      <span>Premium</span>
                    </div>
                    <span className="font-semibold">{metrics.planDistribution.premium}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>ARPU</span>
                    <span className="font-semibold">₹{metrics.averageRevenuePerUser}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Monthly</span>
                    <span className="font-semibold">₹{metrics.monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Annual</span>
                    <span className="font-semibold">₹{metrics.annualRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retention Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Retention Rate</span>
                    <span className="font-semibold text-green-600">{metrics.retentionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Churn Rate</span>
                    <span className="font-semibold text-red-600">{metrics.churnRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Paused</span>
                    <span className="font-semibold">{metrics.pausedSubscribers}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Comprehensive analytics and insights coming soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Advanced analytics features will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">System settings will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Detail Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View and manage customer information
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.name} />
                  <AvatarFallback className="text-lg">{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  {selectedUser.subscription_status && getStatusBadge(selectedUser.subscription_status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer ID</Label>
                  <p className="text-sm text-gray-600">{selectedUser.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-gray-600">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Plan</Label>
                  <p className="text-sm text-gray-600">{selectedUser.plan || 'No plan'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Member Since</Label>
                  <p className="text-sm text-gray-600">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => selectedUser && handleUserAction('email', selectedUser)}>
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
