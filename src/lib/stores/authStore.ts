import { supabase } from '$lib/supabase';
import { writable } from 'svelte/store';
import { AuthError, type Session, type User } from '@supabase/supabase-js';

// Create a store with an initial state of null (not logged in)
export const user = writable<User | null>(null);
export const session = writable<Session | null>(null);

// Initialize the auth store with the current session
export const initializeAuth = async () => {
  // Get the current session
  const { data } = await supabase.auth.getSession();
  
  if (data.session) {
    session.set(data.session);
    user.set(data.session.user);
  }

  // Listen for auth changes
  supabase.auth.onAuthStateChange((event, newSession) => {
    session.set(newSession);
    user.set(newSession?.user ?? null);
  });
};

// Helper functions for auth
export const signUp = async (email: string, password: string, username: string) => {
  const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: username } } });
  return { error };
};

export const signIn = async (username: string, password: string) => {
  const email = `${username}@gmaul.com`;

  console.log(`signIn: ${email}, ${password}`);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
}; 