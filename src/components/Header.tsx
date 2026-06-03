import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Coffee } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Coffee className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-primary">KopKen Analytics</span>
            <span className="text-xs text-muted-foreground -mt-1 hidden sm:inline-block">Analisis Sentimen Aplikasi & Gerai Kopi Kenangan</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground hidden md:inline-block">
            Team ID: PJK-RM114
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
