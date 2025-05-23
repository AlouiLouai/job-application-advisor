"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation'; // Keep router for now, might be used for other things
import { Loader2, Settings as SettingsIcon, AlertTriangle } from 'lucide-react'; // Added AlertTriangle

const SettingsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter(); // Keep router for now

  useEffect(() => {
    // No redirect logic needed here due to conditional rendering below
    // If user or authLoading changes, the component will re-render and evaluate the conditions.
  }, [user, authLoading]); // Simplified dependencies, router not strictly needed for this effect now

  if (authLoading) { // Show loader
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        <p className="mt-4 text-lg text-gray-700">Loading user session...</p>
      </div>
    );
  }

  if (!user) { // If no user, show sign-in prompt
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-6" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">Access Denied</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          You need to be signed in to view settings. Please use the 'Sign In' button in the header to authenticate.
        </p>
      </div>
    );
  }

  // Original page content follows if user is authenticated
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-2xl">
      <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
        <div className="flex items-center mb-6">
          <SettingsIcon className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Application Settings
          </h1>
        </div>
        
        <div className="space-y-6">
          {/* Placeholder for future settings content */}
          <div className="p-4 border border-gray-200 rounded-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">General Settings</h2>
            <p className="text-sm text-gray-600">
              General application settings will be available here. (e.g., theme, language)
            </p>
            {/* Example of a disabled setting item */}
            <div className="mt-4">
                <label htmlFor="language-select" className="block text-sm font-medium text-gray-500">Language (Coming Soon)</label>
                <select id="language-select" disabled className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-500">
                    <option>English</option>
                </select>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Notification Preferences</h2>
            <p className="text-sm text-gray-600">
              Manage your notification settings here. (Coming Soon)
            </p>
             <div className="mt-4 space-y-2">
                <div className="flex items-center">
                    <input id="email-notifications" name="email-notifications" type="checkbox" disabled className="h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-100" />
                    <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-500">Email Notifications</label>
                </div>
                 <div className="flex items-center">
                    <input id="push-notifications" name="push-notifications" type="checkbox" disabled className="h-4 w-4 text-indigo-600 border-gray-300 rounded bg-gray-100" />
                    <label htmlFor="push-notifications" className="ml-2 block text-sm text-gray-500">Push Notifications</label>
                </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Account Settings</h2>
            <p className="text-sm text-gray-600">
              Manage your account-related settings. (e.g., delete account - Coming Soon)
            </p>
             <button
                type="button"
                disabled
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 opacity-50 cursor-not-allowed"
            >
                Delete Account (Coming Soon)
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
