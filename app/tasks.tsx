import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppButton } from '@/components/app-button';
import { FormField } from '@/components/form-field';
import { loadStoredValue, saveStoredValue } from '@/lib/storage';

type Task = {
  id: string;
  title: string;
  details: string;
  completed: boolean;
  updatedAt: number;
};

const STORAGE_KEY = 'smart_utility_tasks';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const hydrateTasks = async () => {
      const storedTasks = await loadStoredValue<Task[]>(STORAGE_KEY, []);
      const normalizedTasks = storedTasks.map((task) => ({
        ...task,
        completed: Boolean(task.completed),
        details: task.details ?? '',
        updatedAt: task.updatedAt ?? Date.now(),
      }));

      setTasks(sortTasks(normalizedTasks));
      setHasHydrated(true);
    };

    hydrateTasks();
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    saveStoredValue(STORAGE_KEY, tasks);
  }, [hasHydrated, tasks]);

  const openTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = tasks.length - openTasks;

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Enter a task title before saving.');
      return;
    }

    const timestamp = Date.now();

    if (editingId) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingId
          ? {
              ...task,
              title: title.trim(),
              details: details.trim(),
              updatedAt: timestamp,
            }
          : task
      );

      setTasks(sortTasks(updatedTasks));
      clearForm();
      return;
    }

    const newTask: Task = {
      id: createId(),
      title: title.trim(),
      details: details.trim(),
      completed: false,
      updatedAt: timestamp,
    };

    setTasks(sortTasks([newTask, ...tasks]));
    clearForm();
  };

  const handleToggleCompleted = (taskId: string) => {
    setTasks((currentTasks) =>
      sortTasks(
        currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
                updatedAt: Date.now(),
              }
            : task
        )
      )
    );
  };

  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setDetails(task.details);
    setEditingId(task.id);
  };

  const handleDelete = (taskId: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));

          if (editingId === taskId) {
            clearForm();
          }
        },
      },
    ]);
  };

  const clearForm = () => {
    setTitle('');
    setDetails('');
    setEditingId(null);
  };

  const headerContent = (
    <>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>Task Manager</Text>
        <Text style={styles.subtitle}>Plan quick tasks and check them off offline.</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryPill}>
          <Text style={styles.summaryValue}>{tasks.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryPill}>
          <Text style={styles.summaryValue}>{openTasks}</Text>
          <Text style={styles.summaryLabel}>Open</Text>
        </View>
        <View style={styles.summaryPill}>
          <Text style={styles.summaryValue}>{completedTasks}</Text>
          <Text style={styles.summaryLabel}>Done</Text>
        </View>
      </View>

      <View style={styles.composerCard}>
        <Text style={styles.composerEyebrow}>{editingId ? 'Editing Task' : 'New Task'}</Text>
        <Text style={styles.composerTitle}>
          {editingId ? 'Update the selected task' : 'Add a task to your checklist'}
        </Text>
        <Text style={styles.composerSubtitle}>
          Keep it short and clear. Add details only when they make the task easier to finish.
        </Text>

        <FormField
          label="Task title"
          onChangeText={setTitle}
          placeholder="Example: Buy prepaid meter token"
          returnKeyType="done"
          value={title}
        />

        <FormField
          helperText="Optional notes, due context, or a quick reminder."
          label="Details"
          multiline
          onChangeText={setDetails}
          placeholder="Add useful context for this task"
          value={details}
        />

        <View style={styles.composerActions}>
          <AppButton
            label={editingId ? 'Update Task' : 'Add Task'}
            onPress={handleSubmit}
            style={styles.primaryAction}
          />
          {editingId ? (
            <AppButton
              label="Cancel"
              onPress={clearForm}
              style={styles.secondaryAction}
              variant="secondary"
            />
          ) : null}
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Checklist</Text>
        <Text style={styles.sectionMeta}>{openTasks} pending</Text>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <FlatList
        contentContainerStyle={styles.listContent}
        data={tasks}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Ionicons name="checkbox-outline" size={26} color="#2563EB" />
            <Text style={styles.emptyTitle}>No tasks yet</Text>
            <Text style={styles.emptyText}>Use the card above to add your first checklist item.</Text>
          </View>
        }
        ListHeaderComponent={headerContent}
        renderItem={({ item }) => (
          <View style={[styles.taskCard, item.completed && styles.completedTaskCard]}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleToggleCompleted(item.id)}
              style={styles.taskHeader}
            >
              <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                {item.completed ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
              </View>
              <View style={styles.taskCopy}>
                <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
                  {item.title}
                </Text>
                {item.details ? (
                  <Text style={[styles.taskDetails, item.completed && styles.completedText]}>
                    {item.details}
                  </Text>
                ) : null}
                <Text style={styles.taskMeta}>
                  {item.completed ? 'Completed' : 'Pending'} |{' '}
                  {new Date(item.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.actionsRow}>
              <AppButton compact fullWidth={false} label="Edit" onPress={() => handleEdit(item)} variant="secondary" />
              <AppButton compact fullWidth={false} label="Delete" onPress={() => handleDelete(item.id)} variant="danger" />
            </View>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sortTasks(tasks: Task[]) {
  return [...tasks].sort((firstTask, secondTask) => {
    if (firstTask.completed !== secondTask.completed) {
      return Number(firstTask.completed) - Number(secondTask.completed);
    }

    return secondTask.updatedAt - firstTask.updatedAt;
  });
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F8FA',
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerBlock: {
    marginBottom: 18,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 15,
    lineHeight: 22,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  summaryPill: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    padding: 12,
  },
  summaryValue: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryLabel: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },
  composerCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 18,
    padding: 18,
  },
  composerEyebrow: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  composerTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  composerSubtitle: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  composerActions: {
    gap: 10,
  },
  primaryAction: {
    marginTop: 4,
  },
  secondaryAction: {
    backgroundColor: '#F9FAFB',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionMeta: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 12,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  completedTaskCard: {
    backgroundColor: '#F9FAFB',
  },
  taskHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#9CA3AF',
    borderRadius: 10,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginTop: 2,
    width: 24,
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  taskCopy: {
    flex: 1,
  },
  taskTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  taskDetails: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  taskMeta: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  completedText: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
});
