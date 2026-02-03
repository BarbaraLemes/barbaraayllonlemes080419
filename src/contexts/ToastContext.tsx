import { createContext, useContext, useRef, type ReactNode } from "react";
import { Toast } from "primereact/toast";

type ToastSeverity = "success" | "info" | "warn" | "error";

interface ToastContextData {
  showToast: (severity: ToastSeverity, summary: string, detail: string, life?: number) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const toast = useRef<Toast>(null);

  const showToast = (
    severity: ToastSeverity,
    summary: string,
    detail: string,
    life: number = 3000
  ) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }

  return context;
}
