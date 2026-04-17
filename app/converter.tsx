import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppButton } from '@/components/app-button';

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
const categories = ['Length', 'Weight', 'Temperature', 'Currency'] as const;

type Category = (typeof categories)[number];

export default function ConverterScreen() {
  const [category, setCategory] = useState<Category>('Length');
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('Meter');
  const [toUnit, setToUnit] = useState('Kilometer');

  const units = useMemo(() => {
    if (category === 'Temperature') {
      return temperatureUnits;
    }

    return conversionData[category].units;
  }, [category]);

  const result = useMemo(() => {
    const value = Number.parseFloat(inputValue);

    if (Number.isNaN(value)) {
      return '';
    }

    if (category === 'Temperature') {
      return convertTemperature(value, fromUnit, toUnit).toFixed(2);
    }

    const baseValue =
      value *
      conversionData[category].toBase[
        fromUnit as keyof typeof conversionData[Exclude<Category, 'Temperature'>]['toBase']
      ];

    const convertedValue =
      baseValue /
      conversionData[category].toBase[
        toUnit as keyof typeof conversionData[Exclude<Category, 'Temperature'>]['toBase']
      ];

    return convertedValue.toFixed(2);
  }, [category, fromUnit, inputValue, toUnit]);

  const handleCategoryChange = (selectedCategory: Category) => {
    setCategory(selectedCategory);
    setInputValue('');

    if (selectedCategory === 'Length') {
      setFromUnit('Meter');
      setToUnit('Kilometer');
      return;
    }

    if (selectedCategory === 'Weight') {
      setFromUnit('Kilogram');
      setToUnit('Gram');
      return;
    }

    if (selectedCategory === 'Temperature') {
      setFromUnit('Celsius');
      setToUnit('Fahrenheit');
      return;
    }

    setFromUnit('USD');
    setToUnit('NGN');
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleFromUnitChange = (selectedUnit: string) => {
    if (selectedUnit === toUnit) {
      return;
    }

    setFromUnit(selectedUnit);
  };

  const handleToUnitChange = (selectedUnit: string) => {
    if (selectedUnit === fromUnit) {
      return;
    }

    setToUnit(selectedUnit);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Unit Converter</Text>
      <Text style={styles.subtitle}>Convert values across useful everyday categories.</Text>

      <Text style={styles.label}>Category</Text>
      <View style={styles.rowWrap}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.optionButton, category === item && styles.activeButton]}
            onPress={() => handleCategoryChange(item)}
          >
            <Text style={[styles.optionText, category === item && styles.activeText]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Value</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a value"
        keyboardType="numeric"
        onChangeText={setInputValue}
        value={inputValue}
      />

      <Text style={styles.label}>From</Text>
      <View style={styles.rowWrap}>
        {units.map((unit) => (
          <TouchableOpacity
            key={unit}
            disabled={unit === toUnit}
            style={[
              styles.optionButton,
              fromUnit === unit && styles.activeButton,
              unit === toUnit && styles.disabledOptionButton,
            ]}
            onPress={() => handleFromUnitChange(unit)}
          >
            <Text
              style={[
                styles.optionText,
                fromUnit === unit && styles.activeText,
                unit === toUnit && styles.disabledOptionText,
              ]}
            >
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
            disabled={unit === fromUnit}
            style={[
              styles.optionButton,
              toUnit === unit && styles.activeButton,
              unit === fromUnit && styles.disabledOptionButton,
            ]}
            onPress={() => handleToUnitChange(unit)}
          >
            <Text
              style={[
                styles.optionText,
                toUnit === unit && styles.activeText,
                unit === fromUnit && styles.disabledOptionText,
              ]}
            >
              {unit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <AppButton label="Swap Units" onPress={handleSwapUnits} style={styles.swapButton} />

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>Result</Text>
        <Text style={styles.resultValue}>
          {result ? `${result} ${toUnit}` : 'Enter a value to convert'}
        </Text>
        {category === 'Currency' ? (
          <Text style={styles.noteText}>Currency uses demo rates for preview purposes.</Text>
        ) : null}
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

  if (to === 'Celsius') {
    return celsius;
  }

  if (to === 'Fahrenheit') {
    return celsius * (9 / 5) + 32;
  }

  if (to === 'Kelvin') {
    return celsius + 273.15;
  }

  return value;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F8FA',
    flexGrow: 1,
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 16,
    marginBottom: 24,
  },
  label: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 12,
    padding: 16,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  activeButton: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  disabledOptionButton: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    opacity: 0.6,
  },
  optionText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  activeText: {
    color: '#FFFFFF',
  },
  disabledOptionText: {
    color: '#9CA3AF',
  },
  swapButton: {
    marginBottom: 20,
    marginTop: 8,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 30,
    padding: 20,
  },
  resultLabel: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 8,
  },
  resultValue: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
  },
  noteText: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 10,
  },
});
