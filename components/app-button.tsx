import { StyleSheet, Text, TouchableOpacity, type TouchableOpacityProps, ViewStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'danger';

type AppButtonProps = TouchableOpacityProps & {
  label: string;
  variant?: ButtonVariant;
  compact?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

const variantStyles = {
  primary: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    color: '#FFFFFF',
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    color: '#111827',
  },
  dark: {
    backgroundColor: '#111827',
    borderColor: '#111827',
    color: '#FFFFFF',
  },
  danger: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
    color: '#FFFFFF',
  },
} as const;

export function AppButton({
  label,
  variant = 'primary',
  compact = false,
  fullWidth = true,
  style,
  disabled,
  ...touchableProps
}: AppButtonProps) {
  const colors = variantStyles[variant];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      style={[
        styles.button,
        compact ? styles.compactButton : styles.regularButton,
        fullWidth ? styles.fullWidth : styles.autoWidth,
        {
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
        },
        disabled && styles.disabledButton,
        style,
      ]}
      {...touchableProps}
    >
      <Text
        style={[
          styles.label,
          compact ? styles.compactLabel : styles.regularLabel,
          { color: colors.color },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
  },
  regularButton: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  compactButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  fullWidth: {
    width: '100%',
  },
  autoWidth: {
    alignSelf: 'flex-start',
  },
  regularLabel: {
    fontSize: 16,
  },
  compactLabel: {
    fontSize: 14,
  },
  label: {
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.55,
  },
});
