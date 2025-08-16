"use client"

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, CheckCircle, WifiOff, Activity } from 'lucide-react'
import { useBillingStore } from '@/lib/store'

export function SyncIndicator() {
  const { lastUpdated, isLoading } = useBillingStore()
  const [isOnline, setIsOnline] = useState(true)
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced')
  
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
      setSyncStatus(navigator.onLine ? 'synced' : 'offline')
    }
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])
  
  useEffect(() => {
    const hasActiveLoading = Object.values(isLoading).some(loading => loading)
    if (hasActiveLoading && isOnline) {
      setSyncStatus('syncing')
    } else if (isOnline) {
      setSyncStatus('synced')
    }
  }, [isLoading, isOnline])
  
  const getLastUpdateTime = () => {
    const latest = Math.max(...Object.values(lastUpdated))
    const diff = Date.now() - latest
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    
    if (minutes > 0) {
      return `${minutes}m ago`
    } else if (seconds > 0) {
      return `${seconds}s ago`
    } else {
      return 'Just now'
    }
  }
  
  if (syncStatus === 'offline') {
    return (
      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
        <WifiOff className="h-3 w-3 mr-1" />
        Offline
      </Badge>
    )
  }
  
  if (syncStatus === 'syncing') {
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
        Syncing...
      </Badge>
    )
  }
  
  return (
    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
      <CheckCircle className="h-3 w-3 mr-1" />
      Synced • {getLastUpdateTime()}
    </Badge>
  )
}

export function DataFreshnessIndicator({ dataType }: { dataType: 'customers' | 'subscriptions' | 'products' | 'invoices' }) {
  const { lastUpdated, isLoading } = useBillingStore()
  
  const isDataLoading = isLoading[dataType]
  const lastUpdate = lastUpdated[dataType]
  
  const getTimeSinceUpdate = () => {
    const diff = Date.now() - lastUpdate
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (hours > 0) {
      return `${hours}h ago`
    } else if (minutes > 0) {
      return `${minutes}m ago`
    } else {
      return 'Fresh'
    }
  }
  
  const getDataStatus = () => {
    if (isDataLoading) {
      return { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: RefreshCw, 
        text: 'Updating...',
        animate: true
      }
    }
    
    const timeSince = Date.now() - lastUpdate
    if (timeSince < 30000) { // Less than 30 seconds
      return { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: CheckCircle, 
        text: 'Fresh',
        animate: false
      }
    } else if (timeSince < 300000) { // Less than 5 minutes
      return { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: Activity, 
        text: getTimeSinceUpdate(),
        animate: false
      }
    } else {
      return { 
        color: 'bg-orange-100 text-orange-800 border-orange-200', 
        icon: Activity, 
        text: getTimeSinceUpdate(),
        animate: false
      }
    }
  }
  
  const status = getDataStatus()
  const Icon = status.icon
  
  return (
    <Badge variant="secondary" className={`text-xs ${status.color}`}>
      <Icon className={`h-3 w-3 mr-1 ${status.animate ? 'animate-spin' : ''}`} />
      {status.text}
    </Badge>
  )
}
