// Payment processing client utilities
export interface PaymentMethod {
  id: string
  type: 'card' | 'crypto' | 'bank'
  last4?: string
  brand?: string
  wallet_address?: string
  is_default: boolean
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  payment_method: string
  customer_id: string
}

export interface CryptoPayment {
  address: string
  amount: number
  currency: 'BTC' | 'ETH' | 'USDC'
  network: string
  tx_hash?: string
}

// Mock payment methods
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_card_1234',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    is_default: true
  },
  {
    id: 'pm_crypto_5678',
    type: 'crypto',
    wallet_address: '0x742d35...83Ad',
    is_default: false
  }
]

// Payment utilities
export const formatCardNumber = (number: string): string => {
  return number.replace(/(\d{4})(?=\d)/g, '$1 ')
}

export const validateCardNumber = (number: string): boolean => {
  const cleaned = number.replace(/\s/g, '')
  return /^\d{13,19}$/.test(cleaned)
}

export const formatCryptoAddress = (address: string): string => {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export class PaymentClient {
  static async createPaymentIntent(amount: number, currency: string, customer_id: string): Promise<PaymentIntent> {
    // Mock implementation
    return {
      id: `pi_${Date.now()}`,
      amount,
      currency,
      status: 'pending',
      payment_method: 'pm_card_1234',
      customer_id
    }
  }

  static async confirmPayment(payment_intent_id: string): Promise<PaymentIntent> {
    // Mock implementation
    return {
      id: payment_intent_id,
      amount: 1999,
      currency: 'USD',
      status: 'succeeded',
      payment_method: 'pm_card_1234',
      customer_id: 'cus_123'
    }
  }

  static async createCryptoPayment(amount: number, currency: 'BTC' | 'ETH' | 'USDC'): Promise<CryptoPayment> {
    // Mock implementation
    const addresses = {
      BTC: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      ETH: '0x742d35Cc6634C0532925a3b8D46ee4734f6666',
      USDC: '0x742d35Cc6634C0532925a3b8D46ee4734f6666'
    }

    return {
      address: addresses[currency],
      amount,
      currency,
      network: currency === 'BTC' ? 'bitcoin' : 'ethereum'
    }
  }
}