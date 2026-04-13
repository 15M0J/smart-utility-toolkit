import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Utility Toolkit</Text>
      <Text style={styles.subtitle}>Everyday tools in one place</Text>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/converter')}>
        <View style={styles.cardLeft}>
          <View style={styles.iconWrap}>
            <Ionicons name="swap-horizontal-outline" size={22} color="#2563EB" />
          </View>
          <View>
            <Text style={styles.cardText}>Unit Converter</Text>
            <Text style={styles.cardSubtext}>Length, weight, temperature, currency</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/notes')}>
        <View style={styles.cardLeft}>
          <View style={styles.iconWrap}>
            <Ionicons name="document-text-outline" size={22} color="#2563EB" />
          </View>
          <View>
            <Text style={styles.cardText}>Notes</Text>
            <Text style={styles.cardSubtext}>Create, edit, and save notes locally</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/calculator')}>
        <View style={styles.cardLeft}>
          <View style={styles.iconWrap}>
            <Ionicons name="calculator-outline" size={22} color="#2563EB" />
          </View>
          <View>
            <Text style={styles.cardText}>Calculator</Text>
            <Text style={styles.cardSubtext}>Quick everyday calculations</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 28,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  cardSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
});