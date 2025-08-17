'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface LayoutWrapperProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export function LayoutWrapper({ children, defaultOpen }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Debug navigation
  console.log('LayoutWrapper - Current pathname:', pathname)
  
  // Routes that should not have the sidebar
  const noSidebarRoutes = ['/landing']
  const shouldShowSidebar = !noSidebarRoutes.includes(pathname)
  
  console.log('LayoutWrapper - Should show sidebar:', shouldShowSidebar)

  // Generate breadcrumbs based on pathname
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    
    if (pathname === '/') {
      return [{ label: 'StreamPlay Billing Hub', href: '/', isPage: true }]
    }
    
    const breadcrumbs = [{ label: 'StreamPlay Billing Hub', href: '/', isPage: false }]
    
    pathSegments.forEach((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/')
      const isPage = index === pathSegments.length - 1
      
      // Convert kebab-case to title case
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      breadcrumbs.push({ label, href, isPage })
    })
    
    return breadcrumbs
  }

  if (!shouldShowSidebar) {
    return <>{children}</>
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <div key={breadcrumb.href} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {breadcrumb.isPage ? (
                        <BreadcrumbPage className="text-sm font-medium text-gray-900">
                          {breadcrumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={breadcrumb.href}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          {breadcrumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="flex-1 p-4 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}