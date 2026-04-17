import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/app-button';
import { FormField } from '@/components/form-field';
import { loadStoredValue, saveStoredValue } from '@/lib/storage';

type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

const STORAGE_KEY = 'smart_utility_notes';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const hydrateNotes = async () => {
      const storedNotes = await loadStoredValue<Note[]>(STORAGE_KEY, []);
      const normalizedNotes = storedNotes.map((note) => ({
        ...note,
        updatedAt: note.updatedAt ?? Date.now(),
      }));

      setNotes(sortNotes(normalizedNotes));
      setHasHydrated(true);
    };

    hydrateNotes();
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    saveStoredValue(STORAGE_KEY, notes);
  }, [hasHydrated, notes]);

  const statsText = `${notes.length} saved ${notes.length === 1 ? 'note' : 'notes'}`;

  const handleAddOrUpdateNote = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing fields', 'Please enter both a title and note content.');
      return;
    }

    const timestamp = Date.now();

    if (editingId) {
      const updatedNotes = notes.map((note) =>
        note.id === editingId
          ? {
              ...note,
              title: title.trim(),
              content: content.trim(),
              updatedAt: timestamp,
            }
          : note
      );

      setNotes(sortNotes(updatedNotes));
      clearForm();
      return;
    }

    const newNote: Note = {
      id: createId(),
      title: title.trim(),
      content: content.trim(),
      updatedAt: timestamp,
    };

    setNotes(sortNotes([newNote, ...notes]));
    clearForm();
  };

  const handleEdit = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));

          if (editingId === id) {
            clearForm();
          }
        },
      },
    ]);
  };

  const clearForm = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  const headerContent = (
    <>
      <View style={styles.headerBlock}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Notes</Text>
          <View style={styles.countPill}>
            <Text style={styles.countPillText}>{notes.length}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Create, edit, and manage your notes offline.</Text>
        <Text style={styles.headerMeta}>{statsText}</Text>
      </View>

      <View style={styles.composerCard}>
        <Text style={styles.composerEyebrow}>{editingId ? 'Editing Note' : 'New Note'}</Text>
        <Text style={styles.composerTitle}>
          {editingId ? 'Refine the selected note' : 'Write down something useful'}
        </Text>
        <Text style={styles.composerSubtitle}>
          Give the note a clear title, then capture the important details below.
        </Text>

        <FormField
          label="Note title"
          onChangeText={setTitle}
          placeholder="Example: Utility payment reminder"
          returnKeyType="done"
          value={title}
        />

        <FormField
          helperText="Use this space for the full note."
          label="Content"
          multiline
          onChangeText={setContent}
          placeholder="Write your note here..."
          value={content}
        />

        <View style={styles.composerActions}>
          <AppButton
            label={editingId ? 'Update Note' : 'Add Note'}
            onPress={handleAddOrUpdateNote}
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
        <Text style={styles.sectionTitle}>Saved Notes</Text>
        <Text style={styles.sectionMeta}>{notes.length}</Text>
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
        data={notes}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Ionicons name="document-text-outline" size={26} color="#2563EB" />
            <Text style={styles.emptyTitle}>No notes yet</Text>
            <Text style={styles.emptyText}>Add your first note from the composer above.</Text>
          </View>
        }
        ListHeaderComponent={headerContent}
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.noteContent}>{item.content}</Text>
            <Text style={styles.noteTimestamp}>
              Updated {new Date(item.updatedAt).toLocaleDateString()}
            </Text>

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

function sortNotes(notes: Note[]) {
  return [...notes].sort((firstNote, secondNote) => secondNote.updatedAt - firstNote.updatedAt);
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
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginBottom: 8,
  },
  headerMeta: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  countPill: {
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 999,
    justifyContent: 'center',
    minWidth: 34,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  countPillText: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '700',
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
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  noteTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  noteContent: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 10,
  },
  noteTimestamp: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
