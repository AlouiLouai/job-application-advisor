"use client";
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertTriangle, BookOpen } from 'lucide-react'; // Added BookOpen for icon

const ResourcesPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        <p className="mt-4 text-lg text-gray-700">Loading user session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-6" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">Access Denied</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          You need to be signed in to view the Resources page. Please use the Sign In button in the header to authenticate.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-2xl pb-16">
      <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
        <div className="flex items-center mb-6">
          <BookOpen className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Resources
          </h1>
        </div>
        <div className="space-y-6">
          <p className="text-gray-600">
            This is the placeholder for the Resources page. Helpful articles, links, and tools for job seekers will be available here.
          </p>
          {/* Further content will be added based on specific feature requirements */}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
