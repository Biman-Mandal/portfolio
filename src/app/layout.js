import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import CursorFollower from "@/components/CursorFollower";
import ThreeHero from "@/components/ThreeHero";
import ScrollSectionHandler from "@/components/ScrollSectionHandler";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata = {
  title: "Full Stack Developer Portfolio",
  description: "A Three.js powered full stack developer portfolio with admin management."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sansFont.variable}`} data-theme="light" suppressHydrationWarning>
      <head />
      <body className="font-sans-active">
        <ThreeHero />
        <ScrollSectionHandler />
        <CursorFollower />
        <div className="bg-glow-container" />
        {children}
      </body>
    </html>
  );
}
