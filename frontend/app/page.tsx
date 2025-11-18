"use client"

import { useState } from "react"
import { DocumentUploader } from "@/components/document-uploader"
import { DocumentOptions } from "@/components/document-options"
import { ProcessingStatus } from "@/components/processing-status"
import { parseProteinLigandCSV } from "@/lib/csv-parser"

interface UploadedDocument {
  id: string
  file: File
  name: string
  size: number
  uploadedAt: Date
}

export default function Home() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [processingState, setProcessingState] = useState({
    isProcessing: false,
    isComplete: false,
    error: null as string | null,
    result: null,
  })

  const handleDocumentsChange = (docs: UploadedDocument[]) => {
    setDocuments(docs)
  }

  const handleProcessDocuments = async (options: string[]) => {
    if (documents.length < 1) {
      setProcessingState({
        isProcessing: false,
        isComplete: false,
        error: "Please upload at least 1 document",
        result: null,
      })
      return
    }

    setProcessingState({
      isProcessing: true,
      isComplete: false,
      error: null,
      result: null,
    })

    try {
      const allRows: { protein_sequence: string; ligand_smiles: string }[] = []

      for (const doc of documents) {
        const rows = await parseProteinLigandCSV(doc.file)
        allRows.push(...rows)
      }

      const response = await fetch("http://localhost:8000/get_predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: allRows,
          options: options,
        }),
      })

      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`)
      }

      const result = await response.json()

      setProcessingState({
        isProcessing: false,
        isComplete: true,
        error: null,
        result,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"

      setProcessingState({
        isProcessing: false,
        isComplete: false,
        error: `Failed to process documents: ${errorMessage}`,
        result: null,
      })
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="border-b border-border shadow-sm bg-primary">
        <div className="mx-auto max-w-5xl px-4 md:px-8 py-6">
          <h1 className="text-4xl font-bold text-foreground">Proxecto Integrador</h1>
          <p className="text-sm text-muted-foreground mt-2"></p>
        </div>
      </header>
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-8">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="col-span-2">
            <DocumentUploader onDocumentsChange={handleDocumentsChange} />
          </div>
          <div>
            <DocumentOptions
              documentCount={documents.length}
              isProcessing={processingState.isProcessing}
              onProcess={handleProcessDocuments}
            />
          </div>
        </div>

        {processingState.isProcessing || processingState.isComplete || processingState.error ? (
          <ProcessingStatus
            isProcessing={processingState.isProcessing}
            isComplete={processingState.isComplete}
            error={processingState.error}
            documentCount={documents.length}
            optionsCount={selectedOptions.length}
          />
        ) : null}
      </div>
    </main>
  )
}
