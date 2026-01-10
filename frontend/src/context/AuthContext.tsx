import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import supabase from "@/config/supabaseClient";
import { AuthError, AuthResponse, Session, User } from "@supabase/supabase-js";

type AuthResult =
  | { success: true; data: AuthResponse["data"] }
  | { success: false; error: AuthError | Error };

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUpNewUser: (email: string, password: string) => Promise<AuthResult>;
  logInUser: (email: string, password: string) => Promise<AuthResult>;
  logOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to unify auth responses
  const handleAuthAction = async (
    action: () => Promise<AuthResponse>
  ): Promise<AuthResult> => {
    try {
      const { data, error } = await action();
      if (error) return { success: false, error };
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  };

  const signUpNewUser = (email: string, password: string) =>
    handleAuthAction(() => supabase.auth.signUp({ email, password }));

  const logInUser = (email: string, password: string) =>
    handleAuthAction(() =>
      supabase.auth.signInWithPassword({ email, password })
    );

  const logOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign out error:", error.message);
  };

  useEffect(() => {
    // Sync initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes (sign-in, sign-out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signUpNewUser,
    logInUser,
    logOutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
