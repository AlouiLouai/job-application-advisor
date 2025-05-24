"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Bell,
  HelpCircle,
  Settings,
  User,
  LogOut,
  Menu, 
  LogIn, 
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation"; 

export default function Header() {
  const { user, loading, signOut, signInWithGoogle } = useAuth(); // Added signInWithGoogle for direct login
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // UI should reactively update based on useAuth state changes
      // No explicit redirect needed here as onAuthStateChanged will trigger updates
    } catch (error) {
      console.error("Error signing in from header:", error);
      // Optionally show an error to the user
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsDropdownOpen(false); 
      router.push('/'); // Redirect to home page after sign out
    } catch (error) {
      console.error("Error signing out from header:", error);
    }
  };

  return (
    <>
      <header className="w-full bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-sm p-2 text-center font-medium hidden md:block">
        🚧 The top navbar is under construction — features coming soon!
      </header>
      <header className="bg-white border-b border-gray-200 py-3 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="md:hidden mr-3 text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="text-green-600 font-bold text-lg mr-2 md:mr-8">
              JobAdvisor
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/" 
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="#" // Placeholder for Applications page
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Applications
              </Link>
              <Link
                href="#" // Placeholder for Resources page
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Resources
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-gray-900"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-gray-900"
            >
              <Bell className="h-5 w-5" />
            </Button>

            {loading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-1 focus:outline-none"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarImage
                      src={user.photoURL || "/placeholder.svg"} 
                      alt={user.displayName || "User"}
                    />
                    <AvatarFallback>
                      {user.displayName ? getInitials(user.displayName) : <User className="h-4 w-4"/>}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform hidden md:block ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.displayName || "No Name"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email || "No Email"}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link href="/profile" passHref>
                        <button
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User className="h-4 w-4 mr-3 text-gray-500" />
                          Your Profile
                        </button>
                      </Link>
                      <Link href="/settings" passHref> 
                        <button
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Settings className="h-4 w-4 mr-3 text-gray-500" />
                          Settings
                        </button>
                      </Link>
                    </div>

                    <div className="py-1 border-t border-gray-100">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-3 text-red-500" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Sign In button now directly calls handleSignIn
              <Button variant="outline" className="text-sm" onClick={handleSignIn}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 border-t border-gray-200 pt-3">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="#" // Placeholder for Applications page
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)} 
              >
                Applications 
              </Link>
              <Link
                href="#" // Placeholder for Resources page
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Resources
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
