import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/providers/ReduxProvider";
import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/theme-provider";

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
