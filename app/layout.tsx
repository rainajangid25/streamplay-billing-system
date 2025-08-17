import './globals.css'
import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { StoreHydrator } from '@/components/store-hydrator'
import { ErrorBoundary } from '@/components/error-boundary'

export const metadata = {
  title: 'StreamPlay Billing - Smart Subscription Management',
  description:
    'AI-powered billing and subscription management system for StreamPlay with advanced analytics, multi-payment support, and seamless user experience',
  generator: 'v0.app',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true'

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <StoreHydrator />
            <LayoutWrapper defaultOpen={defaultOpen}>
              {children}
            </LayoutWrapper>
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}