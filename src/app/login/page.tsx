"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'; // For loading spinner

const LoginPage: React.FC = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/'); // Redirect to home page if already logged in
    }
  }, [user, router]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // The redirection will be handled by the useEffect hook
      // or you can explicitly redirect here after successful sign-in if preferred
    } catch (error) {
      console.error("Login page sign-in error:", error);
      // Optionally, display an error message to the user on this page
    }
  };

  if (loading && !user) { // Show loading indicator if auth state is loading and no user yet
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        <p className="mt-4 text-lg text-gray-700">Loading user session...</p>
      </div>
    );
  }
  
  if (user) { // If user becomes available while on this page (e.g. due to session persistence)
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        <p className="mt-4 text-lg text-gray-700">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-teal-500 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl text-center max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
          Welcome Back!
        </h1>
        <p className="text-gray-600 mb-8 text-sm sm:text-base">
          Sign in to access your Job Application Advisor and continue your journey.
        </p>
        <Button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-base sm:text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In with Google"
          )}
        </Button>
        <p className="mt-6 text-xs text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
       <p className="mt-8 text-center text-sm text-white">
        Powered by JobAdvisor
      </p>
    </div>
  );
};

export default LoginPage;
