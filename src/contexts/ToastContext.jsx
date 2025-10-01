import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const addToast = useCallback((message, type = 'info') => {
    // Use combination of timestamp, random number, and counter for truly unique IDs
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${counterRef.current}`;
    counterRef.current += 1;
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              min-w-[300px] max-w-md p-4 rounded-lg shadow-lg border-l-4 
              transform transition-all duration-300 ease-in-out
              animate-slide-in
              ${
                toast.type === 'success'
                  ? 'bg-green-50 border-green-500'
                  : toast.type === 'error'
                  ? 'bg-red-50 border-red-500'
                  : toast.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-500'
                  : 'bg-blue-50 border-blue-500'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">
                  {toast.type === 'success' && '✅'}
                  {toast.type === 'error' && '❌'}
                  {toast.type === 'warning' && '⚠️'}
                  {toast.type === 'info' && 'ℹ️'}
                </span>
                <p
                  className={`text-sm font-medium ${
                    toast.type === 'success'
                      ? 'text-green-800'
                      : toast.type === 'error'
                      ? 'text-red-800'
                      : toast.type === 'warning'
                      ? 'text-yellow-800'
                      : 'text-blue-800'
                  }`}
                >
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className={`ml-4 text-lg ${
                  toast.type === 'success'
                    ? 'text-green-600 hover:text-green-800'
                    : toast.type === 'error'
                    ? 'text-red-600 hover:text-red-800'
                    : toast.type === 'warning'
                    ? 'text-yellow-600 hover:text-yellow-800'
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
