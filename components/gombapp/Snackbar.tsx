'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

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
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-[2000] flex flex-col items-center gap-2 pt-[calc(10px+env(safe-area-inset-top,0px))]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex w-max max-w-[90vw] animate-toast-slide-down items-center gap-3 rounded-full border border-white/20 bg-[#1c1c1e]/80 px-4 py-3 text-[16px] font-medium text-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] backdrop-blur-xl"
          >
            {toast.type === 'success' && (
              <span className="material-symbols-rounded shrink-0 text-[#34c759]">check_circle</span>
            )}
            {toast.type === 'error' && (
              <span className="material-symbols-rounded shrink-0 text-[#ff3b30]">error</span>
            )}
            {toast.type === 'info' && (
              <span className="material-symbols-rounded shrink-0 text-[#0a84ff]">info</span>
            )}
            <span className="leading-[1.2]">{toast.message}</span>
            {toast.action && (
              <button
                className="ml-2 shrink-0 rounded-full bg-white/20 px-3 py-1 text-[14px] font-bold transition-colors active:bg-white/30"
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
        <div className="fixed left-1/2 top-1/2 z-[2001] flex w-[90vw] max-w-[400px] -translate-x-1/2 -translate-y-1/2 animate-gombapp-fade-in flex-col items-center justify-center rounded-[20px] bg-gombapp-bg p-6 text-gombapp-text shadow-2xl">
          <div className="mb-6 text-center text-[22px] font-medium leading-[1.2]">
            {confirmMessage}
          </div>
          <div className="flex w-full flex-row justify-center gap-4">
            <button
              className="flex-1 rounded-2xl bg-gombapp-text/10 px-5 py-3 text-[18px] font-bold text-gombapp-text transition-transform active:scale-[0.96]"
              onClick={handleCancel}
            >
              Mégse
            </button>
            <button
              className="flex-1 rounded-2xl bg-gombapp-text px-5 py-3 text-[18px] font-bold text-gombapp-bg transition-transform active:scale-[0.96]"
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
