"use client";

import type { SvgIconTypeMap } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  icon: OverridableComponent<SvgIconTypeMap<object, "svg">>;
  label: string;
  href: string;
  isOpen: boolean;
}

export default function SidebarItem({ icon: Icon, label, href, isOpen }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
        isOpen ? "gap-3" : "justify-center",
        isActive
          ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg"
          : "text-foreground hover:bg-gray-100 hover:text-white dark:hover:bg-gray-800 hover:shadow-sm",
      )}
    >
      <Icon fontSize="small" className="flex-shrink-0" />
      {isOpen && <span>{label}</span>}
    </Link>
  );
}
