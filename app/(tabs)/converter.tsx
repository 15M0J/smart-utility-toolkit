import { useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const conversionData = {
  Length: {
    units: ['Meter', 'Kilometer', 'Centimeter', 'Mile'],
    toBase: {
      Meter: 1,
      Kilometer: 1000,
      Centimeter: 0.01,
      Mile: 1609.34,
    },
  },
  Weight: {
    units: ['Kilogram', 'Gram', 'Pound'],
    toBase: {
      Kilogram: 1,
      Gram: 0.001,
      Pound: 0.453592,
    },
  },
  Currency: {
    units: ['USD', 'EUR', 'GBP', 'NGN'],
    toBase: {
      USD: 1,
      EUR: 1.08,
      GBP: 1.27,
      NGN: 0.00067,
    },
  },
};

const temperatureUnits = ['Celsius', 'Fahrenheit', 'Kelvin'];

type Category = 'Length' | 'Weight' | 'Temperature' | 'Currency';

export default function ConverterScreen() {
  const [category, setCategory] = useState<Category>('Length');
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('Meter');
  const [toUnit, setToUnit] = useState('Kilometer');

  const units = useMemo(() => {
    if (category === 'Temperature') return temperatureUnits;
    return conversionData[category].units;
  }, [category]);

  const result = useMemo(() => {
    const value = parseFloat(inputValue);

    if (isNaN(value)) return '';

    if (category === 'Temperature') {
      return convertTemperature(value, fromUnit, toUnit).toFixed(2);
    }

    const baseValue =
      value *
      conversionData[category].toBase[
        fromUnit as keyof typeof conversionData[typeof category]['toBase']
      ];

    const convertedValue =
      baseValue /
      conversionData[category].toBase[
        toUnit as keyof typeof conversionData[typeof category]['toBase']
      ];

    return convertedValue.toFixed(2);
  }, [inputValue, fromUnit, toUnit, category]);

  const handleCategoryChange = (selectedCategory: Category) => {
    setCategory(selectedCategory);

    if (selectedCategory === 'Length') {
      setFromUnit('Meter');
      setToUnit('Kilometer');
    } else if (selectedCategory === 'Weight') {
      setFromUnit('Kilogram');
      setToUnit('Gram');
    } else if (selectedCategory === 'Temperature') {
      setFromUnit('Celsius');
      setToUnit('Fahrenheit');
    } else {
      setFromUnit('USD');
      setToUnit('NGN');
    }

    setInputValue('');
  };

  const handleSwapUnits = () => {
    const oldFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(oldFrom);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Unit Converter</Text>
      <Text style={styles.subtitle}>Convert values across useful everyday categories.</Text>

      <Text style={styles.label}>Category</Text>
      <View style={styles.rowWrap}>
        {(['Length', 'Weight', 'Temperature', 'Currency'] as Category[]).map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionButton, category === item && styles.activeButton]}
            onPress={() => handleCategoryChange(item)}
          >
            <Text style={[styles.optionText, category === item && styles.activeText]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Value</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a value"
        keyboardType="numeric"
        value={inputValue}
        onChangeText={setInputValue}
      />

      <Text style={styles.label}>From</Text>
      <View style={styles.rowWrap}>
        {units.map((unit) => (
          <TouchableOpacity
            key={unit}
            style={[styles.optionButton, fromUnit === unit && styles.activeButton]}
            onPress={() => setFromUnit(unit)}
          >
            <Text style={[styles.optionText, fromUnit === unit && styles.activeText]}>
              {unit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>To</Text>
      <View style={styles.rowWrap}>
        {units.map((unit) => (
          <TouchableOpacity
            key={unit}
            style={[styles.optionButton, toUnit === unit && styles.activeButton]}
            onPress={() => setToUnit(unit)}
          >
            <Text style={[styles.optionText, toUnit === unit && styles.activeText]}>
              {unit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.swapButton} onPress={handleSwapUnits}>
        <Text style={styles.swapButtonText}>Swap Units</Text>
      </TouchableOpacity>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>Result</Text>
        <Text style={styles.resultValue}>
          {result ? `${result} ${toUnit}` : 'Enter a value to convert'}
        </Text>
        {category === 'Currency' && (
          <Text style={styles.noteText}>Currency uses demo rates for preview.</Text>
        )}
      </View>
    </ScrollView>
  );
}

function convertTemperature(value: number, from: string, to: string) {
  let celsius = value;

  if (from === 'Fahrenheit') {
    celsius = (value - 32) * (5 / 9);
  } else if (from === 'Kelvin') {
    celsius = value - 273.15;
  }

  if (to === 'Celsius') return celsius;
  if (to === 'Fahrenheit') return celsius * (9 / 5) + 32;
  if (to === 'Kelvin') return celsius + 273.15;

  return value;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F7F8FA',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  activeButton: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  optionText: {
    color: '#1F2937',
    fontWeight: '500',
  },
  activeText: {
    color: '#FFFFFF',
  },
  swapButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  swapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 30,
  },
  resultLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  noteText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 10,
  },
});