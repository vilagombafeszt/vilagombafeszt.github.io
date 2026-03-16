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
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
        setDragOffsetY(0);
        setIsDraggingClose(false);
      }, isDraggingClose ? 0 : 300);
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

  const dynamicStyle: React.CSSProperties = dragOffsetY > 0 || isSnapping
    ? {
        transform: `translateY(${dragOffsetY}px)`,
        transition: isSnapping ? 'transform 0.3s ease-out' : 'none'
      }
    : {};

  return (
    <div 
      className={`bottom-sheet-backdrop ${isClosing && !isDraggingClose ? 'closing' : ''}`} 
      onClick={onClose}
    >
      <div 
        className={`bottom-sheet ${isClosing && !isDraggingClose ? 'closing' : ''}`} 
        onClick={(e) => e.stopPropagation()}
        style={dynamicStyle}
      >
        <div 
          className="bottom-sheet-handle-area"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="bottom-sheet-handle" />
        </div>
        {children}
      </div>
    </div>
  );
}

export function BottomSheetHeader({ children }: { children: React.ReactNode }) {
  return <div className="bottom-sheet-header">{children}</div>;
}

export function BottomSheetBody({ children }: { children: React.ReactNode }) {
  return <div className="bottom-sheet-body">{children}</div>;
}

export function BottomSheetFooter({ children }: { children: React.ReactNode }) {
  return <div className="bottom-sheet-footer">{children}</div>;
}
