"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ndaTemplate } from "@/lib/templates/nda-template"
import { consultingAgreementTemplate } from "@/lib/templates/consulting-agreement-template"
import { employmentAgreementTemplate } from "@/lib/templates/employment-agreement-template"
import { Loader2, Download, FileText, Edit, Save } from "lucide-react"
import { fillTemplate, generatePdf } from "@/lib/utils/document-formatter"

export default function DocumentGeneratorPage() {
  const router = useRouter()
  const { supabase, user } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("nda")
  const [documentTitle, setDocumentTitle] = useState("")
  const [previewMode, setPreviewMode] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [generatedDocument, setGeneratedDocument] = useState("")
  const [editedDocument, setEditedDocument] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  // NDA form fields
  const [ndaFields, setNdaFields] = useState({
    effectiveDate: "",
    party1: "",
    party2: "",
    party1Engages: "",
    party2Engages: "",
    purpose: "",
    jurisdiction: "",
    confidentialityDuration: "",
  })

  // Consulting Agreement form fields
  const [consultingFields, setConsultingFields] = useState({
    effectiveDate: "",
    clientName: "",
    clientAddress: "",
    consultantName: "",
    consultantAddress: "",
    serviceArea: "",
    serviceDescription: "",
    contractDuration: "",
    renewalPeriod: "",
    noticePeriod: "",
    terminationNoticePeriod: "",
    curePeriod: "",
    compensationAmount: "",
    compensationPeriod: "",
    invoicePeriod: "",
    paymentTerms: "",
    governingLaw: "",
    arbitrationRules: "",
    arbitrationVenue: "",
  })

  // Employment Agreement form fields
  const [employmentFields, setEmploymentFields] = useState({
    effectiveDate: "",
    employerName: "",
    employerJurisdiction: "",
    employerAddress: "",
    employeeName: "",
    employeeAddress: "",
    position: "",
    reportsTo: "",
    terminationNotice: "",
    resignationNotice: "",
    disabilityPeriod: "",
    disabilityPeriodAlternate: "",
    disabilityPeriodTimeframe: "",
    baseSalary: "",
    bonusPercentage: "",
    bonusPaymentDeadline: "",
    vacationDays: "",
    nonCompetePeriod: "",
    nonSolicitPeriod: "",
    nonSolicitEmployeePeriod: "",
    governingLaw: "",
    arbitrationRules: "",
    arbitrationVenue: "",
  })

  const handleNdaFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNdaFields({
      ...ndaFields,
      [e.target.name]: e.target.value,
    })
  }

  const handleConsultingFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setConsultingFields({
      ...consultingFields,
      [e.target.name]: e.target.value,
    })
  }

  const handleEmploymentFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmploymentFields({
      ...employmentFields,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    if (selectedTemplate === "nda") {
      setNdaFields({
        ...ndaFields,
        [name]: value,
      })
    } else if (selectedTemplate === "consulting") {
      setConsultingFields({
        ...consultingFields,
        [name]: value,
      })
    } else if (selectedTemplate === "employment") {
      setEmploymentFields({
        ...employmentFields,
        [name]: value,
      })
    }
  }

  const generateDocument = () => {
    if (!documentTitle) {
      toast({
        title: "Document title required",
        description: "Please enter a title for your document.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    let template = ""
    let fields = {}

    if (selectedTemplate === "nda") {
      template = ndaTemplate
      fields = ndaFields
    } else if (selectedTemplate === "consulting") {
      template = consultingAgreementTemplate
      fields = consultingFields
    } else if (selectedTemplate === "employment") {
      template = employmentAgreementTemplate
      fields = employmentFields
    }

    const filledTemplate = fillTemplate(template, fields as Record<string, string>)

    setGeneratedDocument(filledTemplate)
    setEditedDocument(filledTemplate)
    setPreviewMode(true)
    setIsLoading(false)
  }

  const saveDocument = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save documents.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.from("documents").insert({
        case_id: null, // Can be linked to a case later
        uploaded_by: user.id,
        file_name: documentTitle,
        file_url: "", // We're storing the content directly
        file_type: "text/plain",
        file_size: editMode ? editedDocument.length : generatedDocument.length,
        content: editMode ? editedDocument : generatedDocument,
        template_type: selectedTemplate,
      })

      if (error) throw error

      toast({
        title: "Document saved",
        description: "Your document has been saved successfully.",
      })

      router.push("/dashboard/documents")
    } catch (error: any) {
      console.error("Error saving document:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadAsPdf = () => {
    const content = editMode ? editedDocument : generatedDocument
    const title = documentTitle || "Document"

    generatePdf({
      title,
      content,
      fontSize: 10,
      lineHeight: 7,
      margin: 20,
    })
  }

  const downloadAsDocx = () => {
    const content = editMode ? editedDocument : generatedDocument
    const title = documentTitle || "Document"

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

  const toggleEditMode = () => {
    if (!editMode) {
      setEditMode(true)
    } else {
      setGeneratedDocument(editedDocument)
      setEditMode(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animated-gradient-text">Document Generator</h1>
        <p className="text-muted-foreground">Create legal documents from templates</p>
      </div>

      {!previewMode ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Generate a Document</CardTitle>
            <CardDescription>Select a template and fill in the required information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="documentTitle">Document Title</Label>
                <Input
                  id="documentTitle"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Enter a title for your document"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Template Type</Label>
                <Tabs defaultValue="nda" onValueChange={setSelectedTemplate}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="nda">Non-Disclosure</TabsTrigger>
                    <TabsTrigger value="consulting">Consulting</TabsTrigger>
                    <TabsTrigger value="employment">Employment</TabsTrigger>
                  </TabsList>

                  <TabsContent value="nda" className="space-y-6 mt-4">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="effectiveDate">Effective Date</Label>
                        <Input
                          id="effectiveDate"
                          name="effectiveDate"
                          type="date"
                          value={ndaFields.effectiveDate}
                          onChange={handleNdaFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confidentialityDuration">Confidentiality Duration (years)</Label>
                        <Input
                          id="confidentialityDuration"
                          name="confidentialityDuration"
                          type="number"
                          min="1"
                          value={ndaFields.confidentialityDuration}
                          onChange={handleNdaFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="party1">Party 1 (Full Legal Name)</Label>
                        <Input id="party1" name="party1" value={ndaFields.party1} onChange={handleNdaFieldChange} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="party2">Party 2 (Full Legal Name)</Label>
                        <Input id="party2" name="party2" value={ndaFields.party2} onChange={handleNdaFieldChange} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="party1Engages">Party 1 Business Description</Label>
                        <Input
                          id="party1Engages"
                          name="party1Engages"
                          value={ndaFields.party1Engages}
                          onChange={handleNdaFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="party2Engages">Party 2 Business Description</Label>
                        <Input
                          id="party2Engages"
                          name="party2Engages"
                          value={ndaFields.party2Engages}
                          onChange={handleNdaFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="purpose">Purpose of Disclosure</Label>
                        <Input id="purpose" name="purpose" value={ndaFields.purpose} onChange={handleNdaFieldChange} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="jurisdiction">Governing Jurisdiction</Label>
                        <Input
                          id="jurisdiction"
                          name="jurisdiction"
                          value={ndaFields.jurisdiction}
                          onChange={handleNdaFieldChange}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="consulting" className="space-y-6 mt-4">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="effectiveDate">Effective Date</Label>
                        <Input
                          id="effectiveDate"
                          name="effectiveDate"
                          type="date"
                          value={consultingFields.effectiveDate}
                          onChange={handleConsultingFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clientName">Client Name</Label>
                        <Input
                          id="clientName"
                          name="clientName"
                          value={consultingFields.clientName}
                          onChange={handleConsultingFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clientAddress">Client Address</Label>
                        <Input
                          id="clientAddress"
                          name="clientAddress"
                          value={consultingFields.clientAddress}
                          onChange={handleConsultingFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="consultantName">Consultant Name</Label>
                        <Input
                          id="consultantName"
                          name="consultantName"
                          value={consultingFields.consultantName}
                          onChange={handleConsultingFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="consultantAddress">Consultant Address</Label>
                        <Input
                          id="consultantAddress"
                          name="consultantAddress"
                          value={consultingFields.consultantAddress}
                          onChange={handleConsultingFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serviceArea">Service Area</Label>
                        <Input
                          id="serviceArea"
                          name="serviceArea"
                          value={consultingFields.serviceArea}
                          onChange={handleConsultingFieldChange}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="serviceDescription">Service Description</Label>
                        <Textarea
                          id="serviceDescription"
                          name="serviceDescription"
                          value={consultingFields.serviceDescription}
                          onChange={handleConsultingFieldChange}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contractDuration">Contract Duration</Label>
                        <Input
                          id="contractDuration"
                          name="contractDuration"
                          placeholder="e.g., 12 months"
                          value={consultingFields.contractDuration}
                          onChange={handleConsultingFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="compensationAmount">Compensation Amount</Label>
                        <Input
                          id="compensationAmount"
                          name="compensationAmount"
                          placeholder="e.g., $5,000"
                          value={consultingFields.compensationAmount}
                          onChange={handleConsultingFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="compensationPeriod">Compensation Period</Label>
                        <Input
                          id="compensationPeriod"
                          name="compensationPeriod"
                          placeholder="e.g., month"
                          value={consultingFields.compensationPeriod}
                          onChange={handleConsultingFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="governingLaw">Governing Law</Label>
                        <Input
                          id="governingLaw"
                          name="governingLaw"
                          placeholder="e.g., State of California"
                          value={consultingFields.governingLaw}
                          onChange={handleConsultingFieldChange}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="employment" className="space-y-6 mt-4">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="effectiveDate">Effective Date</Label>
                        <Input
                          id="effectiveDate"
                          name="effectiveDate"
                          type="date"
                          value={employmentFields.effectiveDate}
                          onChange={handleEmploymentFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employerName">Employer Name</Label>
                        <Input
                          id="employerName"
                          name="employerName"
                          value={employmentFields.employerName}
                          onChange={handleEmploymentFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employerAddress">Employer Address</Label>
                        <Input
                          id="employerAddress"
                          name="employerAddress"
                          value={employmentFields.employerAddress}
                          onChange={handleEmploymentFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employeeName">Employee Name</Label>
                        <Input
                          id="employeeName"
                          name="employeeName"
                          value={employmentFields.employeeName}
                          onChange={handleEmploymentFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employeeAddress">Employee Address</Label>
                        <Input
                          id="employeeAddress"
                          name="employeeAddress"
                          value={employmentFields.employeeAddress}
                          onChange={handleEmploymentFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          name="position"
                          value={employmentFields.position}
                          onChange={handleEmploymentFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="baseSalary">Base Salary</Label>
                        <Input
                          id="baseSalary"
                          name="baseSalary"
                          placeholder="e.g., $75,000"
                          value={employmentFields.baseSalary}
                          onChange={handleEmploymentFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vacationDays">Vacation Days</Label>
                        <Input
                          id="vacationDays"
                          name="vacationDays"
                          type="number"
                          min="0"
                          value={employmentFields.vacationDays}
                          onChange={handleEmploymentFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nonCompetePeriod">Non-Compete Period (months)</Label>
                        <Input
                          id="nonCompetePeriod"
                          name="nonCompetePeriod"
                          type="number"
                          min="0"
                          value={employmentFields.nonCompetePeriod}
                          onChange={handleEmploymentFieldChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="governingLaw">Governing Law</Label>
                        <Input
                          id="governingLaw"
                          name="governingLaw"
                          placeholder="e.g., State of New York"
                          value={employmentFields.governingLaw}
                          onChange={handleEmploymentFieldChange}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={generateDocument} disabled={isLoading} className="gradient-bg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Document
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-primary">{documentTitle}</CardTitle>
                <CardDescription>
                  {selectedTemplate === "nda"
                    ? "Non-Disclosure Agreement"
                    : selectedTemplate === "consulting"
                      ? "Consulting Agreement"
                      : "Employment Agreement"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  Back to Form
                </Button>
                <Button variant="outline" onClick={toggleEditMode}>
                  {editMode ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Edits
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Document
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <Textarea
                ref={textareaRef}
                value={editedDocument}
                onChange={(e) => setEditedDocument(e.target.value)}
                className="font-mono text-sm h-[600px] whitespace-pre-wrap"
              />
            ) : (
              <div
                ref={previewContainerRef}
                id="previewContainer"
                className="bg-muted p-4 rounded-md h-[600px] overflow-auto whitespace-pre-wrap font-mono text-sm"
              >
                {generatedDocument}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadAsPdf}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={downloadAsDocx}>
                <Download className="mr-2 h-4 w-4" />
                Download DOCX
              </Button>
            </div>
            <Button onClick={saveDocument} disabled={isLoading} className="gradient-bg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Document"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
