import type React from "react"

// Import design elements from shared assets
// Using relative path since @/ alias doesn't resolve in consumer apps
import SpanAccentImage from "../../../assets/design-elements/SpanAccent.png"

interface SpanDesignProps {
  children: React.ReactNode
  className?: string
}

export { SpanDesign }
export default function SpanDesign({ children, className = "" }: SpanDesignProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Left decorative element */}
      <div className="flex-shrink-0">
        <img
          src={SpanAccentImage}
          alt="Decorative accent"
          className="w-[41px] h-[17px] object-cover"
        />
      </div>

      {/* Text content */}
      <span
        className="text-[#0ec2bc] text-lg font-normal whitespace-nowrap font-montserrat-alt"
      >
        {children}
      </span>

      {/* Right decorative element (mirrored horizontally) */}
      <div className="flex-shrink-0">
        <img
          src={SpanAccentImage}
          alt="Decorative accent"
          className="w-[41px] h-[17px] object-cover scale-x-[-1]"
        />
      </div>
    </div>
  )
}
