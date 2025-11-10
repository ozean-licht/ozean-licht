"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"

interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  asChild?: boolean
  variant?: "default" | "outline" | "ghost" | "link"
}

export function PrimaryButton({ children, onClick, className, disabled = false, type = "button", asChild = false, variant = "default" }: PrimaryButtonProps) {
  if (asChild) {
    return (
      <Slot className={cn(className)}>
        {children}
      </Slot>
    )
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={variant as any}
      className={cn(
        variant === "default" && "bg-primary hover:bg-primary/90 text-[#E1E3E9] text-lg px-8 py-[22px] rounded-full font-montserrat-alternates transition-all duration-200 shadow-lg hover:shadow-xl text-foreground font-normal",
        className,
      )}
    >
      {children}
    </Button>
  )
}

export default PrimaryButton
