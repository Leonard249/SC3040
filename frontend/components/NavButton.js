import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NavButton = ({ href, label, isActive, onClick, isLogout }) => {
  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className={cn(
        "w-full lg:w-auth justify-between font-normal border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none transition",
        isActive && !isLogout
          ? "bg-bananaText text-white hover:bg-bananaText/40"
          : "bg-transparent hover:bg-bananaText/40 hover:text-white",
        isLogout && !isActive
          ? "bg-red-500 text-white hover:bg-red-500/40 cursor-pointer"
          : ""
      )}
      onClick={href === "logout" ? onClick : undefined}
    >
      {href === "logout" ? (
        <span>{label}</span>
      ) : (
        <Link href={href}>{label}</Link>
      )}
    </Button>
  );
};

export default NavButton;
