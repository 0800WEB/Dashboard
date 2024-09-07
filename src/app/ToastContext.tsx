import { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

// Crear el contexto de Toast
export const ToastContext = createContext<React.RefObject<Toast> | null>(null);

// Proveedor de Toast
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  // Definir la referencia de Toast con el tipo correcto
  const toastRef = useRef<Toast>(null);

  return (
    <ToastContext.Provider value={toastRef}>
      <Toast ref={toastRef} /> {/* Asignar la referencia a la instancia de Toast */}
      {children}
    </ToastContext.Provider>
  );
};

// Hook para acceder al Toast
export const useToast = () => {
  return useContext(ToastContext);
};
