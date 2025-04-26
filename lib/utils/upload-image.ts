import { createClient } from "@/lib/supabase/client"

export async function uploadProfileImage(file: File, userId: string): Promise<string | null> {
  try {
    const supabase = createClient()

    // Create a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `profiles/${fileName}`

    // Upload the file
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (uploadError) {
      throw uploadError
    }

    // Get the public URL
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    return null
  }
}

export async function uploadPostImage(file: File, userId: string): Promise<string | null> {
  try {
    const supabase = createClient()

    // Create a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `post-${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `posts/${fileName}`

    // Upload the file
    const { error: uploadError } = await supabase.storage.from("posts").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (uploadError) {
      throw uploadError
    }

    // Get the public URL
    const { data } = supabase.storage.from("posts").getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error("Error uploading post image:", error)
    return null
  }
}

// Add the generic uploadImage function that was missing
export async function uploadImage(
  file: File,
  userId: string,
  bucket = "avatars",
  prefix = "profiles",
): Promise<string | null> {
  try {
    const supabase = createClient()

    // Create a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${prefix}-${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${prefix}/${fileName}`

    // Upload the file
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (uploadError) {
      throw uploadError
    }

    // Get the public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    return null
  }
}
