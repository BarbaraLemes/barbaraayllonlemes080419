import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

// Lazy loading das páginas
const Login = lazy(() => import("../modules/auth/pages/Login"));
const PetList = lazy(() => import("../modules/pets/pages/PetList"));
const PetDetail = lazy(() => import("../modules/pets/pages/PetDetail"));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-slate-600">Carregando...</div>
  </div>
);

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/pets",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <PetList />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/pets/:id",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <PetDetail />
        </Suspense>
      </ProtectedRoute>
    ),
  },
]);
