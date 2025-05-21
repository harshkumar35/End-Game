// This file provides compatibility functions for next/headers

// Type definitions
export type CookieStore = {
  get: (name: string) => { name: string; value: string } | undefined
  getAll: () => Array<{ name: string; value: string }>
}

export type HeadersStore = {
  get: (name: string) => string | null
  has: (name: string) => boolean
}

// Safe cookies function that works in both environments
export function getCookies(): CookieStore {
  // Check if we're on the server
  if (typeof window === "undefined") {
    try {
      // Try to import cookies from next/headers
      // This is a dynamic import to prevent webpack from including it at build time
      const { cookies } = require("next/headers")
      return cookies()
    } catch (error) {
      // If it fails (e.g., in pages directory), return a fallback
      return {
        get: () => undefined,
        getAll: () => [],
      }
    }
  } else {
    // We're on the client, return a client-side implementation
    return {
      get: (name) => {
        const value = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${name}=`))
          ?.split("=")[1]
        return value ? { name, value } : undefined
      },
      getAll: () => {
        return document.cookie.split("; ").map((cookie) => {
          const [name, value] = cookie.split("=")
          return { name, value }
        })
      },
    }
  }
}

// Safe headers function that works in both environments
export function getHeaders(): HeadersStore {
  // Check if we're on the server
  if (typeof window === "undefined") {
    try {
      // Try to import headers from next/headers
      const { headers } = require("next/headers")
      return headers()
    } catch (error) {
      // If it fails (e.g., in pages directory), return a fallback
      return {
        get: () => null,
        has: () => false,
      }
    }
  } else {
    // We're on the client, return a client-side implementation
    // Note: Client-side can't access request headers, so this is limited
    return {
      get: () => null,
      has: () => false,
    }
  }
}
