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
  
  // Routes that should not have the sidebar
  const noSidebarRoutes = ['/landing']
  const shouldShowSidebar = !noSidebarRoutes.includes(pathname)

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
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
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
        <main className="flex-1 overflow-auto p-0 bg-yellow-200" style={{ minHeight: '500px', display: 'block' }}>
          <div className="h-full bg-green-200 p-4" style={{ minHeight: '400px' }}>
            <p className="text-black font-bold bg-white p-2 border-2 border-red-500">🔥 DEBUG: Layout Wrapper Main Content Area - Children should appear below this line</p>
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}