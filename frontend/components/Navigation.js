"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useContext } from "react";
import AuthContext from "@/hooks/Auth";
import NavButton from "./NavButton";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useMedia } from "react-use";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/groups",
    label: "Groups",
  },
  {
    href: "/scan-receipt",
    label: "Scan Receipt",
  },
  {
    href: "/account",
    label: "Account",
  },
];

const Navigation = () => {
  const { logoutUser, isAuthenticated } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const isMobile = useMedia("(max-width:1024px)", false);
  const pathname = usePathname();

  const onClick = (href) => {
    if (href === "logout") {
      logoutUser();
      return;
    }
    router.push(href);
    setIsOpen(false);
  };

  const authenticatedRoutes = [...routes];

  if (isAuthenticated) {
    authenticatedRoutes.push({
      href: "logout",
      label: "Logout",
    });
  }

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant="outline"
            size="sm"
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {authenticatedRoutes.map((route) => (
              <Button
                key={route.href}
                variant={route.href === pathname ? "secondary" : "ghost"}
                onClick={() => onClick(route.href)}
                className="w-full justify-start"
              >
                {route.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-x-2 w-full">
      <div className="flex items-center gap-x-2">
        {routes.map((route) => (
          <NavButton
            key={route.href}
            href={route.href}
            label={route.label}
            isActive={pathname === route.href}
            onClick={() => onClick(route.href)}
          />
        ))}
      </div>
      {isAuthenticated && (
        <div className="ml-auto">
          <NavButton
            href="logout"
            label="Logout"
            isActive={false}
            onClick={() => onClick("logout")}
            isLogout
          />
        </div>
      )}
    </nav>
  );
};

export default Navigation;
