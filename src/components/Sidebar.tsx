"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Smartphone, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Overview',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Digital App Analytics',
    href: '/digital',
    icon: Smartphone,
  },
  {
    title: 'Physical Store Analytics',
    href: '/physical',
    icon: Store,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <span className="font-semibold text-lg tracking-tight">Navigation</span>
      </div>
      <div className="flex-1 py-4">
        <nav className="grid gap-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-muted p-4 text-center">
          <p className="text-xs text-muted-foreground">Developed by</p>
          <p className="text-sm font-semibold text-primary mt-1">PJK-RM114 Team</p>
        </div>
      </div>
    </aside>
  );
}
