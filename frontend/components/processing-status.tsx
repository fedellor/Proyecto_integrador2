"use client"

import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

interface ProcessingStatusProps {
  isProcessing: boolean
  isComplete: boolean
  error: string | null
  documentCount: number
  optionsCount: number
}

export function ProcessingStatus({
  isProcessing,
  isComplete,
  error,
  documentCount,
  optionsCount,
}: ProcessingStatusProps) {
  if (!isProcessing && !isComplete && !error) {
    return null
  }

  return (
    <Card className="bg-card p-6 border border-border">
      <div className="space-y-4">
        {isProcessing && (
          <div className="flex items-start gap-4">
            <Loader2 className="h-6 w-6 text-primary animate-spin flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Processing Documents</h3>
              <p className="text-sm text-muted-foreground">
                Processing {documentCount} document{documentCount !== 1 ? "s" : ""} with {optionsCount} option
                {optionsCount !== 1 ? "s" : ""}...
              </p>
            </div>
          </div>
        )}

        {isComplete && !error && (
          <div className="flex items-start gap-4">
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Processing Complete</h3>
              <p className="text-sm text-muted-foreground">
                Successfully processed {documentCount} document{documentCount !== 1 ? "s" : ""}.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Processing Error</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
