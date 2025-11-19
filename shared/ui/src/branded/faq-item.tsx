"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

interface FaqItemProps {
  question: string
  answer: string
  defaultOpen?: boolean
}

export function FaqItem({ question, answer, defaultOpen = false }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className="w-full backdrop-blur-sm border rounded-2xl overflow-hidden glass-card"
      style={{ border: "1px solid hsl(var(--border))" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors duration-300"
      >
        <span className="font-montserrat-alt text-white text-lg font-normal pr-4">{question}</span>
        <div className="flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}
          >
            <Plus size={20} className="text-primary" />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-2">
          <p className="text-white/80 font-montserrat-alt leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default FaqItem
