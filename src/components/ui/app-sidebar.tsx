"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Database, Store, LogOut } from "lucide-react"

export function AppSidebar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Direct Supabase",
      url: "/categories",
      // icon: Database,
      description: "CRUD operations using direct Supabase calls"
    },
    {
      title: "Using State management (Zustand)",
      url: "/categoryusingstore",
      // icon: Store,
      description: "State management with Zustand store"
    },
    {
      title: "Using Edge Functions Demo",
      url: "/hello",
      // icon: Store,
      description: "Invoke Supabase Edge Functions for operations"
    },
    {
      title: "Using Edge Functions",
      url: "/payment",
      // icon: Store,
      description: "Invoke Supabase Edge Functions for operations"
    }
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <Database className="size-6" />
          <span className="font-semibold">Category Manager</span>
        </div>
        {user && (
          <div className="px-2 py-2 text-sm text-muted-foreground">
            <div className="font-medium">Welcome,</div>
            <div className="truncate">{user.email}</div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Category Management</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  tooltip={item.description}
                >
                  <button
                    onClick={() => router.push(item.url)}
                    className="flex w-full items-center gap-2"
                  >
                    {/* <item.icon className="size-4" /> */}
                    <span>{item.title}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start"
              >
                {/* <LogOut className="size-4" /> */}
                <span>Sign Out</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
