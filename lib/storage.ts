import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadStoredValue<T>(key: string, fallbackValue: T): Promise<T> {
  try {
    const storedValue = await AsyncStorage.getItem(key);

    if (!storedValue) {
      return fallbackValue;
    }

    return JSON.parse(storedValue) as T;
  } catch (error) {
    console.log(`Failed to load ${key}:`, error);
    return fallbackValue;
  }
}

export async function saveStoredValue<T>(key: string, value: T) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(`Failed to save ${key}:`, error);
  }
}
