import type { Metadata } from "next";
import { Google_Sans_Code } from "next/font/google";
import "./globals.css";
import "./theme-light.css";

const googleSansCode = Google_Sans_Code({
  variable: "--font-google-sans-code",
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Consolas", "Liberation Mono", "monospace"],
});

export const metadata: Metadata = {
  title: "Seyha | Full-Stack Developer",
  description: "Seyha is a full-stack developer focused on modern applications, scalable APIs, and clean user experiences.",
};

const restoreTheme = `try{if(localStorage.getItem("seyha-theme")==="light")document.documentElement.dataset.theme="light"}catch{}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${googleSansCode.variable} h-full antialiased`}
    >
      <head><script dangerouslySetInnerHTML={{ __html: restoreTheme }} /></head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
