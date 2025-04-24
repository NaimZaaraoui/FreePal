import { createBrowserRouter } from "react-router";
import {
  BaseLayout,
  Communities,
  CommunityCreate,
  Home,
  Login,
  NotFound,
  Posts,
  Profile,
  Register,
  Settings,
  SingleCommunity,
  SinglePost,
  ProtectedRoute,
  UnderConstruction,
} from "./routes";

export const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      { path: "/signup", element: <Register /> },
      { path: "/login", element: <Login /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/profile/:username", element: <Profile /> },
          { path: "/settings", element: <Settings /> },
          { path: "/posts", element: <Posts /> },
          { path: "/posts/:id", element: <SinglePost /> },
          { path: "/communities", element: <Communities /> },
          { path: "/communities/:id", element: <SingleCommunity /> },
          { path: "/communities/create", element: <CommunityCreate /> },
          {
            path: "/messages",
            element: <UnderConstruction pageName="Messages Page" />,
          },
          {
            path: "/explore",
            element: <UnderConstruction pageName="Explore Page" />,
          },
          {
            path: "/users",
            children: [
              {
                index: true,
                element: <UnderConstruction pageName="Users Page" />,
              },
              {
                path: ":id",
                element: <UnderConstruction pageName="User Page" />,
              },
            ],
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
