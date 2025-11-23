"use client"

import type React from "react"

import { CossUIButton as Button } from "../cossui"
import { cn } from "../utils"

interface CtaButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function CtaButton({ children, onClick, className, disabled = false, type = "button" }: CtaButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "bg-[#0ec2bc] hover:bg-[#0ec2bc]/90 border-2 border-[#0ec2bc]/50 text-white text-lg px-8 py-[22px] rounded-full font-montserrat-alternates transition-all duration-200 shadow-lg hover:shadow-xl font-normal",
        className,
      )}
    >
      {children}
    </Button>
  )
}

export default CtaButton
