'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

type SnackbarType = 'info' | 'success' | 'error';

export interface SnackbarAction {
  label: React.ReactNode;
  onClick: () => void;
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
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<SnackbarType | 'confirm'>('info');
  const [action, setAction] = useState<SnackbarAction | null>(null);
  const [confirmCallbacks, setConfirmCallbacks] = useState<{
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSnackbar = useCallback(
    (msg: string, t: SnackbarType = 'info', duration = 4000, act?: SnackbarAction) => {
      setMessage(msg);
      setType(t);
      setAction(act || null);
      setConfirmCallbacks(null);
      setVisible(true);

      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        setVisible(false);
      }, duration);
    },
    []
  );

  const showConfirmSnackbar = useCallback(
    (msg: string, onConfirm: () => void, onCancel?: () => void) => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      setMessage(msg);
      setType('confirm');
      setConfirmCallbacks({ onConfirm, onCancel });
      setVisible(true);
    },
    []
  );

  const handleConfirm = () => {
    setVisible(false);
    confirmCallbacks?.onConfirm();
  };

  const handleCancel = () => {
    setVisible(false);
    confirmCallbacks?.onCancel?.();
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, showConfirmSnackbar }}>
      {children}

      {/* Backdrop for confirm dialog */}
      {type === 'confirm' && (
        <div className={`snackbar-backdrop ${visible ? 'show' : ''}`} onClick={handleCancel} />
      )}

      {/* Snackbar element */}
      <div className={`snackbar ${type} ${visible ? 'show' : ''}`}>
        {type === 'confirm' ? (
          <>
            <div className="snackbar-message">{message}</div>
            <div className="snackbar-buttons">
              <button className="snackbar-btn snackbar-btn-cancel" onClick={handleCancel}>
                Mégse
              </button>
              <button className="snackbar-btn snackbar-btn-confirm" onClick={handleConfirm}>
                OK
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: action ? 'space-between' : 'center',
              width: '100%',
            }}
          >
            <span>{message}</span>
            {action && (
              <button
                className="snackbar-action-btn"
                onClick={() => {
                  action.onClick();
                  setVisible(false);
                }}
              >
                {action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </SnackbarContext.Provider>
  );
}
