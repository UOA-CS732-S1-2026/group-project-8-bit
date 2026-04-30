"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MODAL_CLOSE_ANIMATION_MS = 160;

export function useModalCloseAnimation(onClose: () => void) {
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const requestClose = useCallback(() => {
    if (closeTimerRef.current) {
      return;
    }

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setIsClosing(false);
      onCloseRef.current();
    }, MODAL_CLOSE_ANIMATION_MS);
  }, []);

  return {
    isClosing,
    requestClose,
  };
}
