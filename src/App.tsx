import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { router } from "./routes/index";
import { authFacade } from "./modules/auth/services/auth.facade";

export default function App() {
  useEffect(() => {
    authFacade.checkAuth();
  }, []);

  return <RouterProvider router={router} />;
}