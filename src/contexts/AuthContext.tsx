
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthProvider: Component rendering, isLoading:', isLoading);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('AuthProvider: Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('AuthProvider: Error fetching user profile:', error);
        return;
      }

      if (data) {
        console.log('AuthProvider: Profile fetched successfully:', data);
        setProfile(data as Profile);
      } else {
        console.log('AuthProvider: No profile found for user, will need to create one');
        setProfile(null);
      }
    } catch (error) {
      console.error('AuthProvider: Error in fetchUserProfile:', error);
    }
  };

  const createUserProfile = async (userId: string, metadata: any) => {
    try {
      console.log('AuthProvider: Creating profile for user:', userId, metadata);
      const { first_name, last_name, phone_number, profile_privacy_setting, phone_number_searchable } = metadata;
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: first_name || '',
          last_name: last_name || '',
          full_name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
          phone_number: phone_number || null,
          profile_privacy_setting: profile_privacy_setting || 'private',
          phone_number_searchable: phone_number_searchable || false,
        });

      if (profileError) {
        console.error('AuthProvider: Error creating profile:', profileError);
      } else {
        console.log('AuthProvider: Profile created successfully');
        // Fetch the newly created profile
        await fetchUserProfile(userId);
      }
    } catch (error) {
      console.error('AuthProvider: Error in createUserProfile:', error);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up auth listeners');
    
    let isMounted = true;
    
    // Set timeout fallback to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('AuthProvider: Timeout reached, forcing isLoading to false');
        setIsLoading(false);
      }
    }, 8000); // Reduced timeout to 8 seconds

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('AuthProvider: Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Handle sign in event - check if this is a new user registration
          if (event === 'SIGNED_IN' && session.user.user_metadata) {
            console.log('AuthProvider: User signed in, checking for existing profile');
            
            // First try to fetch existing profile
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (!existingProfile) {
              console.log('AuthProvider: No existing profile, creating new one');
              await createUserProfile(session.user.id, session.user.user_metadata);
            } else {
              await fetchUserProfile(session.user.id);
            }
          } else {
            await fetchUserProfile(session.user.id);
          }
        } else {
          setProfile(null);
        }
        
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    );

    // Check for existing session
    console.log('AuthProvider: Checking for existing session');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!isMounted) return;
      
      if (error) {
        console.error('AuthProvider: Error getting session:', error);
        clearTimeout(timeoutId);
        setIsLoading(false);
        return;
      }

      console.log('AuthProvider: Existing session check complete:', session?.user?.id || 'no session');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id).finally(() => {
          if (isMounted) {
            clearTimeout(timeoutId);
            setIsLoading(false);
          }
        });
      } else {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    }).catch((error) => {
      if (isMounted) {
        console.error('AuthProvider: Error in getSession:', error);
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      console.log('AuthProvider: Cleaning up auth listeners');
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = profile?.role === 'ADMIN';

  const value = {
    session,
    user,
    profile,
    isLoading,
    isAdmin,
  };

  console.log('AuthProvider: Providing context value:', { 
    hasSession: !!session, 
    hasUser: !!user, 
    hasProfile: !!profile, 
    isLoading,
    profileName: profile?.full_name
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
