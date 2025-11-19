"use client"

import { Info } from "@phosphor-icons/react"

interface NotificationProps {
  title: string
  description: string | React.ReactNode
  className?: string
}

export function Notification({ title, description, className = "" }: NotificationProps) {
  return (
    <div className={`bg-card/60 border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <Info size={20} className="text-[#0ec2bc]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-sm font-medium mb-1 font-montserrat-alt">
            {title}
          </h4>
          <div className="text-muted-foreground text-sm leading-relaxed [&_a]:text-[#0ec2bc] [&_a]:hover:underline [&_strong]:text-[#0ec2bc] [&_strong]:font-semibold [&_b]:text-[#0ec2bc] [&_b]:font-semibold">
            {description}
          </div>
        </div>
      </div>
    </div>
  )
}
