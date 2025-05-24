"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Edit3, Save, Loader2, Camera, AlertTriangle } from 'lucide-react'; 
import { updateProfile } from 'firebase/auth';

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // No redirect here, just rely on the conditional rendering below
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset fields if canceling edit
      if (user) {
        setDisplayName(user.displayName || '');
        setPhotoURL(user.photoURL || '');
      }
    }
    setIsEditing(!isEditing);
    setError(null); 
    setSuccessMessage(null);
  };

  const handleSaveChanges = async () => {
    if (!user) {
      setError("User not found. Please sign in again.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });
      // Refresh user state in useAuth by re-fetching or relying on onAuthStateChanged
      // For now, Firebase SDK usually triggers onAuthStateChanged, which should update the context.
      // If not, a manual refresh function in useAuth might be needed.
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  if (authLoading) { // Show loader while auth state is resolving
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        <p className="mt-4 text-lg text-gray-700">Loading user session...</p>
      </div>
    );
  }

  if (!user) { // If no user after loading, show sign-in prompt
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-6" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">Access Denied</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          You need to be signed in to view your profile. Please use the Sign In button in the header to authenticate.
        </p>
      </div>
    );
  }

  // Original page content follows if user is authenticated
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-2xl">
      <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
        <div className="flex flex-col items-center sm:flex-row sm:items-start mb-8">
          <div className="relative group mb-4 sm:mb-0 sm:mr-6">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 text-xl border-4 border-gray-200 group-hover:border-green-500 transition-colors">
              <AvatarImage src={photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback className="text-3xl bg-gray-200 text-gray-700 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                {user.displayName ? getInitials(user.displayName) : <User size={48} />}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
                 <label htmlFor="photo-upload" className="absolute -bottom-2 -right-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110">
                    <Camera size={18} />
                    <input id="photo-upload" type="file" accept="image/*" className="hidden" 
                        // onChange={handlePhotoUpload} // Future: Implement actual photo upload
                        // For now, photoURL is a text input
                    />
                </label>
            )}
          </div>

          <div className="text-center sm:text-left flex-grow">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              {isEditing ? 'Edit Profile' : user.displayName || 'Your Profile'}
            </h1>
            <p className="text-gray-600 text-sm mb-4">{user.email}</p>
            {!isEditing && (
              <Button onClick={handleEditToggle} variant="outline" size="sm" className="transition-all hover:bg-green-500 hover:text-white">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
        {successMessage && <p className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-md">{successMessage}</p>}

        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700 mb-1">
                Photo URL
              </label>
              <Input
                id="photoURL"
                type="text"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm"
                placeholder="Link to your profile picture"
              />
               <p className="mt-1 text-xs text-gray-500">Enter a URL for your profile picture. Direct uploads coming soon!</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <Button onClick={handleEditToggle} variant="outline" className="w-full sm:w-auto transition-colors">
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} disabled={isSaving} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white transition-colors">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Profile Information</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.displayName || 'Not set'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Photo URL</dt>
                <dd className="mt-1 text-sm text-gray-900 break-all">{user.photoURL || 'Not set'}</dd>
              </div>
              {/* Add more fields as needed, e.g., user ID */}
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900 break-all">{user.uid}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
      <div id="settings" className="mt-10">
        {/* Placeholder for future settings section, can be linked from header */}
        {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2> */}
        {/* <p className="text-gray-600">General application settings will be available here.</p> */}
      </div>
    </div>
  );
};

export default ProfilePage;
