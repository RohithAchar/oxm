import { Home, MessageCircle, Newspaper, User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

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
    href: "/supplier",
    icon: <User />,
  },
];

const MobileMenu = () => {
  return (
    <div className="bg-muted md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-2xl z-50">
      <div className="flex justify-center items-center gap-4">
        {menuItems.map((item) => (
          <Button size={"lg"} variant={"outline"} asChild key={item.name}>
            <Link href={item.href}>{item.icon}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
