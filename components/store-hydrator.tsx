'use client'

import { useEffect } from 'react'
import { hydrateStores, useBillingStore } from '@/lib/store'

export function StoreHydrator() {
  const { customers } = useBillingStore()
  
  useEffect(() => {
    // Hydrate stores on client side
    console.log('StoreHydrator: Starting hydration...')
    hydrateStores()
    console.log('StoreHydrator: Hydration completed, customers:', customers)
  }, [])

  useEffect(() => {
    console.log('StoreHydrator: Customers data changed:', customers.length, customers)
  }, [customers])

  return null // This component doesn't render anything
}
