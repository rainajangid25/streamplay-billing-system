import { createClient } from "@supabase/supabase-js"
import { getStreamPlayService, isStreamPlayMockMode } from "./mock-streamplay-service"

const supabase = createClient(process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface User {
  id: string
  email: string
  name: string
  subscription_status: "active" | "inactive" | "cancelled" | "trial"
  subscription_plan?: string
  streamplay_user_id?: string
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  email: string
  name: string
  subscription_plan?: string
  streamplay_user_id?: string
}

export class UserService {
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      // If in mock mode, create a mock StreamPlay user first
      if (isStreamPlayMockMode() && !userData.streamplay_user_id) {
        const streamPlayService = await getStreamPlayService()

        // Generate a mock StreamPlay user ID
        const mockStreamPlayUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        userData.streamplay_user_id = mockStreamPlayUserId
      }

      const { data, error } = await supabase
        .from("customers")
        .insert({
          name: userData.name,
          email: userData.email,
          subscription_status: "inactive",
          subscription_plan: userData.subscription_plan || null,
          streamplay_user_id: userData.streamplay_user_id || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating user:", error)
        throw new Error(`Failed to create user: ${error.message}`)
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        subscription_status: data.subscription_status,
        subscription_plan: data.subscription_plan,
        streamplay_user_id: data.streamplay_user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (error) {
      console.error("UserService.createUser error:", error)
      throw error
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

      if (error) {
        if (error.code === "PGRST116") {
          return null // User not found
        }
        throw new Error(`Failed to get user: ${error.message}`)
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        subscription_status: data.subscription_status,
        subscription_plan: data.subscription_plan,
        streamplay_user_id: data.streamplay_user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (error) {
      console.error("UserService.getUserById error:", error)
      throw error
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.from("customers").select("*").eq("email", email).single()

      if (error) {
        if (error.code === "PGRST116") {
          return null // User not found
        }
        throw new Error(`Failed to get user by email: ${error.message}`)
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        subscription_status: data.subscription_status,
        subscription_plan: data.subscription_plan,
        streamplay_user_id: data.streamplay_user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (error) {
      console.error("UserService.getUserByEmail error:", error)
      throw error
    }
  }

  async getUserByStreamPlayId(streamplayUserId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("streamplay_user_id", streamplayUserId)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          return null // User not found
        }
        throw new Error(`Failed to get user by StreamPlay ID: ${error.message}`)
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        subscription_status: data.subscription_status,
        subscription_plan: data.subscription_plan,
        streamplay_user_id: data.streamplay_user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (error) {
      console.error("UserService.getUserByStreamPlayId error:", error)
      throw error
    }
  }

  async updateUser(id: string, updates: Partial<CreateUserData & { subscription_status: string }>): Promise<User> {
    try {
      const { data, error } = await supabase
        .from("customers")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update user: ${error.message}`)
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        subscription_status: data.subscription_status,
        subscription_plan: data.subscription_plan,
        streamplay_user_id: data.streamplay_user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (error) {
      console.error("UserService.updateUser error:", error)
      throw error
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("customers").delete().eq("id", id)

      if (error) {
        throw new Error(`Failed to delete user: ${error.message}`)
      }

      return true
    } catch (error) {
      console.error("UserService.deleteUser error:", error)
      throw error
    }
  }

  async getAllUsers(limit = 50, offset = 0): Promise<{ users: User[]; total: number }> {
    try {
      // Get total count
      const { count, error: countError } = await supabase.from("customers").select("*", { count: "exact", head: true })

      if (countError) {
        throw new Error(`Failed to get user count: ${countError.message}`)
      }

      // Get users with pagination
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false })

      if (error) {
        throw new Error(`Failed to get users: ${error.message}`)
      }

      const users: User[] = data.map((item) => ({
        id: item.id,
        email: item.email,
        name: item.name,
        subscription_status: item.subscription_status,
        subscription_plan: item.subscription_plan,
        streamplay_user_id: item.streamplay_user_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }))

      return {
        users,
        total: count || 0,
      }
    } catch (error) {
      console.error("UserService.getAllUsers error:", error)
      throw error
    }
  }

  async syncWithStreamPlay(userId: string): Promise<User> {
    try {
      const user = await this.getUserById(userId)
      if (!user || !user.streamplay_user_id) {
        throw new Error("User not found or no StreamPlay ID")
      }

      const streamPlayService = await getStreamPlayService()
      const streamPlayUser = await streamPlayService.getUser(user.streamplay_user_id)

      if (!streamPlayUser) {
        throw new Error("StreamPlay user not found")
      }

      // Update local user with StreamPlay data
      const updatedUser = await this.updateUser(userId, {
        name: streamPlayUser.name,
        email: streamPlayUser.email,
        subscription_status: streamPlayUser.subscription_status,
        subscription_plan: streamPlayUser.subscription_plan,
      })

      return updatedUser
    } catch (error) {
      console.error("UserService.syncWithStreamPlay error:", error)
      throw error
    }
  }

  async createSubscription(userId: string, planId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await this.getUserById(userId)
      if (!user) {
        return { success: false, error: "User not found" }
      }

      if (!user.streamplay_user_id) {
        return { success: false, error: "User not linked to StreamPlay" }
      }

      const streamPlayService = await getStreamPlayService()
      const result = await streamPlayService.createSubscription(user.streamplay_user_id, planId)

      if (result.success) {
        // Update local user
        await this.updateUser(userId, {
          subscription_status: "active",
          subscription_plan: planId,
        })
      }

      return result
    } catch (error) {
      console.error("UserService.createSubscription error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  async cancelSubscription(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await this.getUserById(userId)
      if (!user) {
        return { success: false, error: "User not found" }
      }

      if (!user.streamplay_user_id) {
        return { success: false, error: "User not linked to StreamPlay" }
      }

      const streamPlayService = await getStreamPlayService()
      const result = await streamPlayService.cancelSubscription(user.streamplay_user_id)

      if (result.success) {
        // Update local user
        await this.updateUser(userId, {
          subscription_status: "cancelled",
        })
      }

      return result
    } catch (error) {
      console.error("UserService.cancelSubscription error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}

// Export singleton instance
export const userService = new UserService()
