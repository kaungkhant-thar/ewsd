'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';

export function MobileMenuTrigger() {
  return (
    <SidebarTrigger>
      <Menu className="h-5 w-5" />
    </SidebarTrigger>
  );
}
