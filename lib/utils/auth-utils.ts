// This file provides utilities that work in both client and server contexts

import { cookies } from "next/headers"

// Type definitions
export type UserData = {
  id: string
  email: string
  role?: string
  name?: string
  avatar_url?: string
} | null

// Client-side user data fetching
export async function fetchUserData() {
  try {
    const res = await fetch("/api/user")
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

// Server-side user data fetching (only for app directory)
export function getServerUserData() {
  // This function should only be called in a server context
  if (typeof window !== "undefined") {
    throw new Error("getServerUserData should only be called on the server")
  }

  try {
    // This will only work in a Server Component
    const cookieStore = cookies()
    // Implementation would depend on your auth setup
    // This is a placeholder
    return null
  } catch (error) {
    // If cookies() fails (in pages directory), return null
    return null
  }
}

// Safe function that works in both client and server
export function getUserData() {
  // Check if we're on the server
  if (typeof window === "undefined") {
    try {
      // Try to use server method, but catch errors
      return getServerUserData()
    } catch (error) {
      // If it fails (e.g., in pages directory), return null
      return null
    }
  } else {
    // We're on the client, so we can't use this synchronously
    // Return null, and the component should use the hook instead
    return null
  }
}
