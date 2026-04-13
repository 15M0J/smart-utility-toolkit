import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
        const formattedExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
        const evalResult = Function(`"use strict"; return (${formattedExpression})`)();
        setResult(String(evalResult));
      } catch {
        setResult('Error');
      }
      return;
    }

    setExpression((prev) => prev + value);
  };

  const buttons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', 'C', '+'],
  ];

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
                  ['÷', '×', '-', '+'].includes(item) && styles.operatorButton,
                  item === 'C' && styles.clearButton,
                ]}
                onPress={() => handlePress(item)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    ['÷', '×', '-', '+', 'C'].includes(item) && styles.lightButtonText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.equalsButton} onPress={() => handlePress('=')}>
          <Text style={styles.equalsButtonText}>=</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  displayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  expressionText: {
    fontSize: 28,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'right',
  },
  resultText: {
    fontSize: 22,
    color: '#2563EB',
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
    backgroundColor: '#FFFFFF',
    width: '22%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  operatorButton: {
    backgroundColor: '#111827',
  },
  clearButton: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  lightButtonText: {
    color: '#FFFFFF',
  },
  equalsButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  equalsButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
});