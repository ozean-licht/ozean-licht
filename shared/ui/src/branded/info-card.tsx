import type { ReactNode } from "react"
import { Button } from "../ui/button"

// Import design elements from shared assets
import TopLightImage from "@/shared/assets/design-elements/TopLight.png"
import CardFocusImage from "@/shared/assets/design-elements/CardFocus.png"
import CardMovingStrokeImage from "@/shared/assets/design-elements/CardMovingStroke.png"

interface InfoCardProps {
  heading: string
  paragraph: string
  icon?: ReactNode
}

interface InfoCardWithButtonProps extends InfoCardProps {
  buttonText: string
  buttonHref?: string
}

export function InfoCard({ heading, paragraph, icon }: InfoCardProps) {
  return (
    <div
      className="relative border border-border bg-card rounded-lg overflow-hidden w-full h-auto"
      style={{ maxWidth: "450px", minWidth: "350px" }}
    >
      {/* Background Frame */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-0"
        style={{ width: "223px", height: "100px" }}
      >
        <img
          src={TopLightImage}
          alt="Top Light Effect"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative flex justify-center z-10">
        <div className="relative flex items-end justify-center pb-2" style={{ width: "306px", height: "96px" }}>
          <img
            src={CardFocusImage}
            alt="Card Focus Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute bottom-[19px] left-1/2 transform -translate-x-1/2 z-20">
            <div className="relative animate-pulse">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-pulse"></div>
              <div className="relative z-10">
                {icon ? (
                  <div className="text-primary">
                    {icon}
                  </div>
                ) : (
                  <svg className="w-6 h-6 drop-shadow-lg text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div
              className="relative"
              style={{
                width: "46px",
                height: "46px",
                animation: "spin 3s linear infinite, pulse 2s ease-in-out infinite alternate",
              }}
            >
              <img
                src={CardMovingStrokeImage}
                alt="Moving Stroke"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text Container */}
      <div className="px-6 pb-6 pt-4 text-center space-y-3 relative z-10">
        <h3 className="text-xl font-normal text-foreground font-montserrat-alt">
          {heading}
        </h3>
        <p className="text-sm text-muted-foreground font-light leading-relaxed font-montserrat">
          {paragraph}
        </p>
      </div>
    </div>
  )
}

export function InfoCardWithButton({ heading, paragraph, icon, buttonText, buttonHref }: InfoCardWithButtonProps) {
  return (
    <div
      className="relative border border-border bg-card rounded-lg overflow-hidden w-full h-auto"
      style={{ maxWidth: "450px", minWidth: "350px" }}
    >
      {/* Background Frame */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-0"
        style={{ width: "223px", height: "100px" }}
      >
        <img
          src={TopLightImage}
          alt="Top Light Effect"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative flex justify-center z-10">
        <div className="relative flex items-end justify-center pb-2" style={{ width: "306px", height: "96px" }}>
          <img
            src={CardFocusImage}
            alt="Card Focus Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute bottom-[19px] left-1/2 transform -translate-x-1/2 z-20">
            <div className="relative animate-pulse">
              <div className="absolute inset-0 rounded-full bg-[#0ec2bc]/20 blur-md animate-pulse"></div>
              <div className="relative z-10">
                {icon ? (
                  <div className="text-[#0ec2bc]">
                    {icon}
                  </div>
                ) : (
                  <svg className="w-6 h-6 drop-shadow-lg text-[#0ec2bc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div
              className="relative"
              style={{
                width: "46px",
                height: "46px",
                animation: "spin 3s linear infinite, pulse 2s ease-in-out infinite alternate",
              }}
            >
              <img
                src={CardMovingStrokeImage}
                alt="Moving Stroke"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text Container */}
      <div className="px-6 pb-6 pt-4 text-center space-y-3 relative z-10">
        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed font-montserrat">
          {paragraph}
        </p>

        {/* Button */}
        <div className="pt-4">
          {buttonHref ? (
            <a href={buttonHref} className="block w-full">
              <Button className="w-full bg-[#0ec2bc] hover:bg-[#0ec2bc]/90 text-white font-normal font-montserrat-alt">
                {buttonText}
              </Button>
            </a>
          ) : (
            <Button className="w-full bg-[#0ec2bc] hover:bg-[#0ec2bc]/90 text-white font-normal font-montserrat-alt">
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
