import { useCallback, useEffect, useState } from 'react';
import type { Person } from '@/models/types';
import { ContactsController } from '@/controllers/ContactsController';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ContactsController.list();
      setContacts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { contacts, loading, reload };
};
