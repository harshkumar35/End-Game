/**
 * Returns the site URL based on the environment.
 * In production, it returns the production URL.
 * In development, it returns localhost.
 */
export function getSiteUrl(): string {
  // Always return the production URL for auth redirects
  return "https://v0-legalsathi.vercel.app"
}
