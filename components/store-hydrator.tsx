'use client'

import { useEffect } from 'react'
import { hydrateStores, useBillingStore } from '@/lib/store'

export function StoreHydrator() {
  const { customers } = useBillingStore()
  
  useEffect(() => {
    // Hydrate stores on client side
    console.log('Hydrating stores...')
    hydrateStores()
    console.log('Stores hydrated, customers:', customers)
  }, [])

  useEffect(() => {
    console.log('Store hydrator - customers changed:', customers)
  }, [customers])

  return null // This component doesn't render anything
}
