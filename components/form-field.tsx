import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

type FormFieldProps = TextInputProps & {
  label: string;
  helperText?: string;
};

export function FormField({ label, helperText, multiline, style, ...props }: FormFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
      <TextInput
        multiline={multiline}
        placeholderTextColor="#9CA3AF"
        style={[styles.input, multiline && styles.multilineInput, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  label: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  helperText: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderRadius: 14,
    borderWidth: 1,
    color: '#111827',
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  multilineInput: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
});
