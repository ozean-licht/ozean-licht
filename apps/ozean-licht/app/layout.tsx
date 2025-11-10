import type { Metadata } from "next";
import { Inter, Cinzel, Cinzel_Decorative, Montserrat, Montserrat_Alternates } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-serif" });
const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-decorative"
});
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const montserratAlt = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat-alt"
});

export const metadata: Metadata = {
  title: "Ozean Licht Akademie™",
  description: "Spirituelle Bildungsplattform für kosmisches Bewusstsein und Transformation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <body
        className={`${inter.variable} ${cinzel.variable} ${cinzelDecorative.variable} ${montserrat.variable} ${montserratAlt.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
