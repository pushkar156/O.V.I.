import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "O.V.I. Command",
  description: "Operational Intelligence",
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;600;700;800;900&family=Lexend:wght@300;400;500;600;700&family=Sora:wght@400;600;700;800&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-background dark:bg-[#131313] text-on-background dark:text-[#e5e2e1] font-body selection:bg-secondary-container selection:text-on-secondary-container overflow-hidden antialiased transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
