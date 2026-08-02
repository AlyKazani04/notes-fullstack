import { useState, useEffect, useCallback, useRef } from 'react';
import { uid } from '../utils/helpers';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const timerIds = useRef<Set<number>>(new Set());

  const pushToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = uid();
    setToasts((prev) => [...prev, { id, message, type }]);

    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timerIds.current.delete(timer);
    }, 3200);

    timerIds.current.add(timer);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    return () => {
      timerIds.current.forEach((timer) => clearTimeout(timer));
      timerIds.current.clear();
    };
  }, []);

  return { toasts, pushToast, dismissToast };
}