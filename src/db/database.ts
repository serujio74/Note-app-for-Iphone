import * as SQLite from 'expo-sqlite';

const DEFAULT_CATEGORIES = [
  { name: 'Trabajo', color: 'blue' },
  { name: 'Salud', color: 'green' },
  { name: 'Eventos sociales', color: 'yellow' },
  { name: 'Otros', color: 'purple' },
];

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function migrate(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL DEFAULT 'gray'
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      categoryId INTEGER NOT NULL REFERENCES categories(id),
      date TEXT,
      reminderDatetime TEXT,
      reminderNotificationId TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  // Installs created before the `color` column existed need it added in place.
  const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(categories)');
  if (!columns.some((column) => column.name === 'color')) {
    await db.execAsync("ALTER TABLE categories ADD COLUMN color TEXT NOT NULL DEFAULT 'gray'");
  }

  for (const category of DEFAULT_CATEGORIES) {
    const existing = await db.getFirstAsync<{ id: number; color: string }>(
      'SELECT id, color FROM categories WHERE name = ?',
      category.name
    );
    if (!existing) {
      await db.runAsync(
        'INSERT INTO categories (name, color) VALUES (?, ?)',
        category.name,
        category.color
      );
    } else if (existing.color === 'gray') {
      await db.runAsync('UPDATE categories SET color = ? WHERE id = ?', category.color, existing.id);
    }
  }
}

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('notes.db').then(async (db) => {
      await migrate(db);
      return db;
    });
  }
  return dbPromise;
}
