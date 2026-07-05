import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { CategoryChip } from '@/components/CategoryChip';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Category } from '@/types';

type Props = {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onCreate: (name: string) => Promise<Category>;
};

export function CategoryPicker({ categories, selectedId, onSelect, onCreate }: Props) {
  const theme = useTheme();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleConfirmCreate = async () => {
    const name = newName.trim();
    if (name.length === 0) {
      setCreating(false);
      return;
    }
    const category = await onCreate(name);
    setNewName('');
    setCreating(false);
    onSelect(category.id);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary">
        Categoría
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {categories.map((category) => (
          <CategoryChip
            key={category.id}
            label={category.name}
            color={category.color}
            selected={category.id === selectedId}
            onPress={() => onSelect(category.id)}
          />
        ))}
        {creating ? (
          <TextInput
            autoFocus
            value={newName}
            onChangeText={setNewName}
            onSubmitEditing={handleConfirmCreate}
            onBlur={handleConfirmCreate}
            placeholder="Nombre de categoría"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
          />
        ) : (
          <CategoryChip label="+ Nueva categoría" selected={false} onPress={() => setCreating(true)} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    minWidth: 140,
  },
});
