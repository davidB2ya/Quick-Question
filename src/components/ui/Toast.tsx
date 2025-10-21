import toast, { Toaster, ToastOptions } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// Configuración por defecto para todos los toasts
const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-center',
  style: {
    borderRadius: '12px',
    padding: '16px',
    fontSize: '14px',
    fontWeight: '500',
    maxWidth: '500px',
  },
};

// Componente Toaster personalizado
export const ToastContainer = () => (
  <Toaster
    position="top-center"
    reverseOrder={false}
    gutter={8}
    toastOptions={{
      className: '',
      style: {
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        maxWidth: '500px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      },
      success: {
        duration: 4000,
        iconTheme: {
          primary: '#10b981',
          secondary: '#fff',
        },
        style: {
          background: '#f0fdf4',
          color: '#065f46',
          border: '2px solid #10b981',
        },
      },
      error: {
        duration: 5000,
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
        style: {
          background: '#fef2f2',
          color: '#991b1b',
          border: '2px solid #ef4444',
        },
      },
    }}
  />
);

// Toast de éxito
export const showSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    ...defaultOptions,
    ...options,
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
  });
};

// Toast de error
export const showError = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    ...defaultOptions,
    ...options,
    icon: <XCircle className="w-5 h-5 text-red-500" />,
  });
};

// Toast de advertencia
export const showWarning = (message: string, options?: ToastOptions) => {
  toast(message, {
    ...defaultOptions,
    ...options,
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    style: {
      ...defaultOptions.style,
      background: '#fffbeb',
      color: '#92400e',
      border: '2px solid #f59e0b',
    },
  });
};

// Toast de información
export const showInfo = (message: string, options?: ToastOptions) => {
  toast(message, {
    ...defaultOptions,
    ...options,
    icon: <Info className="w-5 h-5 text-blue-500" />,
    style: {
      ...defaultOptions.style,
      background: '#eff6ff',
      color: '#1e40af',
      border: '2px solid #3b82f6',
    },
  });
};

// Toast de carga (para operaciones asíncronas)
export const showLoading = (message: string) => {
  return toast.loading(message, {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: '#f3f4f6',
      color: '#374151',
      border: '2px solid #9ca3af',
    },
  });
};

// Actualizar un toast de carga
export const updateToast = (
  toastId: string,
  type: 'success' | 'error' | 'warning' | 'info',
  message: string
) => {
  switch (type) {
    case 'success':
      toast.success(message, { id: toastId, icon: <CheckCircle className="w-5 h-5" /> });
      break;
    case 'error':
      toast.error(message, { id: toastId, icon: <XCircle className="w-5 h-5" /> });
      break;
    case 'warning':
      toast(message, {
        id: toastId,
        icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        style: {
          background: '#fffbeb',
          color: '#92400e',
          border: '2px solid #f59e0b',
        },
      });
      break;
    case 'info':
      toast(message, {
        id: toastId,
        icon: <Info className="w-5 h-5 text-blue-500" />,
        style: {
          background: '#eff6ff',
          color: '#1e40af',
          border: '2px solid #3b82f6',
        },
      });
      break;
  }
};

// Confirmación personalizada (reemplaza window.confirm)
export const showConfirm = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  options?: {
    confirmText?: string;
    cancelText?: string;
    title?: string;
  }
) => {
  const confirmText = options?.confirmText || 'Confirmar';
  const cancelText = options?.cancelText || 'Cancelar';
  const title = options?.title || '¿Estás seguro?';

  toast(
    (t) => (
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-gray-900 mb-1">{title}</p>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onCancel?.();
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      style: {
        maxWidth: '450px',
        background: '#fff',
        border: '2px solid #f59e0b',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      },
    }
  );
};

// Promesa de confirmación (para async/await)
export const confirmAsync = (
  message: string,
  options?: {
    confirmText?: string;
    cancelText?: string;
    title?: string;
  }
): Promise<boolean> => {
  return new Promise((resolve) => {
    showConfirm(
      message,
      () => resolve(true),
      () => resolve(false),
      options
    );
  });
};

// Cerrar todos los toasts
export const dismissAll = () => {
  toast.dismiss();
};

// Exportar toast original para casos personalizados
export { toast };
