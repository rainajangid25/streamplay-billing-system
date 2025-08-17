"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Settings,
  Users,
  Package,
  DollarSign,
  Wrench,
  Ticket,
  Receipt,
  Calculator,
  Workflow,
  Truck,
  Network,
  HardDrive,
  Zap,
  UserCheck,
  Building,
  Shield,
  User,
  Crown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  
  // Test if JavaScript/console is working
  console.log('🚀 SIDEBAR LOADED - JavaScript is working!')
  console.log('📍 Current pathname on load:', pathname)

  const coreMenuItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      description: "Overview & Analytics",
    },
    {
      title: "My Account",
      href: "/my-plan",
      icon: User,
      description: "Account & Subscription",
    },
    {
      title: "Subscriber Management",
      href: "/subscriber-management",
      icon: UserCheck,
      description: "Customer Accounts",
    },
    {
      title: "Product Management",
      href: "/product-management",
      icon: Package,
      description: "Products & Packages",
    },
    {
      title: "Billing Management",
      href: "/billing-management",
      icon: Receipt,
      description: "Invoices & Payments",
    },
    {
      title: "Ticket Management",
      href: "/ticket-management",
      icon: Ticket,
      description: "Support Tickets",
    },
  ]

  const systemMenuItems = [
    {
      title: "Admin Dashboard",
      href: "/admin",
      icon: Crown,
    },
    {
      title: "System Management",
      href: "/system-management",
      icon: Settings,
    },
    {
      title: "User Administration",
      href: "/user-administration",
      icon: Users,
    },
    {
      title: "Revenue Management",
      href: "/revenue-management",
      icon: DollarSign,
    },
    {
      title: "Operations Management",
      href: "/operations-management",
      icon: Wrench,
    },
    {
      title: "Tax Management",
      href: "/tax-management",
      icon: Calculator,
    },
    {
      title: "Workflow Management",
      href: "/workflow-management",
      icon: Workflow,
    },
  ]

  const infrastructureMenuItems = [
    {
      title: "Dispatch",
      href: "/dispatch",
      icon: Truck,
    },
    {
      title: "Dispatch Administration",
      href: "/dispatch-administration",
      icon: Building,
    },
    {
      title: "Network IP Management",
      href: "/network-ip-management",
      icon: Network,
    },
    {
      title: "Network Infra Admin",
      href: "/network-infra-admin",
      icon: Shield,
    },
    {
      title: "Equipment Inventory",
      href: "/equipment-inventory",
      icon: HardDrive,
    },
  ]

  return (
    <Sidebar {...props} className="border-r bg-white">
      <SidebarHeader className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <Link href="/" className="flex items-center space-x-3 p-4">
          <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">GoBill AI</h1>
            <p className="text-xs text-blue-100">Global Billing Platform</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
            Core Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {coreMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="group relative rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 data-[active=true]:font-medium"
                  >
                    <Link 
                      href={item.href} 
                      className="flex items-center space-x-3 p-3"
                      onClick={(e) => {
                        console.log(`🔗 NAVIGATION ATTEMPT: ${item.href} (${item.title})`)
                        console.log('📍 Current pathname:', pathname)
                        console.log('🖱️ Click event:', e)
                        
                        // Check if default is prevented
                        if (e.defaultPrevented) {
                          console.log('⚠️ WARNING: Navigation event was prevented!')
                        }
                        
                        // ALTERNATIVE: Try direct window navigation if Next.js Link fails
                        if (item.href !== pathname) {
                          console.log('🔄 ATTEMPTING FALLBACK: Direct window navigation')
                          setTimeout(() => {
                            if (window.location.pathname === pathname) {
                              console.log('🔄 FALLBACK: Next.js Link failed, trying window.location')
                              window.location.href = item.href
                            }
                          }, 200)
                        }
                        
                        // Add small delay to see if navigation happens
                        setTimeout(() => {
                          console.log('⏰ Navigation check - current path:', window.location.pathname)
                          if (window.location.pathname === pathname) {
                            console.log('❌ NAVIGATION FAILED - Still on same page!')
                          } else {
                            console.log('✅ NAVIGATION SUCCESS - Page changed!')
                          }
                        }, 100)
                      }}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.title}</div>
                        <div className="text-xs text-gray-500 truncate">{item.description}</div>
                      </div>
                      {pathname === item.href && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
            System Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {systemMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="rounded-lg transition-all duration-200 hover:bg-gray-50 data-[active=true]:bg-gray-100 data-[active=true]:font-medium"
                  >
                    <Link href={item.href} className="flex items-center space-x-3 p-2">
                      <item.icon className="h-4 w-4 flex-shrink-0 text-gray-600" />
                      <span className="text-sm truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
            Infrastructure
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {infrastructureMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="rounded-lg transition-all duration-200 hover:bg-gray-50 data-[active=true]:bg-gray-100 data-[active=true]:font-medium"
                  >
                    <Link href={item.href} className="flex items-center space-x-3 p-2">
                      <item.icon className="h-4 w-4 flex-shrink-0 text-gray-600" />
                      <span className="text-sm truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">AI</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">AI Assistant</p>
            <p className="text-xs text-gray-500">Ready to help</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
            Online
          </Badge>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
