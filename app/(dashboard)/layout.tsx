'use client';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { staffApi } from './staff/api';
import { menuConfig } from './config/menu-config';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { MobileMenuTrigger } from './mobile-menu-trigger';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: staffApi.fetchLoggedInUser,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }

      const menuSections = menuConfig[user.roleName] || [];
      const allowedRoutes = menuSections.flatMap((section) => section.items.map((item) => item.href));

      const isAllowedRoute = allowedRoutes.find((route) => pathname.includes(route));

      if (!isAllowedRoute) {
        router.push('/');
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    <div className="flex items-center justify-center h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>;
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <SidebarInset className="h-screen">
          <div className="flex items-center md:hidden px-2 pt-4">
            <MobileMenuTrigger />
            <div className="ml-2 text-xl font-semibold">Synergy</div>
          </div>
          <main className="flex-1 px-2.5 py-5 lg:p-6 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
