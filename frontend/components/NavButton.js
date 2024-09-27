import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";


const NavButton = ({ href, label, isActive }) => {
  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className={cn(
        "w-full lg:w-auth justify-between font-normal hover:bg-bananaText/40 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-bananaText focus:bg-white/30 transition",
        isActive ? "bg-bananaText text-white" : "bg-transparent"
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default NavButton;
