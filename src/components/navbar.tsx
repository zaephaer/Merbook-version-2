
"use client"

import Link from "next/link";
import { LogOut, Grid2X2, CalendarDays, ShieldCheck, Activity, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUsers } from "@/lib/mock-data";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Logo = () => (
  <div className="flex items-center gap-2 group">
    <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
      <MousePointer2 className="h-5 w-5 text-accent rotate-12" />
    </div>
    <div className="flex flex-col -space-y-1">
      <span className="text-4xl font-black tracking-tighter text-primary uppercase leading-none">
        MER<span className="text-accent">BOOK</span>
      </span>
      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 pl-0.5">
        Meeting Room Booking
      </span>
    </div>
  </div>
);

export function Navbar() {
  const user = mockUsers[0]; 
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  const navItems = isAdminPath ? [
    { label: "Rooms", href: "/admin/rooms", icon: Grid2X2 },
    { label: "All Bookings", href: "/admin/bookings", icon: Activity },
    { label: "User View", href: "/dashboard", icon: Grid2X2 },
  ] : [
    { label: "Browse", href: "/dashboard", icon: Grid2X2 },
    { label: "My Bookings", href: "/dashboard/my-bookings", icon: CalendarDays },
    { label: "Admin Panel", href: "/admin/rooms", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 text-xs font-bold uppercase tracking-wide transition-all px-4 py-2 rounded-lg",
                    isActive 
                      ? "text-accent-foreground bg-accent shadow-lg shadow-accent/20" 
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-border">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                  <AvatarFallback className="bg-primary text-white font-bold">{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{user.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/my-bookings">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>My Bookings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/rooms">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
