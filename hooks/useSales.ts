import { useCallback, useEffect, useState } from 'react';
import type { Sale } from '@/models/types';
import { SalesController } from '@/controllers/SalesController';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await SalesController.list();
      setSales(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { sales, loading, reload };
};
