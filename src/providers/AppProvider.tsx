import { ReactNode, useEffect, useState } from "react";
import {
  AppContext,
  AppContextType,
  AppState,
  AuthState,
  CustomUser,
  initialAppState,
  initialAuthState,
  ShowToastParams,
} from "../contexts/AppContext";
import { supabase } from "../config/supabaseClient";
import { toast, ToastOptions } from "react-toastify";
import Toast from "../components/Toast";

interface Props {
  children: ReactNode;
}

const AppProvider = ({ children }: Props) => {
  // Variables
  const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    className: "toast-custom",
  };

  // State
  const [appState, setAppState] = useState<AppState>(initialAppState);
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  // Side Effects
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Fetch user data including role
        const { data: userData } = await supabase
          .from("users")
          .select("role, username, profile_picture_url")
          .eq("id", session.user.id)
          .single();

        if (userData) {
          // Update user metadata
          await supabase.auth.updateUser({
            data: {
              role: userData.role,
              username: userData.username,
              profile_picture_url: userData.profile_picture_url,
            },
          });
        }
      }

      setAuthState((prev) => ({
        ...prev,
        user: (session?.user as CustomUser) ?? null,
        loading: false,
      }));
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthState((prev) => ({
        ...prev,
        user: (session?.user as CustomUser) ?? null,
        loading: false,
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (appState.error) {
      showToast({ type: "error",title: "Error", message: appState.error });
      setError(null); // Clear the error after displaying it
    }
  }, [appState.error]);

  // Actions
  const toggleMenu = (status: boolean) => {
    setAppState((prev) => ({ ...prev, isMenuOpen: status }));
  };
  const setError = (error: string | null) => {
    setAppState((prev) => ({ ...prev, error }));
  };
  const showToast = (toastParams: ShowToastParams) => {
    toast(() => <Toast {...toastParams} />, defaultOptions);
  };

  const signInWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
      });

      if (error) throw error;
    } catch (e) {
      setError("Failed to sign in with GitHub. Please try again.");
      console.error("Error signing in with GitHub:", e);
    }
  };
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (e) {
      setError("Failed to sign out. Please try again.");
      console.error("Error signing out:", e);
    }
  };

  // Context value
  const value: AppContextType = {
    app: {
      ...appState,
      toggleMenu,
      setError,
      showToast,
    },
    auth: {
      ...authState,
      signInWithGithub,
      signOut,
    },
  };

  return <AppContext value={value}>{children}</AppContext>;
};

export default AppProvider;
