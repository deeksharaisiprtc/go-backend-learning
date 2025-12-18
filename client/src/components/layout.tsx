import React from "react";
import { Link, useLocation } from "wouter";
import { Users, LayoutDashboard, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const Sidebar = ({ className }: { className?: string }) => {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/users", label: "User Management", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={cn("pb-12 h-full border-r bg-card", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary">
            GoBackend<span className="text-foreground">Admin</span>
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Sidebar */}
      <div className="md:hidden border-b bg-card p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">GoBackendAdmin</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 h-screen sticky top-0">
        <Sidebar className="h-full" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
