import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type Props = {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  mode: 'date' | 'datetime';
};

export function DateTimeField({ label, value, onChange, mode }: Props) {
  const enabled = value != null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ThemedText type="default">{label}</ThemedText>
        <Switch value={enabled} onValueChange={(next) => onChange(next ? new Date() : null)} />
      </View>
      {enabled && value && (
        <DateTimePicker
          value={value}
          mode={mode}
          display="compact"
          onChange={(_, date) => date && onChange(date)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
