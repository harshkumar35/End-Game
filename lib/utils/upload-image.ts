import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export async function uploadImage(file: File, bucket: string, userId: string): Promise<string | null> {
  const supabase = createClientComponentClient()

  // Generate a unique file name
  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`

  // Upload the file
  const { data, error } = await supabase.storage.from(bucket).upload(`${userId}/${fileName}`, file)

  if (error) {
    console.error("Error uploading image:", error)
    return null
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(`${userId}/${fileName}`)

  return publicUrl
}

export async function uploadPostImage(file: File, userId: string): Promise<string | null> {
  return uploadImage(file, "posts", userId)
}

export async function uploadProfileImage(file: File, userId: string): Promise<string | null> {
  return uploadImage(file, "avatars", userId)
}

export async function uploadDocumentImage(file: File, userId: string): Promise<string | null> {
  return uploadImage(file, "documents", userId)
}
