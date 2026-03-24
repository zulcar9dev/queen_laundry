"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/status", label: "Status", icon: History },
  { href: "/racks", label: "Rak", icon: Search },
];

export function BottomNav() {
  const pathname = usePathname();
  
  // Hide bottom nav on order creation page to focus user attention
  if (pathname === "/order") return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 shadow-ambient flex items-center gap-10 transition-all duration-500 hover:shadow-xl hover:bg-white/80">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all duration-300 relative px-2",
              isActive ? "scale-110" : "opacity-40 hover:opacity-100 hover:scale-105"
            )}
          >
            <div className={cn(
              "h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-300",
              isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-transparent text-[#171c1f]"
            )}>
              <item.icon className="h-5 w-5" />
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.15em] transition-all",
              isActive ? "text-primary translate-y-0.5" : "text-transparent h-0 overflow-hidden"
            )}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
