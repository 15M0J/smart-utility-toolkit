import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppButton } from '@/components/app-button';

const buttons = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', 'C', '+'],
];

const operators = ['/', '*', '-', '+'];

export default function CalculatorScreen() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const handlePress = (value: string) => {
    if (value === 'C') {
      setExpression('');
      setResult('');
      return;
    }

    if (value === '=') {
      try {
        const evalResult = Function(`"use strict"; return (${expression || '0'})`)();
        setResult(String(evalResult));
      } catch {
        setResult('Error');
      }
      return;
    }

    setExpression((previousValue) => previousValue + value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculator</Text>
      <Text style={styles.subtitle}>Perform quick calculations with ease.</Text>

      <View style={styles.displayCard}>
        <Text style={styles.expressionText}>{expression || '0'}</Text>
        <Text style={styles.resultText}>{result}</Text>
      </View>

      <View style={styles.buttonsWrapper}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {row.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.button,
                  operators.includes(item) && styles.operatorButton,
                  item === 'C' && styles.clearButton,
                ]}
                onPress={() => handlePress(item)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    (operators.includes(item) || item === 'C') && styles.lightButtonText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <AppButton label="=" onPress={() => handlePress('=')} style={styles.equalsButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F8FA',
    flex: 1,
    padding: 20,
    paddingTop: 16,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 16,
    marginBottom: 20,
  },
  displayCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'space-between',
    marginBottom: 24,
    minHeight: 120,
    padding: 20,
  },
  expressionText: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'right',
  },
  resultText: {
    color: '#2563EB',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'right',
  },
  buttonsWrapper: {
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 68,
    width: '22%',
  },
  operatorButton: {
    backgroundColor: '#111827',
  },
  clearButton: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
  },
  lightButtonText: {
    color: '#FFFFFF',
  },
  equalsButton: {
    marginTop: 8,
  },
});
