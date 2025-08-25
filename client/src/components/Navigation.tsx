import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Brain, Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="text-primary text-2xl" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              AI Doubt Solver
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/"
                  className={cn(
                    "text-gray-600 dark:text-gray-300 hover:text-primary transition-colors",
                    isActive("/") && "text-primary font-medium"
                  )}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/history"
                  className={cn(
                    "text-gray-600 dark:text-gray-300 hover:text-primary transition-colors",
                    isActive("/history") && "text-primary font-medium"
                  )}
                >
                  History
                </Link>
                <Link 
                  href="/pricing"
                  className={cn(
                    "text-gray-600 dark:text-gray-300 hover:text-primary transition-colors",
                    isActive("/pricing") && "text-primary font-medium"
                  )}
                >
                  Pricing
                </Link>
              </>
            ) : (
              <>
                <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Pricing
                </a>
              </>
            )}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
              data-testid="button-theme-toggle"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.profileImageUrl && (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    data-testid="img-avatar"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/api/logout'}
                  data-testid="button-logout"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-login"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-signup"
                >
                  Sign Up
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-slate-700 py-4">
            <div className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/"
                    className={cn(
                      "text-gray-600 dark:text-gray-300 hover:text-primary transition-colors",
                      isActive("/") && "text-primary font-medium"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/history"
                    className={cn(
                      "text-gray-600 dark:text-gray-300 hover:text-primary transition-colors",
                      isActive("/history") && "text-primary font-medium"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    History
                  </Link>
                  <Link 
                    href="/pricing"
                    className={cn(
                      "text-gray-600 dark:text-gray-300 hover:text-primary transition-colors",
                      isActive("/pricing") && "text-primary font-medium"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                </>
              ) : (
                <>
                  <a 
                    href="#features" 
                    className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a 
                    href="#pricing" 
                    className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
