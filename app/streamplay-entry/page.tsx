'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useBillingStore, useCurrentCustomer } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function StreamPlayEntryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { customer } = useCurrentCustomer()
  const { customers } = useBillingStore()

  useEffect(() => {
    const email = searchParams?.get('email')
    const name = searchParams?.get('name')
    const streamplayId = searchParams?.get('streamplay_id')
    const source = searchParams?.get('source')
    const autoCreate = searchParams?.get('auto_create')

    // Give a moment for store to hydrate
    const timer = setTimeout(() => {
      if (!email || source !== 'streamplay') {
        // Invalid parameters, redirect to change-plan
        router.push('/change-plan')
        return
      }

      // Check if user exists by email
      const existingCustomer = customers.find(c => c.email === email)
      
      if (existingCustomer) {
        // EXISTING USER FLOW: Email found → Go to My Plan page
        console.log('Existing user detected:', existingCustomer.email)
        const params = new URLSearchParams()
        
        // Pass through parameters for context
        if (email) params.set('email', email)
        if (name) params.set('name', name)
        if (streamplayId) params.set('streamplay_id', streamplayId)
        if (source) params.set('source', source)
        params.set('returning_user', 'true')
        
        router.push(`/my-plan?${params.toString()}`)
      } else {
        // NEW USER FLOW: Email not found → Go to Plan Selection
        console.log('New user detected:', email)
        const params = new URLSearchParams()
        
        if (email) params.set('email', email)
        if (name) params.set('name', name)
        if (streamplayId) params.set('streamplay_id', streamplayId)
        if (source) params.set('source', source)
        if (autoCreate) params.set('auto_create', autoCreate)
        params.set('new_user', 'true')
        
        router.push(`/change-plan?${params.toString()}`)
      }
    }, 500) // Wait 500ms for store hydration

    return () => clearTimeout(timer)
  }, [searchParams, customers, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <Card className="w-96">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">StreamPlay Integration</CardTitle>
          <CardDescription>Connecting you to your billing dashboard...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="text-gray-300">Determining user flow...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
