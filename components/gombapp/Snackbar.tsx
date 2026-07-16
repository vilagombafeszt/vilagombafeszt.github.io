'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

type SnackbarType = 'info' | 'success' | 'error';

export interface SnackbarAction {
  label: React.ReactNode;
  onClick: () => void;
}

interface Toast {
  id: number;
  message: string;
  type: SnackbarType;
  action?: SnackbarAction;
}

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    type?: SnackbarType,
    duration?: number,
    action?: SnackbarAction
  ) => void;
  showConfirmSnackbar: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
}

const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {},
  showConfirmSnackbar: () => {},
});

export function useSnackbar() {
  return useContext(SnackbarContext);
}

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmCallbacks, setConfirmCallbacks] = useState<{
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

  const showSnackbar = useCallback(
    (msg: string, t: SnackbarType = 'info', duration = 4000, act?: SnackbarAction) => {
      const id = ++toastIdRef.current;
      setToasts((prev) => [...prev, { id, message: msg, type: t, action: act }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    },
    []
  );

  const showConfirmSnackbar = useCallback(
    (msg: string, onConfirm: () => void, onCancel?: () => void) => {
      setConfirmMessage(msg);
      setConfirmCallbacks({ onConfirm, onCancel });
      setConfirmVisible(true);
    },
    []
  );

  const handleConfirm = () => {
    setConfirmVisible(false);
    confirmCallbacks?.onConfirm();
  };

  const handleCancel = () => {
    setConfirmVisible(false);
    confirmCallbacks?.onCancel?.();
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, showConfirmSnackbar }}>
      {children}

      {/* Toasts Container */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-[2000] flex flex-col items-center gap-2 pt-[calc(24px+env(safe-area-inset-top,0px))]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex w-max max-w-[90vw] animate-toast-slide-down items-center gap-3 rounded-2xl border border-white/10 bg-gombapp-text/95 px-4 py-3.5 text-[16px] font-medium text-gombapp-bg shadow-2xl backdrop-blur-md"
          >
            {toast.type === 'success' && (
              <CheckCircle2 className="h-6 w-6 shrink-0 text-green-400" />
            )}
            {toast.type === 'error' && <AlertCircle className="h-6 w-6 shrink-0 text-red-400" />}
            {toast.type === 'info' && <Info className="h-6 w-6 shrink-0 text-blue-400" />}
            <span className="leading-[1.3]">{toast.message}</span>
            {toast.action && (
              <button
                className="ml-auto flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border-none bg-gombapp-bg px-3 py-1.5 text-[14px] font-bold text-gombapp-text shadow-md transition-transform hover:scale-105 active:scale-95"
                onClick={() => {
                  toast.action!.onClick();
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id));
                }}
              >
                {toast.action.label}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Confirm Dialog Backdrop */}
      {confirmVisible && (
        <div
          className="fixed inset-0 z-[2000] animate-gombapp-fade-in-fast bg-black/50"
          onClick={handleCancel}
        />
      )}

      {/* Confirm Dialog Modal */}
      {confirmVisible && (
        <div className="fixed left-1/2 top-1/2 z-[2001] flex w-[90vw] max-w-[400px] -translate-x-1/2 -translate-y-1/2 animate-gombapp-fade-in flex-col items-center justify-center rounded-3xl border border-white/20 bg-gombapp-bg/95 p-8 text-gombapp-text shadow-2xl backdrop-blur-2xl">
          <div className="mb-8 text-center text-[24px] font-bold leading-[1.3] tracking-tight">
            {confirmMessage}
          </div>
          <div className="flex w-full flex-row justify-center gap-4">
            <button
              className="flex-1 cursor-pointer rounded-2xl border-none bg-gombapp-text/10 px-5 py-3.5 text-[18px] font-bold text-gombapp-text transition-all hover:bg-gombapp-text/15 active:scale-[0.96]"
              onClick={handleCancel}
            >
              Mégse
            </button>
            <button
              className="flex-1 cursor-pointer rounded-2xl border-none bg-gombapp-text px-5 py-3.5 text-[18px] font-bold text-gombapp-bg shadow-lg transition-all hover:opacity-90 active:scale-[0.96]"
              onClick={handleConfirm}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </SnackbarContext.Provider>
  );
}
