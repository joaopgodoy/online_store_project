"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuantityControlsProps {
  quantity: number
  onIncrement: (e: React.MouseEvent) => void
  onDecrement: (e: React.MouseEvent) => void
  maxQuantity: number
  size?: "sm" | "md"
  disabled?: boolean
}

export default function QuantityControls({
  quantity,
  onIncrement,
  onDecrement,
  maxQuantity,
  size = "sm",
  disabled = false
}: QuantityControlsProps) {
  const buttonSize = size === "sm" ? "sm" : "default"
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4"
  const buttonClass = size === "sm" ? "h-8 w-8 p-0" : "h-10 w-10 p-0"

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size={buttonSize}
        className={buttonClass}
        onClick={onDecrement}
        disabled={disabled || quantity <= 1}
      >
        <Minus className={iconSize} />
      </Button>
      <span className={`text-center font-medium ${size === "sm" ? "w-8 text-sm" : "w-12"}`}>
        {quantity}
      </span>
      <Button
        variant="outline"
        size={buttonSize}
        className={buttonClass}
        onClick={onIncrement}
        disabled={disabled || quantity >= maxQuantity}
      >
        <Plus className={iconSize} />
      </Button>
    </div>
  )
}
