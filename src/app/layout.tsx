import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/providers/ReduxProvider";
import AuthProvider from "@/providers/AuthProvider";
export const metadata: Metadata = {
  title: "Nexus",
  description: "Manage your projects with Nexus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthProvider>
            <main>{children}</main>
            <Toaster richColors />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
