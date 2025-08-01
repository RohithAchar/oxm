"use client";

import { Home, MessageCircle, Newspaper, User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Home",
    href: "/",
    icon: <Home />,
  },
  {
    name: "News",
    href: "/news",
    icon: <Newspaper />,
  },
  {
    name: "Messages",
    href: "/messages",
    icon: <MessageCircle />,
  },
  {
    name: "My Account",
    href: "/account",
    icon: <User />,
  },
];

const MobileMenu = () => {
  const pathname = usePathname();

  return (
    <div className="bg-background border md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-2xl z-50">
      <div className="flex justify-center items-center gap-4">
        {menuItems.map((item) => (
          <Button
            size={"lg"}
            variant={pathname === item.href ? "default" : "outline"}
            asChild
            key={item.name}
          >
            <Link href={item.href}>{item.icon}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
