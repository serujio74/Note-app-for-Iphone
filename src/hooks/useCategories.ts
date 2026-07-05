import { useCallback, useEffect, useState } from 'react';

import { createCategory, listCategories } from '@/db/categoriesRepository';
import type { Category } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setCategories(await listCategories());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addCategory = useCallback(
    async (name: string) => {
      const category = await createCategory(name);
      await reload();
      return category;
    },
    [reload]
  );

  return { categories, loading, addCategory, reload };
}
