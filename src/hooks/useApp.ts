import useAppContext from "./useAppContext";

export default function useApp() {
  const { app } = useAppContext();
  return app;
}
