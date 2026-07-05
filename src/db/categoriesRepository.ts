import { getDatabase } from './database';

import type { Category } from '@/types';

export async function listCategories(): Promise<Category[]> {
  const db = await getDatabase();
  return db.getAllAsync<Category>('SELECT * FROM categories ORDER BY name ASC');
}

export async function createCategory(name: string, color: string = 'gray'): Promise<Category> {
  const db = await getDatabase();
  const trimmed = name.trim();
  const result = await db.runAsync(
    'INSERT INTO categories (name, color) VALUES (?, ?)',
    trimmed,
    color
  );
  return { id: result.lastInsertRowId, name: trimmed, color };
}
