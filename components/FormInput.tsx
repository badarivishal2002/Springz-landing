"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FormInputProps {
  label: string
  name: string
  type?: "text" | "email" | "tel" | "textarea"
  placeholder?: string
  required?: boolean
  value?: string
  onChange?: (value: string) => void
  error?: string
}

export default function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  value,
  onChange,
  error,
}: FormInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-foreground font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {type === "textarea" ? (
        <Textarea
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={handleChange}
          className={`bg-background border-border ${error ? "border-destructive" : ""}`}
          rows={4}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={handleChange}
          className={`bg-background border-border ${error ? "border-destructive" : ""}`}
        />
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}
