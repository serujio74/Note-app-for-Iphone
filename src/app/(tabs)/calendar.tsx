import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { format } from 'date-fns';
import { FlatList, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NoteCard } from '@/components/NoteCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useTheme } from '@/hooks/use-theme';
import { listNotesByDate, listNotesWithDates } from '@/db/notesRepository';
import type { Note } from '@/types';

LocaleConfig.locales.es = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

export default function CalendarScreen() {
  const theme = useTheme();
  const { categories } = useCategories();
  const [markedDates, setMarkedDates] = useState<Record<string, { marked: true }>>({});
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notesForDay, setNotesForDay] = useState<Note[]>([]);

  const reload = useCallback(async (dateForList: string) => {
    const notesWithDates = await listNotesWithDates();
    const marks: Record<string, { marked: true }> = {};
    for (const note of notesWithDates) {
      if (note.date) marks[note.date] = { marked: true };
    }
    setMarkedDates(marks);
    setNotesForDay(await listNotesByDate(dateForList));
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload(selectedDate);
    }, [reload, selectedDate])
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedText type="title" style={styles.title}>
          Calendario
        </ThemedText>

        <Calendar
          current={selectedDate}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            reload(day.dateString);
          }}
          markedDates={{
            ...markedDates,
            [selectedDate]: { ...markedDates[selectedDate], selected: true },
          }}
          theme={{
            calendarBackground: theme.background,
            dayTextColor: theme.text,
            monthTextColor: theme.text,
            textDisabledColor: theme.textSecondary,
            todayTextColor: theme.text,
            dotColor: theme.text,
            selectedDayBackgroundColor: theme.backgroundSelected,
            selectedDayTextColor: theme.text,
            arrowColor: theme.text,
          }}
        />

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Notas del día
        </ThemedText>

        {notesForDay.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText themeColor="textSecondary">No hay notas para este día.</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={notesForDay}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <NoteCard
                note={item}
                category={categories.find((c) => c.id === item.categoryId)}
                onPress={() => router.push(`/note/${item.id}`)}
              />
            )}
          />
        )}
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
  title: {
    fontSize: 32,
    lineHeight: 40,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  list: {
    gap: Spacing.two,
    padding: Spacing.four,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
  },
});
