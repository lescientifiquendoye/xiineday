'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, Languages } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore, Language } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { useEffect, useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme, language, setLanguage } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const t = useTranslation(language);

  useEffect(() => {
    setMounted(true);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/weather', label: t.nav.weather },
    { href: '/events', label: t.nav.events },
    { href: '/pro', label: t.nav.pro },
    { href: '/subscription', label: 'Abonnement' },
    { href: '/about', label: 'À propos' },
  ];

  const languages: { code: Language; flag: string }[] = [
    { code: 'fr', flag: '🇫🇷' },
    { code: 'en', flag: '🇬🇧' },
    { code: 'wo', flag: '🇸🇳' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
              <Image
                src="/LogoXiineDay_petit (1).png"
                alt="XiineDay Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {t.appName}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1">
                {t.tagline}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  className={
                    pathname === item.href
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                      : ''
                  }
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {mounted && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Languages className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`cursor-pointer ${
                          language === lang.code ? 'bg-green-50 dark:bg-green-900/20' : ''
                        }`}
                      >
                        <span className="mr-2 text-lg">{lang.flag}</span>
                        <span>{t.languages[lang.code]}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </>
            )}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <div className="relative w-8 h-8">
                      <Image
                        src="/LogoXiineDay_petit (1).png"
                        alt="XiineDay Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {t.appName}
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                      <Button
                        variant={pathname === item.href ? 'default' : 'ghost'}
                        className={`w-full justify-start text-base ${
                          pathname === item.href
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                            : ''
                        }`}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
