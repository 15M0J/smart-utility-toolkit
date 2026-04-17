import { Ionicons } from '@expo/vector-icons';
import { type Href, router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const toolCards = [
  {
    title: 'Unit Converter',
    description: 'Length, weight, temperature, and demo currency rates.',
    icon: 'swap-horizontal-outline',
    route: '/converter',
  },
  {
    title: 'Task Manager',
    description: 'Create, complete, edit, and delete tasks with offline storage.',
    icon: 'checkbox-outline',
    route: '/tasks',
  },
  {
    title: 'Notes',
    description: 'Capture quick thoughts and update them locally at any time.',
    icon: 'document-text-outline',
    route: '/notes',
  },
  {
    title: 'Calculator',
    description: 'Run quick arithmetic without leaving the toolkit.',
    icon: 'calculator-outline',
    route: '/calculator',
  },
] as const;

export default function IndexScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>Offline-ready utilities</Text>
        <Text style={styles.title}>Smart Utility Toolkit</Text>
        <Text style={styles.subtitle}>
          Open any tool from here, then use the header back button to return to this launcher.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Utilities</Text>
      {toolCards.map((tool) => (
        <TouchableOpacity
          key={tool.title}
          activeOpacity={0.85}
          style={styles.card}
          onPress={() => router.push(tool.route as Href)}
        >
          <View style={styles.cardLeft}>
            <View style={styles.iconWrap}>
              <Ionicons name={tool.icon} size={22} color="#2563EB" />
            </View>
            <View style={styles.cardCopy}>
              <Text style={styles.cardText}>{tool.title}</Text>
              <Text style={styles.cardSubtext}>{tool.description}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F8FA',
    flexGrow: 1,
    padding: 20,
    paddingTop: 56,
    paddingBottom: 28,
  },
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    marginBottom: 24,
    padding: 22,
  },
  eyebrow: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#D1D5DB',
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    padding: 18,
  },
  cardLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 14,
  },
  cardCopy: {
    flex: 1,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  cardText: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtext: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
});
