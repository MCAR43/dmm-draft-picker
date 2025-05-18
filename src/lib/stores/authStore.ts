import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// Create a store for the user
export const user = writable<User | null>(null);
export const session = writable<Session | null>(null);

// Initialize user on load
export const initAuth = async () => {
  // Get session data if it exists
  const { data } = await supabase.auth.getSession();
  session.set(data.session);
  user.set(data.session?.user || null);

  // Listen for auth changes
  supabase.auth.onAuthStateChange((event, newSession) => {
    session.set(newSession);
    user.set(newSession?.user || null);
  });
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
};

// Sign up with email and password
export const signUp = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({ email, password });
  return { error };
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
}; 