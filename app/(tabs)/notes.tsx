import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type Note = {
  id: string;
  title: string;
  content: string;
};

const STORAGE_KEY = 'smart_utility_notes';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.log('Failed to load notes:', error);
    }
  };

  const saveNotes = async (notesToSave: Note[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notesToSave));
    } catch (error) {
      console.log('Failed to save notes:', error);
    }
  };

  const handleAddOrUpdateNote = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing fields', 'Please enter both a title and note content.');
      return;
    }

    if (editingId) {
      const updatedNotes = notes.map((note) =>
        note.id === editingId ? { ...note, title, content } : note
      );
      setNotes(updatedNotes);
      setEditingId(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
      };
      setNotes([newNote, ...notes]);
    }

    setTitle('');
    setContent('');
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
          const filteredNotes = notes.filter((note) => note.id !== id);
          setNotes(filteredNotes);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes</Text>
      <Text style={styles.subtitle}>Create, edit, and manage your notes.</Text>

      <TextInput
        style={styles.input}
        placeholder="Note title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Write your note here..."
        value={content}
        onChangeText={setContent}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleAddOrUpdateNote}>
        <Text style={styles.saveButtonText}>
          {editingId ? 'Update Note' : 'Add Note'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes yet. Add your first note.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.noteContent}>{item.content}</Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 30,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
    fontSize: 15,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  noteContent: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});