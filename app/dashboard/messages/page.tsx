"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Search, MessageSquare, MessagesSquare, Loader2 } from "lucide-react"
import { ChatInterface } from "@/components/chat/chat-interface"
import { cn } from "@/lib/utils"

export default function MessagesPage() {
  const router = useRouter()
  const { supabase, user, isLoading: authLoading } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const [contacts, setContacts] = useState<any[]>([])
  const [activeContact, setActiveContact] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!user) return

    const fetchContacts = async () => {
      setIsLoading(true)
      try {
        // Get all distinct users that the current user has communicated with
        const { data: sentMessages, error: sentError } = await supabase
          .from("messages")
          .select("receiver_id")
          .eq("sender_id", user.id)
          .order("created_at", { ascending: false })

        if (sentError) throw sentError

        const { data: receivedMessages, error: receivedError } = await supabase
          .from("messages")
          .select("sender_id")
          .eq("receiver_id", user.id)
          .order("created_at", { ascending: false })

        if (receivedError) throw receivedError

        // Combine and get unique user IDs
        const senderIds = receivedMessages.map((msg) => msg.sender_id)
        const receiverIds = sentMessages.map((msg) => msg.receiver_id)
        const uniqueUserIds = [...new Set([...senderIds, ...receiverIds])]

        if (uniqueUserIds.length > 0) {
          const { data: users, error: usersError } = await supabase.from("users").select("*").in("id", uniqueUserIds)

          if (usersError) throw usersError

          // Get latest message for each contact
          const contactsWithLastMessage = await Promise.all(
            users.map(async (contact) => {
              const { data: lastMessage, error: msgError } = await supabase
                .from("messages")
                .select("*")
                .or(`sender_id.eq.${contact.id},receiver_id.eq.${contact.id}`)
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order("created_at", { ascending: false })
                .limit(1)

              if (msgError) throw msgError

              return {
                ...contact,
                lastMessage: lastMessage && lastMessage.length > 0 ? lastMessage[0] : null,
                unreadCount: 0, // We'll calculate this in the next step
              }
            }),
          )

          // Get unread count for each contact
          const contactsWithUnreadCount = await Promise.all(
            contactsWithLastMessage.map(async (contact) => {
              const { data, error: countError } = await supabase
                .from("messages")
                .select("*", { count: "exact" })
                .eq("sender_id", contact.id)
                .eq("receiver_id", user.id)
                .eq("is_read", false)

              if (countError) throw countError

              return {
                ...contact,
                unreadCount: data?.length || 0,
              }
            }),
          )

          // Sort by latest message
          contactsWithUnreadCount.sort((a, b) => {
            const aDate = a.lastMessage ? new Date(a.lastMessage.created_at).getTime() : 0
            const bDate = b.lastMessage ? new Date(b.lastMessage.created_at).getTime() : 0
            return bDate - aDate
          })

          setContacts(contactsWithUnreadCount)

          // Set first contact as active if none is selected
          if (!activeContact && contactsWithUnreadCount.length > 0) {
            setActiveContact(contactsWithUnreadCount[0])
          }
        }
      } catch (error) {
        console.error("Error fetching contacts:", error)
        toast({
          title: "Error",
          description: "Failed to load your messages. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchContacts()

    // Set up real-time subscription to new messages
    const channel = supabase
      .channel("new-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          // Refresh contacts to update last message and unread count
          fetchContacts()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, user, router])

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push("/login?redirect=/dashboard/messages")
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Messages</h1>
        <p className="text-muted-foreground">Communicate with lawyers and clients</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="px-4">
              <div className="flex items-center gap-2 mb-2">
                <MessagesSquare className="h-5 w-5 text-primary" />
                <CardTitle>Contacts</CardTitle>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto px-4 pb-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Loading conversations...</p>
                </div>
              ) : filteredContacts.length > 0 ? (
                <div className="space-y-2">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-muted transition-colors",
                        activeContact?.id === contact.id && "bg-muted",
                      )}
                      onClick={() => setActiveContact(contact)}
                    >
                      <Avatar>
                        <AvatarImage src={contact.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>{contact.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{contact.full_name}</p>
                          {contact.lastMessage && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(contact.lastMessage.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {contact.lastMessage ? (
                            contact.lastMessage.sender_id === user?.id ? (
                              <span className="text-muted-foreground">You: {contact.lastMessage.content}</span>
                            ) : (
                              contact.lastMessage.content
                            )
                          ) : (
                            "No messages yet"
                          )}
                        </p>
                      </div>
                      {contact.unreadCount > 0 && (
                        <div className="min-w-[1.5rem] h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">{contact.unreadCount}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">No conversations yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchQuery ? "No contacts match your search" : "Start a conversation with a lawyer or client"}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {activeContact ? (
            <ChatInterface recipientId={activeContact.id} recipientName={activeContact.full_name} />
          ) : (
            <Card className="h-[700px] flex flex-col items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4 mx-auto" />
                <CardTitle className="mb-2">No conversation selected</CardTitle>
                <CardDescription className="mb-6">Select a contact from the list to start chatting</CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
