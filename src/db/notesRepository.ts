import { getDatabase } from './database';

import type { Note } from '@/types';

export type NoteInput = {
  title: string;
  body: string;
  categoryId: number;
  date: string | null;
  reminderDatetime: string | null;
  reminderNotificationId: string | null;
};

export async function listNotes(categoryId?: number): Promise<Note[]> {
  const db = await getDatabase();
  if (categoryId != null) {
    return db.getAllAsync<Note>(
      'SELECT * FROM notes WHERE categoryId = ? ORDER BY updatedAt DESC',
      categoryId
    );
  }
  return db.getAllAsync<Note>('SELECT * FROM notes ORDER BY updatedAt DESC');
}

export async function listNotesWithDates(): Promise<Note[]> {
  const db = await getDatabase();
  return db.getAllAsync<Note>('SELECT * FROM notes WHERE date IS NOT NULL');
}

export async function listNotesByDate(date: string): Promise<Note[]> {
  const db = await getDatabase();
  return db.getAllAsync<Note>(
    'SELECT * FROM notes WHERE date = ? ORDER BY updatedAt DESC',
    date
  );
}

export async function getNoteById(id: number): Promise<Note | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Note>('SELECT * FROM notes WHERE id = ?', id);
}

export async function createNote(input: NoteInput): Promise<Note> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO notes (title, body, categoryId, date, reminderDatetime, reminderNotificationId, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    input.title,
    input.body,
    input.categoryId,
    input.date,
    input.reminderDatetime,
    input.reminderNotificationId,
    now,
    now
  );
  const note = await getNoteById(result.lastInsertRowId);
  if (!note) throw new Error('Failed to create note');
  return note;
}

export async function updateNote(id: number, input: NoteInput): Promise<Note> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE notes
     SET title = ?, body = ?, categoryId = ?, date = ?, reminderDatetime = ?, reminderNotificationId = ?, updatedAt = ?
     WHERE id = ?`,
    input.title,
    input.body,
    input.categoryId,
    input.date,
    input.reminderDatetime,
    input.reminderNotificationId,
    now,
    id
  );
  const note = await getNoteById(id);
  if (!note) throw new Error('Note not found after update');
  return note;
}

export async function deleteNote(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM notes WHERE id = ?', id);
}
