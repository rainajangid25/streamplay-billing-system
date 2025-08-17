'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('🚨 ERROR BOUNDARY CAUGHT ERROR:', error)
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ERROR BOUNDARY - Full error details:', error, errorInfo)
    
    // Log navigation-related errors specifically
    if (error.message.includes('navigation') || error.message.includes('router') || error.message.includes('href')) {
      console.error('🚨 NAVIGATION ERROR DETECTED:', error.message)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback
      
      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-red-200">
            <h2 className="text-xl font-bold text-red-700 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              An error occurred while rendering this page. Check the console for details.
            </p>
            <button
              onClick={this.resetError}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Try again
            </button>
            {this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-500">Error details</summary>
                <pre className="mt-2 text-xs text-red-600 overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
