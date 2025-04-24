import useAppContext from "./useAppContext";

export default function useAuth() {
  const { auth } = useAppContext();
  

  const role = auth.user?.user_metadata.role ?? "user";

  const isAdmin = role === "admin" || role === "super_admin";
  const isSuperAdmin = role === "super_admin";

  

  return {
    ...auth,
    role,
    isAdmin,
    isSuperAdmin,
  };
}
