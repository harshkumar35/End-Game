"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Download, ArrowLeft, Loader2 } from "lucide-react"
import { jsPDF } from "jspdf"

export default function DocumentViewPage() {
  const router = useRouter()
  const params = useParams()
  const { supabase, user } = useSupabase()
  const [document, setDocument] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocument = async () => {
      if (!user || !params.id) return

      try {
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("id", params.id)
          .eq("uploaded_by", user.id)
          .single()

        if (error) throw error

        setDocument(data)
      } catch (error: any) {
        console.error("Error fetching document:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to fetch document. Please try again.",
          variant: "destructive",
        })
        router.push("/dashboard/documents")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocument()
  }, [supabase, user, params.id, router])

  const downloadAsPdf = () => {
    if (!document) return

    const doc = new jsPDF()
    const content = document.content
    const title = document.file_name || "Document"

    // Split content into lines
    const lines = content.split("\n")
    let y = 10
    doc.setFontSize(10)

    for (let i = 0; i < lines.length; i++) {
      if (y > 280) {
        doc.addPage()
        y = 10
      }
      doc.text(lines[i], 10, y)
      y += 5
    }

    doc.save(`${title}.pdf`)
  }

  const downloadAsDocx = () => {
    if (!document) return

    const content = document.content
    const title = document.file_name || "Document"

    // Create a Blob with the content
    const blob = new Blob([content], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })

    // Create a link element
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${title}.docx`

    // Append to the document, click it, and remove it
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Document Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The document you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button onClick={() => router.push("/dashboard/documents")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{document.file_name}</h1>
          <p className="text-muted-foreground">
            {document.template_type === "nda"
              ? "Non-Disclosure Agreement"
              : document.template_type === "consulting"
                ? "Consulting Agreement"
                : "Employment Agreement"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/documents")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" onClick={downloadAsPdf}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={downloadAsDocx}>
            <Download className="mr-2 h-4 w-4" />
            Download DOCX
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="bg-muted p-4 rounded-md max-h-[70vh] overflow-auto whitespace-pre-wrap font-mono text-sm">
            {document.content}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
