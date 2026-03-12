import { useCallback, useState } from 'react';

export interface ToastMessage {
  id: string;
  title: string;
  type: 'success' | 'error' | 'info';
}

export const useToast = () => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, type: ToastMessage['type'] = 'info') => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setMessages((prev) => [...prev, { id, title, type }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  return { messages, addToast, removeToast };
};
