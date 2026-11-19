"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/auth-provider";
import { dashboardPathForRole, roleLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
];

export function Navbar() {
  const { user, isPending, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out successfully");
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/8 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {isPending ? (
            <Skeleton className="ml-1 h-9 w-28 rounded-lg" />
          ) : user ? (
            <>
              <Button
                render={<Link href={dashboardPathForRole(user.role)} />}
                variant="outline"
                className="hidden h-9 sm:inline-flex"
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger className="ml-1 flex items-center gap-2 rounded-lg p-1 pr-2 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                  <UserAvatar name={user.name} image={user.image} className="size-8" />
                  <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
                    {user.name.split(" ")[0]}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="flex flex-col gap-1 py-2">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </span>
                    <span className="truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                    <span className="mt-1 flex gap-1.5">
                      <Badge variant="secondary" className="text-[0.65rem]">
                        {roleLabel(user.role)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[0.65rem] capitalize",
                          user.plan === "pro" && "border-primary/30 text-primary"
                        )}
                      >
                        {user.plan}
                      </Badge>
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href={dashboardPathForRole(user.role)} />}>
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
                    <UserRound className="size-4" />
                    Update Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => void handleSignOut()}
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button render={<Link href="/sign-in" />} variant="ghost" className="h-9">
                Sign In
              </Button>
              <Button render={<Link href="/sign-up" />} className="h-9">
                Get Started
              </Button>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="lg:hidden" />}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] p-0 sm:max-w-xs">
              <SheetHeader className="border-b px-4 py-4">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-3" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/tuitions"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  <Search className="size-4" /> Find a tuition
                </Link>
              </nav>
              <div className="mt-auto space-y-2 border-t p-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 pb-2">
                      <UserAvatar name={user.name} image={user.image} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{user.name}</p>
                        <p className="text-xs capitalize text-muted-foreground">
                          {roleLabel(user.role)} · {user.plan} plan
                        </p>
                      </div>
                    </div>
                    <Button
                      render={<Link href={dashboardPathForRole(user.role)} />}
                      className="w-full"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard className="size-4" /> Dashboard
                    </Button>
                    <Button
                      render={<Link href="/dashboard/profile" />}
                      variant="outline"
                      className="w-full"
                      onClick={() => setMobileOpen(false)}
                    >
                      <UserRound className="size-4" /> Update Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive"
                      onClick={() => {
                        setMobileOpen(false);
                        void handleSignOut();
                      }}
                    >
                      <LogOut className="size-4" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      render={<Link href="/sign-in" />}
                      variant="outline"
                      className="w-full"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Button>
                    <Button
                      render={<Link href="/sign-up" />}
                      className="w-full"
                      onClick={() => setMobileOpen(false)}
                    >
                      Create account
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
