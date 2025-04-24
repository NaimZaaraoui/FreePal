import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseClient";
import useApp from "../hooks/useApp";
import { useNavigate } from "react-router";

interface SignupData {
  email: string;
  password: string;
  username: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const signup = async ({ email, password, username }: SignupData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error("Failed to create user account");

  return data.user;
};

export const useSignupMutation = () => {
  const { setError, showToast } = useApp();
  const navigateTo = useNavigate();
  return useMutation({
    mutationFn: signup,
    onSuccess: () => {
      showToast({
        type: "success",
        title: "Account created successfully!",
        message: "Please check your email to confirm your account.",
      });
      navigateTo("/login");
    },
    onError(error) {
      setError(error.message);
    },
  });
};

const login = async ({ email, password }: LoginCredentials) => {
  // First authenticate
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Login failed");

  // Then fetch user data including role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role, username, profile_picture_url")
    .eq("id", authData.user.id)
    .single();

  if (userError) throw userError;

  // Update user metadata with role and other user info
  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      role: userData.role,
      username: userData.username,
      profile_picture_url: userData.profile_picture_url,
    },
  });

  if (updateError) throw updateError;

  return {
    ...authData.user,
    user_metadata: {
      ...authData.user.user_metadata,
      role: userData.role,
      username: userData.username,
      profile_picture_url: userData.profile_picture_url,
    },
  };
};

export const useLoginMutation = () => {
  const { setError, showToast } = useApp();
  const navigateTo = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess(data) {
      showToast({
        type: "success",
        title: "Welcome back!",
        message: `You are now logged in as ${data.user_metadata.username}`,
      });
      navigateTo("/");
    },
    onError(error) {
      setError(error.message);
    },
  });
};
