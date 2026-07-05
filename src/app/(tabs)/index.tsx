import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { CategoryChip } from '@/components/CategoryChip';
import { NoteCard } from '@/components/NoteCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useNotes } from '@/hooks/useNotes';
import { useTheme } from '@/hooks/use-theme';

export default function NotesScreen() {
  const theme = useTheme();
  const { categories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { notes, reload } = useNotes(selectedCategoryId ?? undefined);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedText type="title" style={styles.title}>
          Notas
        </ThemedText>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.categoryRow}
          style={styles.categoryList}
          ListHeaderComponent={
            <CategoryChip
              label="Todas"
              selected={selectedCategoryId === null}
              onPress={() => setSelectedCategoryId(null)}
            />
          }
          renderItem={({ item }) => (
            <CategoryChip
              label={item.name}
              color={item.color}
              selected={item.id === selectedCategoryId}
              onPress={() => setSelectedCategoryId(item.id)}
            />
          )}
        />

        {notes.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText themeColor="textSecondary">Todavía no tenés notas.</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={notes}
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

        <Pressable
          onPress={() => router.push('/note/new')}
          style={({ pressed }) => [
            styles.fab,
            { backgroundColor: theme.text, bottom: BottomTabInset + Spacing.three },
            pressed && styles.fabPressed,
          ]}>
          <SymbolView name="plus" tintColor={theme.background} size={24} />
        </Pressable>
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
  categoryList: {
    flexGrow: 0,
    marginTop: Spacing.three,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  list: {
    gap: Spacing.two,
    padding: Spacing.four,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: Spacing.four,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  fabPressed: {
    opacity: 0.85,
  },
});
