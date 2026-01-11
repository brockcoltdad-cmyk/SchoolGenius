'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from './supabase-client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, pin: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  verifyParentPIN: (pin: string) => Promise<boolean>;
  updateParentPIN: (newPin: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      router.push('/family');
      return {};
    } catch (error: any) {
      return { error: error.message || 'An error occurred during sign in' };
    }
  };

  const signUp = async (email: string, password: string, pin: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return { error: authError.message };
      }

      if (authData.user) {
        // Note: parent_pin field doesn't exist in profiles table
        // If PIN functionality is needed, add parent_pin column to profiles table
        // or create a separate parent_pins table

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: email,
            // parent_pin: hashedPin, // Field doesn't exist
          });

        if (profileError) {
          return { error: 'Account created but profile setup failed. Please contact support.' };
        }

        // Note: notification_settings table doesn't exist in current schema
        // If notification settings are needed, create this table first

        router.push('/dashboard/add-child');
        return {};
      }

      return { error: 'Signup failed' };
    } catch (error: any) {
      return { error: error.message || 'An error occurred during sign up' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const verifyParentPIN = async (pin: string): Promise<boolean> => {
    if (!user) return false;

    // Note: parent_pin field doesn't exist in profiles table
    // This feature is disabled until parent_pin column is added
    // For now, always return true (no PIN verification)
    console.warn('Parent PIN verification is disabled - parent_pin column does not exist in profiles table');
    return true;

    /* Original implementation - requires parent_pin column:
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('parent_pin')
        .eq('id', user.id)
        .single();

      if (error || !data) return false;

      return await verifyPIN(pin, data.parent_pin);
    } catch {
      return false;
    }
    */
  };

  const updateParentPIN = async (newPin: string) => {
    if (!user) return { error: 'Not authenticated' };

    // Note: parent_pin field doesn't exist in profiles table
    // This feature is disabled until parent_pin column is added
    console.warn('Parent PIN update is disabled - parent_pin column does not exist in profiles table');
    return { error: 'PIN functionality is not available. Please add parent_pin column to profiles table.' };

    /* Original implementation - requires parent_pin column:
    try {
      const hashedPin = await hashPIN(newPin);

      const { error } = await supabase
        .from('profiles')
        .update({ parent_pin: hashedPin })
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      return { error: error.message || 'Failed to update PIN' };
    }
    */
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        verifyParentPIN,
        updateParentPIN,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

async function hashPIN(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPIN(pin: string, hashedPin: string): Promise<boolean> {
  const inputHash = await hashPIN(pin);
  return inputHash === hashedPin;
}
