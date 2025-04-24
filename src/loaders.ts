import { redirect } from "react-router";
import { supabase } from "./config/supabaseClient";

/**
 * Route loader to require authentication.
 * Redirects to login page if user is not authenticated.
 * Supports redirect back to originally requested page after login.
 */
export const requireAuth = async ({ request }: { request: Request }) => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching user:", error);
      // Optionally handle error differently
      return redirect("/login");
    }

    if (!user) {
      // Redirect to login with redirectTo param to return after login
      const redirectTo = new URL(request.url).pathname;
      return redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
    }

    // User is authenticated, allow access
    return null;
  } catch (err) {
    console.error("Unexpected error in requireAuth loader:", err);
    return redirect("/login");
  }
};
