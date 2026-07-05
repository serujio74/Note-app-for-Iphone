import { useCallback, useEffect, useState } from 'react';

import { cancelReminder } from '@/notifications/notifications';
import { deleteNote, listNotes } from '@/db/notesRepository';
import type { Note } from '@/types';

export function useNotes(categoryId?: number) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setNotes(await listNotes(categoryId));
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const removeNote = useCallback(
    async (note: Note) => {
      if (note.reminderNotificationId) {
        await cancelReminder(note.reminderNotificationId);
      }
      await deleteNote(note.id);
      await reload();
    },
    [reload]
  );

  return { notes, loading, reload, removeNote };
}
