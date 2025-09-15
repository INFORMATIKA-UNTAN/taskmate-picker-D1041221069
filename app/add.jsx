import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { loadTasks, saveTasks } from '../src/storage/taskStorage';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'expo-router';

export default function Add() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Judul tugas tidak boleh kosong!');
      return;
    }

    const tasks = await loadTasks();
    const newTask = {
      id: uuidv4(),
      title,
      description: desc,
      category: 'Umum',
      deadline: '2025-09-30',
      status: 'Pending',
    };

    const updated = [...tasks, newTask];
    await saveTasks(updated);

    setTitle('');
    setDesc('');
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Tugas</Text>

      <Text style={styles.label}>Judul</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Contoh: Tugas Mobile"
      />

      <Text style={styles.label}>Deskripsi</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={desc}
        onChangeText={setDesc}
        placeholder="Deskripsi singkat"
        multiline
      />

      {/* Tombol custom */}
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Simpan Tugas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f8fafc' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: '700', 
    marginBottom: 20, 
    textAlign: 'center',
    color: '#1e293b'
  },
  label: { 
    marginTop: 16, 
    fontWeight: '600',
    fontSize: 14,
    color: '#334155'
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    backgroundColor: '#fff',
    fontSize: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
