"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FileText,
  MessageSquare,
  Settings,
  Home,
  LogOut,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "לוח בקרה", href: "/admin", icon: LayoutDashboard },
  { label: "נכסים", href: "/admin/properties", icon: Building2 },
  { label: "בלוג", href: "/admin/blog", icon: FileText },
  { label: "פניות", href: "/admin/contacts", icon: MessageSquare },
  { label: "הגדרות", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className="w-64 bg-primary min-h-screen text-white flex flex-col fixed right-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="text-xl font-bold">
          מלי מגן
        </Link>
        <p className="text-white/50 text-sm mt-1">ניהול אתר</p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
          חזרה לאתר
        </Link>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          התנתק
        </button>
      </div>
    </aside>
  );
}
