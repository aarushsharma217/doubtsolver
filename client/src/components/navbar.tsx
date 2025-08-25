import { Link, useLocation } from 'wouter';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <Brain className="text-primary text-2xl" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">AI Doubt Solver</span>
          </Link>
          
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/dashboard" 
                className={`text-gray-600 dark:text-gray-300 hover:text-primary transition-colors ${
                  location === '/dashboard' ? 'text-primary' : ''
                }`}
                data-testid="link-dashboard"
              >
                Dashboard
              </Link>
              <Link 
                href="/history" 
                className={`text-gray-600 dark:text-gray-300 hover:text-primary transition-colors ${
                  location === '/history' ? 'text-primary' : ''
                }`}
                data-testid="link-history"
              >
                History
              </Link>
              <Link 
                href="/pricing" 
                className={`text-gray-600 dark:text-gray-300 hover:text-primary transition-colors ${
                  location === '/pricing' ? 'text-primary' : ''
                }`}
                data-testid="link-pricing"
              >
                Pricing
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors" data-testid="link-features">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors" data-testid="link-pricing">
                Pricing
              </a>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300" data-testid="text-user-email">
                  {user?.email}
                </span>
                <Button 
                  variant="outline" 
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
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-login"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-signup"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
