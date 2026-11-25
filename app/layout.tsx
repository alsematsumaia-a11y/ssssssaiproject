import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dalia Beauty Center | Luxury Care",
  description: "Discover your beauty routine, build your package and book your appointment at Dalia Beauty Center in Cairo."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
