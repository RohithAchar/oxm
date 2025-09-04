"use client";

import { Home, MessageCircle, Newspaper, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./theme-toggle-button";

const menuItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "News",
    href: "/news",
    icon: Newspaper,
  },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageCircle,
  },
  {
    name: "Account",
    href: "/account",
    icon: User,
  },
];

const MobileMenu = () => {
  const pathname = usePathname();

  return (
    <div
      className="md:hidden fixed left-0 right-0 bottom-0 z-50 border-t bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav className="max-w-7xl mx-auto px-3 h-16 flex items-stretch">
        <ul className="grid grid-cols-5 w-full">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name} className="flex">
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-colors mx-1
                    ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <span
                    className={`inline-flex items-center justify-center h-9 w-9 rounded-full transition-colors
                    ${
                      isActive
                        ? "bg-primary/10"
                        : "bg-transparent group-hover:bg-muted/60"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-medium leading-none">
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
          {/* Theme toggle */}
          <li className="flex">
            <div className="group flex-1 flex flex-col items-center justify-center gap-1 rounded-xl mx-1">
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-muted/60">
                <ModeToggle />
              </span>
              <span className="text-[11px] font-medium leading-none text-muted-foreground">
                Theme
              </span>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MobileMenu;
