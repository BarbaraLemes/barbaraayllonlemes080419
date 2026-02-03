import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { router } from "./routes/index";
import { authFacade } from "./modules/auth/services/auth.facade";
import { ToastProvider } from "./contexts/ToastContext";

export default function App() {
  useEffect(() => {
    authFacade.checkAuth();
  }, []);

  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}