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
  const showThemeToggle = true;

  return (
    <div
      className="md:hidden fixed left-0 right-0 bottom-0 z-50 border-t bg-background"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav className="max-w-7xl mx-auto px-3 h-16 flex items-center">
        <ul
          className={`grid ${
            showThemeToggle ? "grid-cols-5" : "grid-cols-4"
          } w-full`}
        >
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name} className="flex">
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex-1 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors mx-0.5 py-0.5
                    ${
                      isActive
                        ? "text-primary"
                        : "text-foreground/80 hover:text-foreground"
                    }`}
                >
                  <span
                    className={`inline-flex items-center justify-center h-8 w-8 rounded-full transition-colors bg-transparent group-hover:bg-muted/60`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span
                    className={`text-[10px] leading-none ${
                      isActive ? "text-foreground" : "text-foreground/90"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
          {/* Theme toggle */}
          {showThemeToggle && (
            <li className="flex">
              <div className="group flex-1 flex flex-col items-center justify-center gap-0.5 rounded-xl mx-0.5">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted/60">
                  <ModeToggle />
                </span>
                <span className="text-[10px] font-medium leading-none text-muted-foreground">
                  Theme
                </span>
              </div>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default MobileMenu;
