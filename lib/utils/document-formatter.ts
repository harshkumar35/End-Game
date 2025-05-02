import { jsPDF } from "jspdf"

interface DocumentOptions {
  title: string
  content: string
  fontSize?: number
  lineHeight?: number
  margin?: number
}

export function formatDocumentForPdf(options: DocumentOptions): jsPDF {
  const { title, content, fontSize = 10, lineHeight = 7, margin = 20 } = options

  // Create new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const maxWidth = pageWidth - margin * 2

  // Set font size and style
  doc.setFont("helvetica", "normal")
  doc.setFontSize(fontSize)

  // Start at top margin
  let y = margin

  // Add title
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text(title, pageWidth / 2, y, { align: "center" })
  y += lineHeight * 2
  doc.setFontSize(fontSize)
  doc.setFont("helvetica", "normal")

  // Split content into lines
  const lines = content.split("\n")

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    // Check if we need a new page
    if (y > pageHeight - margin) {
      doc.addPage()
      y = margin
    }

    // Handle empty lines
    if (lines[i].trim() === "") {
      y += lineHeight / 2
      continue
    }

    // Check if line is a heading (all caps or starts with number and period)
    const isHeading =
      (lines[i].toUpperCase() === lines[i] && lines[i].trim() !== "") ||
      /^\d+\./.test(lines[i]) ||
      lines[i].includes("BETWEEN:") ||
      lines[i].includes("WHEREAS:") ||
      lines[i].includes("IN CONNECTION WITH")

    if (isHeading) {
      doc.setFont("helvetica", "bold")
    } else {
      doc.setFont("helvetica", "normal")
    }

    // Split long lines
    const splitLines = doc.splitTextToSize(lines[i], maxWidth)

    // Add each split line
    for (let j = 0; j < splitLines.length; j++) {
      doc.text(splitLines[j], margin, y)
      y += lineHeight

      // Check if we need a new page after adding a line
      if (y > pageHeight - margin && j < splitLines.length - 1) {
        doc.addPage()
        y = margin
      }
    }
  }

  return doc
}

export function generatePdf(options: DocumentOptions): void {
  const doc = formatDocumentForPdf(options)
  doc.save(`${options.title}.pdf`)
}

export function fillTemplate(template: string, fields: Record<string, string>): string {
  let filledTemplate = template

  Object.keys(fields).forEach((key) => {
    filledTemplate = filledTemplate.replace(new RegExp(`{{${key}}}`, "g"), fields[key] || "_________")
  })

  return filledTemplate
}

export function generatePreview(template: string, fields: Record<string, string>): string {
  return fillTemplate(template, fields)
}
