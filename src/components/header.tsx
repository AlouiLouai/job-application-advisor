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
  LogIn, // Added LogIn
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isLoading, signInWithGoogle, signOutUser } = useAuth(); // Use AuthContext

  // Close dropdown when clicking outside
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

  // Updated getInitials function
  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(" ")
        .filter(part => part.length > 0) // Ensure parts are not empty strings
        .map((part) => part[0])
        .join("")
        .toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U"; // Default fallback
  };

  return (
    <>
      <header className="w-full bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-sm p-2 text-center font-medium hidden md:block">
        🚧 The top navbar is under construction — features coming soon!
      </header>
      <header className="bg-white border-b border-gray-200 py-3 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Added md:mr-8 for larger screens, reduced default margin */}
            <div className="text-green-600 font-bold text-lg mr-4 md:mr-8">
              JobAdvisor
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Applications
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Resources
              </Link>
            </nav>
          </div>

          {/* Adjusted spacing for icons on different screen sizes */}
          <div className="flex items-center space-x-2 md:space-x-4">
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

            {/* Auth section: Loading, User Dropdown, or Sign In Button */}
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-1 md:space-x-2 focus:outline-none"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.displayName || "User"}
                    />
                    <AvatarFallback>{getInitials(user.displayName, user.email)}</AvatarFallback>
                  </Avatar>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email || "No email"}
                      </p>
                    </div>

                    <div className="py-1">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="h-4 w-4 mr-3 text-gray-500" />
                        Your Profile
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="h-4 w-4 mr-3 text-gray-500" />
                        Settings
                      </button>
                    </div>

                    <div className="py-1 border-t border-gray-100">
                      <button 
                        onClick={async () => {
                          await signOutUser();
                          setIsDropdownOpen(false); // Close dropdown
                        }}
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
              <Button 
                variant="outline" 
                onClick={signInWithGoogle}
                className="text-sm"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign in with Google
              </Button>
            )}
            {/* End Auth section */}
          </div>
        </div>
      </header>
    </>
  );
}
