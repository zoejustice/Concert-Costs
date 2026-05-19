"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBarIcon,
  MusicalNoteIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

const links = [
  { href: "/app", label: "Dashboard", icon: ChartBarIcon },
  { href: "/app/add", label: "Add Concert", icon: PlusCircleIcon },
  { href: "/app/concerts", label: "My Concerts", icon: MusicalNoteIcon },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="tabs tabs-boxed bg-base-200/80 p-1 flex-wrap gap-1 w-full lg:w-auto">
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/app"
            ? pathname === "/app"
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`tab gap-2 flex-1 sm:flex-none ${active ? "tab-active" : ""}`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden xs:inline sm:inline">{label}</span>
            <span className="sm:hidden">
              {label === "Add Concert" ? "Add" : label.split(" ")[0]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
