import { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../config/supabaseClient";

type Table =
  | "users"
  | "posts"
  | "comments"
  | "reactions"
  | "communities"
  | "community_members";

export const useRealtimeSubscription = (tables: Table[]) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Create a channel for each table
    const channels: RealtimeChannel[] = tables.map((table) =>
      supabase
        .channel(`${table}-channel`)
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
            schema: "public",
            table,
          },
          async (payload) => {
            console.log("Change received!", payload);

            // Invalidate relevant queries based on the table and event
            switch (table) {
              case "posts":
                queryClient.invalidateQueries({ queryKey: ["posts"] });
                // Invalidate the post query if the event is not INSERT
                if (
                  payload.eventType !== "INSERT" &&
                  payload.new &&
                  "id" in payload.new
                ) {
                  queryClient.invalidateQueries({
                    queryKey: ["post", payload.new.id],
                  });
                }
                break;
              case "reactions":
                queryClient.invalidateQueries({ queryKey: ["posts"] });
                if (payload.new && "post_id" in payload.new) {
                  queryClient.invalidateQueries({
                    queryKey: ["post", payload.new.post_id],
                  });
                }
                break;
              case "comments":
                if (payload.new && "post_id" in payload.new) {
                  // Invalidate post comments query
                  queryClient.invalidateQueries({
                    queryKey: ["comments", payload.new.post_id],
                  });
                  // Invalidate single post query to update comment count
                  queryClient.invalidateQueries({
                    queryKey: ["post", payload.new.post_id],
                  });
                  // Invalidate posts list to update comment counts
                  queryClient.invalidateQueries({
                    queryKey: ["posts"],
                  });
                } else if (payload.old && "post_id" in payload.old) {
                  // Handle deletions by using the old record
                  queryClient.invalidateQueries({
                    queryKey: ["comments", payload.old.post_id],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["post", payload.old.post_id],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["posts"],
                  });
                }
                break;

              case "users":
                queryClient.invalidateQueries({ queryKey: ["users"] });
                if (
                  payload.eventType !== "INSERT" &&
                  payload.new &&
                  "username" in payload.new
                ) {
                  queryClient.invalidateQueries({
                    queryKey: ["user", payload.new.username],
                  });
                }
                break;

              case "communities":
                queryClient.invalidateQueries({ queryKey: ["communities"] });
                if (
                  payload.eventType !== "INSERT" &&
                  payload.new &&
                  "id" in payload.new
                ) {
                  queryClient.invalidateQueries({
                    queryKey: ["community", payload.new.id],
                  });
                }
                break;
              case "community_members":
                queryClient.invalidateQueries({ queryKey: ["communities"] });
                if (payload.new && "community_id" in payload.new) {
                  queryClient.invalidateQueries({
                    queryKey: ["community", payload.new.community_id],
                  });
                }
                break;
            }
          }
        )
        .subscribe()
    );

    // Cleanup on unmount
    return () => {
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, [queryClient]);
};
