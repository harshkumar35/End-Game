"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from "@/lib/types/database.types"

type RealtimeContextType = {
  newMessages: number
  newNotifications: number
  refreshData: () => void
}

const RealtimeContext = createContext<RealtimeContextType>({
  newMessages: 0,
  newNotifications: 0,
  refreshData: () => {},
})

export const useRealtime = () => useContext(RealtimeContext)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [newMessages, setNewMessages] = useState(0)
  const [newNotifications, setNewNotifications] = useState(0)
  const supabase = createClientComponentClient<Database>()
  const { toast } = useToast()

  const refreshData = async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) return

    // Get unread messages count
    const { count: messagesCount } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("receiver_id", sessionData.session.user.id)
      .eq("is_read", false)

    setNewMessages(messagesCount || 0)

    // Get new notifications count
    const { count: notificationsCount } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", sessionData.session.user.id)
      .eq("is_read", false)

    setNewNotifications(notificationsCount || 0)
  }

  useEffect(() => {
    refreshData()

    // Set up real-time subscriptions
    const messagesSubscription = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const { data: userData } = await supabase.auth.getUser()
          if (payload.new.receiver_id === userData.user?.id) {
            setNewMessages((prev) => prev + 1)
            toast({
              title: "New Message",
              description: "You have received a new message",
            })
          }
        },
      )
      .subscribe()

    const notificationsSubscription = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        async (payload) => {
          const { data: userData } = await supabase.auth.getUser()
          if (payload.new.user_id === userData.user?.id) {
            setNewNotifications((prev) => prev + 1)
            toast({
              title: "New Notification",
              description: payload.new.message,
            })
          }
        },
      )
      .subscribe()

    // Clean up subscriptions
    return () => {
      supabase.removeChannel(messagesSubscription)
      supabase.removeChannel(notificationsSubscription)
    }
  }, [supabase, toast])

  return (
    <RealtimeContext.Provider
      value={{
        newMessages,
        newNotifications,
        refreshData,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  )
}
