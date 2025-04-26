"use client";
import Logo from "@/components/ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./nav-user";
import { menuConfig } from "./config/menu-config";
import { staffApi } from "./staff/api";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const useCurrentUser = () => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: staffApi.fetchLoggedInUser,
  });
  return user;
};

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const user = useCurrentUser();

  const menuSections = user ? menuConfig[user.roleName] : [];

  return (
    <Sidebar
      className="py-2 h-screen"
      collapsible={isMobile ? "offcanvas" : "none"}
      aria-label="Main navigation"
    >
      {!isMobile && <SidebarRail />}
      {isMobile && <SheetTitle className="sr-only">Navigation Menu</SheetTitle>}
      <SidebarHeader>
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center space-x-2 w-full">
            <Logo className="w-8" />
            <div>
              <h1 className="text-sm font-semibold">Synergy</h1>
              <p className="text-xs">v1.0</p>
            </div>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setOpenMobile(false)}
              aria-label="Close sidebar"
            >
              <X className="h-8 w-8" />
            </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menuSections.map(({ title, items }) => (
          <SidebarGroup key={title}>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="px-2">
                {items.map(({ icon, text, href }) => (
                  <SidebarMenuItem key={text}>
                    <SidebarMenuButton asChild isActive={pathname === href}>
                      <Link href={href}>
                        {icon}
                        <span>{text}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <p className="text-sm border-b py-4 px-2">{user?.message}</p>
        {user && (
          <NavUser
            user={{
              name: user.userName,
              email: user.email,
              avatar: "",
              roleName: user.roleName,
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
