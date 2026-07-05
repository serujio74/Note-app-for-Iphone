import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { resolveCategoryColor, Spacing } from '@/constants/theme';
import { useResolvedColorScheme, useTheme } from '@/hooks/use-theme';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
};

export function CategoryChip({ label, selected, onPress, color }: Props) {
  const scheme = useResolvedColorScheme();
  const theme = useTheme();

  const palette = color ? resolveCategoryColor(color, scheme) : null;
  const backgroundColor = palette
    ? palette.background
    : theme[selected ? 'backgroundSelected' : 'backgroundElement'];
  const textColor = palette ? palette.text : theme[selected ? 'text' : 'textSecondary'];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <View
        style={[
          styles.chip,
          { backgroundColor },
          palette && selected && { borderWidth: 2, borderColor: textColor },
        ]}>
        <ThemedText type={selected ? 'smallBold' : 'small'} style={{ color: textColor }}>
          {label}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  chip: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
  },
});
