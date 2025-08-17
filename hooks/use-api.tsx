"use client"

import { useState, useEffect } from 'react'

interface ApiResponse<T = any> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useApi<T = any>(endpoint: string): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Mock API responses for different endpoints
        const mockData = getMockData(endpoint)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (isMounted) {
          setData(mockData)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [endpoint])

  return { data, loading, error }
}

// Mock API call function for components that need it
export async function apiCall<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Return mock data
  const mockData = getMockData(endpoint)
  
  if (mockData === null) {
    throw new Error(`No mock data available for endpoint: ${endpoint}`)
  }
  
  return mockData as T
}

function getMockData(endpoint: string) {
  switch (endpoint) {
    case '/billing':
      return {
        totalRevenue: 2847392,
        fiatRevenue: 1985674,
        cryptoRevenue: 861718,
        nftSubscriptions: 1247,
        activeRegions: 47,
        currencies: 23,
        paymentMethods: [
          { name: "Credit Cards", volume: 1985674, percentage: 69.7, color: "#3B82F6" },
          { name: "USDC", volume: 485320, percentage: 17.0, color: "#2775CA" },
          { name: "ETH", volume: 256890, percentage: 9.0, color: "#627EEA" },
          { name: "MATIC", volume: 119508, percentage: 4.2, color: "#8247E5" },
        ],
      }
    
    case '/nft':
      return {
        passes: [
          {
            id: 1,
            name: "StreamPlay Gold",
            tier: "Gold",
            price: 0.5,
            currency: "ETH",
            floorPrice: 0.45,
            holders: 245,
            mintedToday: 12,
            benefits: [
              "4K Streaming Access",
              "Priority Support",
              "Exclusive Content",
              "Early Access Features"
            ]
          },
          {
            id: 2,
            name: "StreamPlay Platinum",
            tier: "Platinum",
            price: 1.2,
            currency: "ETH",
            floorPrice: 1.1,
            holders: 89,
            mintedToday: 5,
            benefits: [
              "8K Streaming Access",
              "VIP Support",
              "Premium Content",
              "Beta Features",
              "Revenue Sharing"
            ]
          }
        ],
        analytics: {
          totalHolders: 890,
          totalVolume: 47.2,
          retentionRate: 94.7,
          lifetimeValue: 2400000
        }
      }
    
    case '/ai':
      return {
        insights: {
          successRate: 87.3,
          avgRetryTime: 2.4,
          intelligentRouting: 94.7
        }
      }
    
    case '/blockchain':
      return {
        network: "Ethereum",
        gasPrice: "25 gwei",
        blockHeight: 18500000
      }
    
    default:
      return null
  }
}
