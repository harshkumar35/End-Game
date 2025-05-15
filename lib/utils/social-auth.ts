import type { Provider } from "@supabase/supabase-js"

export async function handleSocialLogin(
  supabase: any,
  provider: Provider,
  redirectTo = "https://v0-legalsathi.vercel.app/auth/callback",
) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })

    if (error) throw error

    return { data, error: null }
  } catch (error: any) {
    console.error("Social login error:", error)
    return { data: null, error: error.message || "Failed to authenticate with social provider" }
  }
}
