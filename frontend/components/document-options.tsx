"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'

interface DocumentOptionsProps {
  documentCount: number
  isProcessing: boolean
  onProcess?: (options: string[]) => Promise<void>
}

interface DocumentOption {
  id: string
  label: string
}

const DEFAULT_OPTIONS: DocumentOption[] = [
  { id: "modelo1", label: "Modelo1 placeholder" },
  { id: "modelo2", label: "Modelo2 placeholder" },
  { id: "modelo3", label: "Modelo3 placeholder" },
  { id: "modelo4", label: "Modelo4 placeholder" },
  { id: "modelo5", label: "Modelo5 placeholder" },
]

export function DocumentOptions({
  documentCount,
  isProcessing,
  onProcess,
}: DocumentOptionsProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleApplyOptions = async () => {
    if (documentCount < 1) {
      console.warn("[v0] Need at least 1 documents")
      return
    }

    if (selectedOptions.length === 0) {
      console.warn("[v0] No options selected")
      return
    }

    setIsLoading(true)
    try {
      await onProcess?.(selectedOptions)
    } catch (error) {
      console.error("[v0] Processing error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isButtonDisabled = documentCount == 0 || isProcessing || isLoading || selectedOptions.length === 0

  return (
    <Card className="bg-card p-6 border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4">Opcións de predicción</h2>
      <div className="space-y-3">
        {DEFAULT_OPTIONS.map((option) => (
          <div key={option.id} className="flex items-center space-x-3">
            <Checkbox
              id={option.id}
              checked={selectedOptions.includes(option.id)}
              onCheckedChange={() => toggleOption(option.id)}
              disabled={isProcessing || isLoading}
            />
            <label
              htmlFor={option.id}
              className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {selectedOptions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">
            {selectedOptions.length} option{selectedOptions.length !== 1 ? "s" : ""} selected
          </p>
          {documentCount === 0 && (
            <p className="text-xs text-red-500 mb-3">
              Por favor añada polo menos 1 documento para procesar
            </p>
          )}
          <Button
            onClick={handleApplyOptions}
            className="w-full"
            disabled={isButtonDisabled}
          >
            {isLoading || isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando...
              </>
            ) : (
              "Aplicar opcións e predicir"
            )}
          </Button>
        </div>
      )}
    </Card>
  )
}
