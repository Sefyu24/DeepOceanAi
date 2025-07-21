"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import {
  Menu,
  Waves,
  FileText,
  MessageCircle,
  Settings,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./toggleTheme";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<{
    user: { id: string; name: string; email: string };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      try {
        const sessionData = await authClient.getSession();
        setSession(sessionData.data);
      } catch (error) {
        console.error("Error getting session:", error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();
  }, []);

  const navItems = [
    { name: "Features", href: "#features", icon: FileText },
    { name: "Chat AI", href: "/chat", icon: MessageCircle },
    { name: "Pricing", href: "#pricing", icon: Settings },
    { name: "About", href: "#about", icon: User },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/20 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-chart-5 rounded-lg flex items-center justify-center">
              <Waves className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Deep Ocean
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled
                    ? "text-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="w-20 h-10 bg-muted rounded animate-pulse" />
            ) : session ? (
              <>
                <ModeToggle />
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="ghost"
                  className={`transition-colors ${
                    isScrolled
                      ? "text-foreground/80 hover:text-slate-900 dark:hover:text-slate-100"
                      : "text-muted-foreground hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Dashboard
                </Button>
                <Button
                  onClick={async () => {
                    await authClient.signOut();
                    setSession(null);
                    router.push("/");
                  }}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => router.push("/signin")}
                  variant="ghost"
                  className={`transition-colors ${
                    isScrolled
                      ? "text-foreground/80 hover:text-slate-900 dark:hover:text-slate-100"
                      : "text-muted-foreground hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push("/signin")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`transition-colors ${
                    isScrolled
                      ? "text-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-background/95 backdrop-blur-md"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  {/* Mobile Logo */}
                  <div className="flex items-center gap-2 pb-4 border-b border-border">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-chart-5 rounded-lg flex items-center justify-center">
                      <Waves className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold text-foreground">
                      Deep Ocean
                    </span>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                      >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </a>
                    ))}
                  </div>

                  {/* Mobile CTA Buttons */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-border">
                    {isLoading ? (
                      <div className="w-full h-10 bg-muted rounded animate-pulse" />
                    ) : session ? (
                      <>
                        <ModeToggle />
                        <Button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push("/dashboard");
                          }}
                          variant="outline"
                          className="w-full justify-center bg-transparent"
                        >
                          Dashboard
                        </Button>
                        <Button
                          onClick={async () => {
                            await authClient.signOut();
                            setSession(null);
                            setIsMobileMenuOpen(false);
                            router.push("/");
                          }}
                          className="w-full justify-center bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push("/signin");
                          }}
                          variant="outline"
                          className="w-full justify-center bg-transparent"
                        >
                          Sign In
                        </Button>
                        <Button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            router.push("/signin");
                          }}
                          className="w-full justify-center bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Get Started
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
