import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/types/database.types"

export function createClientSupabaseClient() {
  return createClientComponentClient<Database>()
}
