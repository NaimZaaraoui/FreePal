import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseClient";
import { UserWithRelations } from "../types";

const getUser = async (username: string) => {
  const { data, error } = await supabase
    .from("users")
    .select(
      `*,
    posts_count: posts(count), communities_count: community_members(count)`
    )
    .eq("username", username)
    .single();

  if (error) throw error;
  return {
    ...data,
    posts_count: data.posts_count[0]?.count ?? 0,
    communities_count: data.communities_count[0]?.count ?? 0
  } as UserWithRelations;;
};

export const useGetUserQuery = (username: string) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: () => getUser(username),
  });
};
