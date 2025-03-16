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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./nav-user";
import { menuConfig } from "./config/menu-config";
import { staffApi } from "./staff/api";
import { useQuery } from "@tanstack/react-query";

export function AppSidebar() {
  const pathname = usePathname();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: staffApi.fetchLoggedInUser,
  });

  const menuSections = user ? menuConfig[user.roleName] : [];

  return (
    <Sidebar className="py-2">
      <SidebarHeader>
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center space-x-2 w-full">
            <Logo className="w-8" />
            <div>
              <h1 className="text-sm font-semibold">Synergy</h1>
              <p className="text-xs">v1.0</p>
            </div>
          </div>
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
        {user && (
          <NavUser
            user={{
              name: user.userName,
              email: user.email,
              avatar: "",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
