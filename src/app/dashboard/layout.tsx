"use client"

import React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { serialize } from "v8"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    // console.log(segments)
    const breadcrumbs = []

    if (segments[1] === "projects") {
      breadcrumbs.push({ name: "Projects", href: "/dashboard/projects" })
      if (segments[2] && segments[2] !== "new") {
        breadcrumbs.push({ name: `Project #${segments[2]}`, href: `/dashboard/projects/${segments[2]}` })
      }
    } else if (segments[1] === "issues") {
      breadcrumbs.push({ name: "Issues", href: "/dashboard/issues" })
    } else if (segments[1] === "profile") {
      breadcrumbs.push({ name: "Profile", href: "/dashboard/profile" })
    } else {
      breadcrumbs.push({ name: "Dashboard", href: "/dashboard" })
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()
  // console.log(breadcrumbs)
  return (
    <SidebarProvider>
    <div className="flex min-h-screen w-full ">
        <AppSidebar />
        <SidebarInset className="flex-1 ">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-all duration-200">
            <SidebarTrigger className="-ml-1 transition-transform hover:scale-110" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={breadcrumb.href}>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbItem>
                        <BreadcrumbPage className="font-medium">{breadcrumb.name}</BreadcrumbPage>
                      </BreadcrumbItem>
                    ) : (
                      <>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href={breadcrumb.href} className="transition-colors hover:text-foreground">
                            {breadcrumb.name}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                      </>
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center space-x-2">
              <ThemeToggle />
              <UserNav />
            </div>
          </header>
          <main className="flex-1 overflow-auto ">
            <div className="container mx-auto p-6 space-y-6 animate-in fade-in-50 duration-500 ">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
      </SidebarProvider>
  )
}
