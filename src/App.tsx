import { RouterProvider } from "react-router";
import { router } from "./router";
import AppProvider from "./providers/AppProvider";
import { useRealtimeSubscription } from "./hooks/useRealtimeSubscription";
import { useState } from "react";
import Preloader from "./components/Preloader";

const App = () => {
  // Subscribe to realtime events for the specified tables
  useRealtimeSubscription([
    "posts",
    "reactions",
    "comments",
    "users",
    "communities",
    "community_members",
  ]);

  const [isLoading, setIsLoading] = useState(true);

  return (
    <AppProvider>
      {isLoading ? (
        <Preloader onLoadingComplete={() => setIsLoading(false)} />
      ) : (
        <RouterProvider router={router} />
      )}
    </AppProvider>
  );
};

export default App;
