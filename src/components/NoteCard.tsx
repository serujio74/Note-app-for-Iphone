import { SymbolView } from 'expo-symbols';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { resolveCategoryColor, Spacing } from '@/constants/theme';
import { useResolvedColorScheme, useTheme } from '@/hooks/use-theme';
import type { Category, Note } from '@/types';

type Props = {
  note: Note;
  category?: Category;
  onPress: () => void;
};

export function NoteCard({ note, category, onPress }: Props) {
  const theme = useTheme();
  const scheme = useResolvedColorScheme();
  const categoryPalette = category ? resolveCategoryColor(category.color, scheme) : null;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {note.title}
        </ThemedText>
        {note.body.length > 0 && (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
            {note.body}
          </ThemedText>
        )}
        <View style={styles.metaRow}>
          {category && categoryPalette && (
            <View style={[styles.categoryBadge, { backgroundColor: categoryPalette.background }]}>
              <ThemedText type="small" style={{ color: categoryPalette.text }}>
                {category.name}
              </ThemedText>
            </View>
          )}
          {note.date && (
            <ThemedText type="small" themeColor="textSecondary">
              {format(parseISO(note.date), "d 'de' MMMM", { locale: es })}
            </ThemedText>
          )}
          {note.reminderDatetime && (
            <SymbolView name="bell.fill" tintColor={theme.textSecondary} size={12} />
          )}
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  categoryBadge: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.five,
  },
});
