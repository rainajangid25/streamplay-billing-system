'use client'

import { useEffect } from 'react'
import { hydrateStores } from '@/lib/store'

export function StoreHydrator() {
  useEffect(() => {
    // Hydrate stores on client side
    hydrateStores()
  }, [])

  return null // This component doesn't render anything
}
