import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/providers/ReduxProvider";
import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import {Metadata }  from "next";

export const metadata: Metadata = {
  title: "Nexus - Project Management",
  description: "Manage your projects efficiently with Nexus.",
  keywords: ["project management", "nexus", "productivity", "collaboration"],
  authors: [{ name: "Mayank Verma" }],
  creator: "MayankV004",
  publisher: "MayankV004",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.mayanknexus.app",
    title: "Nexus - Project Management",
    description: "Manage your projects efficiently with Nexus.",
    siteName: "Nexus",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus - Project Management",
    description: "Manage your projects efficiently with Nexus.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ReduxProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              
            >     <main>

                {children}      
            </main>
                <Toaster richColors />      
            </ThemeProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
