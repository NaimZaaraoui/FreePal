// This file is used to export all the routes in the application
// for easier import in other files. It imports all the components and layouts
// and exports them as default.
// This way, we can import all the routes in one line instead of importing each one separately.

export { default as BaseLayout } from "./layouts/BaseLayout";
export { default as ProtectedRoute } from "./components/ProtectedRoute";
export { default as UnderConstruction } from "./pages/UnderConstruction";
export { default as Home } from "./pages/Home";
export { default as Register } from "./pages/Register";
export { default as Login } from "./pages/Login";
export { default as NotFound } from "./pages/NotFound";
export { default as Posts } from "./pages/Posts";
export { default as SinglePost } from "./pages/SinglePost";
export { default as Profile } from "./pages/Profile";
export { default as Settings } from "./pages/Settings";
export { default as CommunityCreate } from "./pages/CommunityCreate";
export { default as Communities } from "./pages/Communities";
export { default as SingleCommunity } from "./pages/SingleCommunity";
