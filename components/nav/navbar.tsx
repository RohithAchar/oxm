"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, Truck, User } from "lucide-react";
import { ModeToggle } from "./theme-toggle-button";

export const Navbar = () => {
  return (
    <header className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-xl">
          <span className="text-foreground">Open</span>
          <span className="text-primary">X</span>
          <span className="text-foreground">mart</span>
          <span className="text-muted-foreground text-xs">.com</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Messages">
            <Link href="/messages">
              <MessageSquare className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Orders">
            <Truck className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Profile">
            <Link href="/account">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
