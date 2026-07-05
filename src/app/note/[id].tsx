import { useEffect, useState } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPicker } from '@/components/CategoryPicker';
import { DateTimeField } from '@/components/DateTimeField';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useTheme } from '@/hooks/use-theme';
import { createNote, deleteNote, getNoteById, updateNote } from '@/db/notesRepository';
import {
  cancelReminder,
  requestPermissionsIfNeeded,
  scheduleReminder,
} from '@/notifications/notifications';
import type { Note } from '@/types';

export default function NoteEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const noteId = isNew ? null : Number(id);
  const navigation = useNavigation();
  const theme = useTheme();
  const { categories, addCategory } = useCategories();

  const [loaded, setLoaded] = useState(isNew);
  const [existingNote, setExistingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [reminderDatetime, setReminderDatetime] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: isNew ? 'Nueva nota' : 'Editar nota' });
  }, [navigation, isNew]);

  useEffect(() => {
    if (isNew || noteId == null) return;
    getNoteById(noteId).then((note) => {
      if (!note) {
        Alert.alert('Esta nota ya no existe');
        router.back();
        return;
      }
      setExistingNote(note);
      setTitle(note.title);
      setBody(note.body);
      setCategoryId(note.categoryId);
      setDate(note.date ? parseISO(note.date) : null);
      setReminderDatetime(note.reminderDatetime ? parseISO(note.reminderDatetime) : null);
      setLoaded(true);
    });
  }, [isNew, noteId]);

  useEffect(() => {
    if (isNew && categoryId === null && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [isNew, categoryId, categories]);

  const handleSave = async () => {
    if (categoryId == null) return;
    if (title.trim().length === 0) {
      Alert.alert('Ponele un título a la nota');
      return;
    }

    setSaving(true);
    try {
      const previousNotificationId = existingNote?.reminderNotificationId ?? null;
      let reminderNotificationId: string | null = null;

      if (reminderDatetime) {
        const granted = await requestPermissionsIfNeeded();
        if (!granted) {
          Alert.alert(
            'Sin permiso de notificaciones',
            'La nota se va a guardar, pero no va a sonar el recordatorio hasta que actives el permiso en Ajustes.'
          );
        } else {
          if (previousNotificationId) {
            await cancelReminder(previousNotificationId);
          }
          reminderNotificationId = await scheduleReminder(
            reminderDatetime,
            title.trim(),
            body.trim()
          );
        }
      } else if (previousNotificationId) {
        await cancelReminder(previousNotificationId);
      }

      const input = {
        title: title.trim(),
        body: body.trim(),
        categoryId,
        date: date ? format(date, 'yyyy-MM-dd') : null,
        reminderDatetime: reminderDatetime ? reminderDatetime.toISOString() : null,
        reminderNotificationId,
      };

      if (isNew) {
        await createNote(input);
      } else if (noteId != null) {
        await updateNote(noteId, input);
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (noteId == null) return;
    Alert.alert('Eliminar nota', '¿Seguro que querés eliminar esta nota?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          if (existingNote?.reminderNotificationId) {
            await cancelReminder(existingNote.reminderNotificationId);
          }
          await deleteNote(noteId);
          router.back();
        },
      },
    ]);
  };

  if (!loaded) {
    return <ThemedView style={styles.container} />;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Título"
            placeholderTextColor={theme.textSecondary}
            style={[styles.titleInput, { color: theme.text }]}
          />
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Escribí tu nota..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.bodyInput, { color: theme.text }]}
            multiline
            textAlignVertical="top"
          />

          <CategoryPicker
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
            onCreate={addCategory}
          />

          <DateTimeField label="Asignar fecha" value={date} onChange={setDate} mode="date" />
          <DateTimeField
            label="Recordarme"
            value={reminderDatetime}
            onChange={setReminderDatetime}
            mode="datetime"
          />

          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: theme.text },
              pressed && styles.pressed,
            ]}>
            <ThemedText themeColor="background" type="smallBold">
              Guardar
            </ThemedText>
          </Pressable>

          {!isNew && (
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}>
              <ThemedText themeColor="text" type="small">
                Eliminar nota
              </ThemedText>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
  },
  bodyInput: {
    fontSize: 16,
    minHeight: 120,
  },
  saveButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
