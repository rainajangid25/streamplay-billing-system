// Client-side authentication utilities
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  plan?: string
  subscription_status?: 'active' | 'inactive' | 'cancelled' | 'paused'
  subscription_end_date?: string
  created_at: string
  avatar_url?: string
}

export interface AuthSession {
  user: User | null
  isAuthenticated: boolean
  token?: string
}

// Mock user data for development
export const mockUsers: User[] = [
  {
    id: 'user_1',
    email: 'john.smith@email.com',
    name: 'John Smith',
    phone: '+91 9876543210',
    plan: 'mega',
    subscription_status: 'active',
    subscription_end_date: '2025-08-29',
    created_at: '2024-01-15T10:30:00Z',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_2',
    email: 'sarah.johnson@email.com',
    name: 'Sarah Johnson',
    phone: '+91 9876543211',
    plan: 'basic',
    subscription_status: 'active',
    subscription_end_date: '2025-03-15',
    created_at: '2024-02-20T14:20:00Z',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b6c2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_3',
    email: 'mike.wilson@email.com',
    name: 'Mike Wilson',
    phone: '+91 9876543212',
    plan: 'premium',
    subscription_status: 'cancelled',
    subscription_end_date: '2024-12-31',
    created_at: '2023-11-10T09:15:00Z',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_4',
    email: 'emma.davis@email.com',
    name: 'Emma Davis',
    phone: '+91 9876543213',
    plan: 'mega',
    subscription_status: 'paused',
    subscription_end_date: '2025-05-10',
    created_at: '2024-01-05T16:45:00Z',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_5',
    email: 'alex.chen@email.com',
    name: 'Alex Chen',
    phone: '+91 9876543214',
    plan: 'premium',
    subscription_status: 'active',
    subscription_end_date: '2025-12-20',
    created_at: '2023-12-20T11:20:00Z',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
  }
]

export function getMockUser(id: string): User | null {
  return mockUsers.find(user => user.id === id) || null
}

export function getAllMockUsers(): User[] {
  return mockUsers
}

export function getClientSession(): AuthSession {
  // In a real app, this would check localStorage, cookies, or make an API call
  // For demo purposes, return a mock authenticated session
  return {
    user: mockUsers[0], // Default to first user
    isAuthenticated: true,
    token: 'mock_token_123'
  }
}
