import { User as SupaUser } from "@supabase/supabase-js";
import { createContext } from "react";

// Global state
type ToastType = "success" | "error" | "info";
interface ShowToastParams {
  type?: ToastType;
  title: string;
  message?: string;
}

interface AppState {
  isMenuOpen: boolean;
  error: string | null;
}
interface AppActions {
  toggleMenu: (status: boolean) => void;
  setError: (error: string | null) => void;
  showToast: ({ type, title, message }: ShowToastParams) => void;
}
const initialAppState: AppState = {
  isMenuOpen: false,
  error: null,
};

// Extend SupaUser type to include our custom metadata
interface CustomUserMetadata {
  role: "user" | "admin" | "super_admin";
  username: string;
  profile_picture_url?: string;
}

interface CustomUser extends Omit<SupaUser, "user_metadata"> {
  user_metadata: CustomUserMetadata;
}

// Auth state
interface AuthState {
  user: CustomUser | null;
  loading: boolean;
}
interface AuthActions {
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
}
const initialAuthState: AuthState = {
  user: null,
  loading: true,
};

interface AppContextType {
  app: AppState & AppActions;
  auth: AuthState & AuthActions;
}

const AppContext = createContext<AppContextType | null>(null);

export { initialAppState, initialAuthState, AppContext };
export type {
  AppState,
  AppActions,
  CustomUser,
  AuthState,
  AuthActions,
  AppContextType,
  ShowToastParams,
};
