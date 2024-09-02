import { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const toastRef = useRef(null);

    return (
        <ToastContext.Provider value={toastRef}>
            <Toast ref={toastRef} />
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    return useContext(ToastContext);
};
