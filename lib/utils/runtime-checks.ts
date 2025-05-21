// Helper functions to determine the runtime environment

// Check if we're running on the server
export function isServer() {
  return typeof window === "undefined"
}

// Check if we're running on the client
export function isClient() {
  return !isServer()
}

// Check if we're in a Next.js App Router environment
// This is a best-effort detection and may not be 100% accurate
export function isAppDirectory() {
  try {
    // Try to require a module that only exists in the App Router
    require("next/headers")
    return true
  } catch (e) {
    return false
  }
}

// Check if we're in a Pages Router environment
export function isPagesDirectory() {
  return isServer() && !isAppDirectory()
}
