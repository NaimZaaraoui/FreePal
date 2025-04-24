import { supabase } from "./config/supabaseClient";

export const signupAction = async (_: unknown, formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  try {
    // First, create the user account
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) throw error;
    if (!authData.user) throw new Error("Failed to create user account");

    return {
      success: true,
      message:
        "Signup successful! Please check your email to confirm your account.",
    };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Failed to signup!",
    };
  }
};
