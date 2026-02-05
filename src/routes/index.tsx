import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import AppLayout from "../layouts/AppLayout";

// Lazy loading das páginas
const Login = lazy(() => import("../modules/auth/pages/Login"));
const PetList = lazy(() => import("../modules/pets/pages/PetList/PetList"));
const PetDetail = lazy(() => import("../modules/pets/pages/PetDetail/PetDetail"));
const PetForm = lazy(() => import("../modules/pets/pages/PetForm/PetForm"));
const TutorList = lazy(() => import("../modules/tutores/pages/TutorList"));
const TutorDetail = lazy(() => import("../modules/tutores/pages/TutorDetail"));
const TutorForm = lazy(() => import("../modules/tutores/pages/TutorForm"));

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
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/pets",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PetList />
          </Suspense>
        ),
      },
      {
        path: "/pets/novo",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PetForm />
          </Suspense>
        ),
      },
      {
        path: "/pets/:id",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PetDetail />
          </Suspense>
        ),
      },
      {
        path: "/pets/:id/editar",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PetForm />
          </Suspense>
        ),
      },
      {
        path: "/tutores",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TutorList />
          </Suspense>
        ),
      },
      {
        path: "/tutores/novo",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TutorForm />
          </Suspense>
        ),
      },
      {
        path: "/tutores/:id",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TutorDetail />
          </Suspense>
        ),
      },
      {
        path: "/tutores/:id/editar",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TutorForm />
          </Suspense>
        ),
      },
    ],
  },
]);
