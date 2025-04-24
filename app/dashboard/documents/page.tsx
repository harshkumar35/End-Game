"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { FileText, Trash2, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function DocumentsPage() {
  const router = useRouter()
  const { supabase, user } = useSupabase()
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("uploaded_by", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setDocuments(data || [])
      } catch (error: any) {
        console.error("Error fetching documents:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to fetch documents. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()

    // Set up real-time subscription
    const channel = supabase
      .channel("documents-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
          filter: `uploaded_by=eq.${user?.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setDocuments((prev) => [payload.new, ...prev])
          } else if (payload.eventType === "DELETE") {
            setDocuments((prev) => prev.filter((doc) => doc.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, user])

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase.from("documents").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully.",
      })
    } catch (error: any) {
      console.error("Error deleting document:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const viewDocument = (id: string) => {
    router.push(`/dashboard/documents/${id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
        <p className="text-muted-foreground">View and manage your legal documents</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted/50"></CardHeader>
              <CardContent className="h-12 mt-2 bg-muted/30"></CardContent>
              <CardFooter className="h-10 mt-2 bg-muted/20"></CardFooter>
            </Card>
          ))
        ) : documents.length > 0 ? (
          documents.map((doc) => (
            <Card key={doc.id} className="overflow-hidden hover:border-primary/20 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="truncate">{doc.file_name}</CardTitle>
                    <CardDescription>
                      {doc.template_type === "nda"
                        ? "Non-Disclosure Agreement"
                        : doc.template_type === "consulting"
                          ? "Consulting Agreement"
                          : "Employment Agreement"}
                    </CardDescription>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Created {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t">
                <Button variant="ghost" size="sm" onClick={() => viewDocument(doc.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteDocument(doc.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No documents yet</h3>
            <p className="text-muted-foreground mt-1">
              You haven't created any documents yet. Use the document generator to create one.
            </p>
            <Button className="mt-4 gradient-bg" onClick={() => router.push("/dashboard/document-generator")}>
              Create Document
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
