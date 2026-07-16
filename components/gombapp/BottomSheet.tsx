import React, { useEffect, useState, useRef } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [isDraggingClose, setIsDraggingClose] = useState(false);

  const startYRef = useRef(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isSnapping, setIsSnapping] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      setIsDraggingClose(false);
      document.body.style.overflow = 'hidden';
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(
        () => {
          setShouldRender(false);
          setIsClosing(false);
          setDragOffsetY(0);
          setIsDraggingClose(false);
        },
        isDraggingClose ? 0 : 300
      );
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, shouldRender, isDraggingClose]);

  if (!shouldRender) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startYRef.current = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startYRef.current) return;
    const diff = e.clientY - startYRef.current;
    if (diff > 0) {
      setDragOffsetY(diff);
    } else {
      setDragOffsetY(0);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    if (dragOffsetY > 100) {
      setIsDraggingClose(true);
      onClose();
    } else if (dragOffsetY > 0) {
      setIsSnapping(true);
      setDragOffsetY(0);
      setTimeout(() => setIsSnapping(false), 300);
    }
    startYRef.current = 0;
  };

  const dynamicStyle: React.CSSProperties =
    dragOffsetY > 0 || isSnapping
      ? {
          transform: `translateY(${dragOffsetY}px)`,
          transition: isSnapping ? 'transform 0.3s ease-out' : 'none',
        }
      : {};

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 md:items-center ${
        isClosing && !isDraggingClose
          ? 'closing animate-gombapp-fade-out'
          : 'animate-gombapp-fade-in'
      }`}
      onClick={onClose}
    >
      <div
        className={`flex max-h-[90vh] w-full max-w-[500px] flex-col rounded-b-none rounded-t-[20px] bg-gombapp-bg p-5 pb-[calc(20px+env(safe-area-inset-bottom,0px))] pt-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.2)] md:mb-5 md:rounded-[20px] ${
          isClosing && !isDraggingClose
            ? 'closing animate-gombapp-slide-down md:animate-gombapp-slide-down-desktop'
            : 'animate-gombapp-slide-up md:animate-gombapp-slide-up-desktop'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={dynamicStyle}
      >
        <div
          className="mb-2.5 flex h-[30px] w-full cursor-grab touch-none items-center justify-center active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="h-[5px] w-10 rounded-[3px] bg-gombapp-text/40" />
        </div>
        {children}
      </div>
    </div>
  );
}

export function BottomSheetHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[15px] text-center text-[1.5em] font-bold text-gombapp-text">{children}</div>
  );
}

export function BottomSheetBody({ children }: { children: React.ReactNode }) {
  return <div className="mb-5 grow overflow-y-auto">{children}</div>;
}

export function BottomSheetFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-auto flex w-full justify-between gap-2.5">{children}</div>;
}
