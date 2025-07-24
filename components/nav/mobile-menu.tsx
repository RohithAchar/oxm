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
    <div className="bg-muted md:hidden fixed bottom-0 left-0 z-50 w-full">
      <div className="flex justify-center items-center py-4 gap-4">
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
