import { createContext, useState, useContext, type ReactNode } from "react";

const ToastContext = createContext<any>(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className="fixed bottom-5 right-5 px-4 py-2 bg-green-600 text-white rounded shadow-lg animate-slide-in">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
};
