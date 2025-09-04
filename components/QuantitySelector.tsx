"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  return (
    <div className="flex items-center border rounded-md">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className="h-8 w-8 p-0 hover:bg-muted"
      >
        <Minus className="h-3 w-3" />
      </Button>

      <div className="flex items-center justify-center min-w-[3rem] h-8 text-sm font-medium">{quantity}</div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        className="h-8 w-8 p-0 hover:bg-muted"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
