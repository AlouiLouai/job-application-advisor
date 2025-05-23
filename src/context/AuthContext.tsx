"use client"; // This is a client component

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged,
  GoogleAuthProvider, // Import GoogleAuthProvider
  signInWithPopup,    // Import signInWithPopup
  signOut             // Import signOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Adjust path if necessary

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null; // Or a more specific error type
  signInWithGoogle: () => Promise<void>; // Placeholder
  signOutUser: () => Promise<void>;      // Placeholder
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setError(null); // Clear error on successful auth change
      setIsLoading(false);
    }, (authError) => {
      setError(authError);
      setUser(null); // Clear user on auth error
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the user
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error('An unknown error occurred during sign-in.'));
      }
      setUser(null); // Clear user on sign-in error
    } finally {
      // setIsLoading(false); // onAuthStateChanged will set this
    }
  };

  const signOutUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting the user to null
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error('An unknown error occurred during sign-out.'));
      }
    } finally {
      // setIsLoading(false); // onAuthStateChanged will set this
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
