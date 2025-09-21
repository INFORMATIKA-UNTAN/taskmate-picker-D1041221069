import { useMemo, useState, useEffect, useCallback} from 'react';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, FlatList, View, TouchableOpacity, Alert} from 'react-native'; 
import TaskItem from '../src/components/Taskitem.jsx';
import { loadTasks, saveTasks, clearTasks } from '../src/storage/taskStorage.js';
import { loadCategories, saveCategories } from '../src/storage/categoryStorage';

import StatusFilter from '../src/components/StatusFilter.jsx';
import CategoryFilter from '../src/components/CategoryFilter.jsx';

export default function HomeScreen() { 
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);

    const [statusFilter, setStatusFilter] = useState('all');      // 'all' | 'todo' | 'done'
    const [categoryFilter, setCategoryFilter] = useState('all');  // 'all' | 'Umum' | ...
    const [priorityFilter, setPriorityFilter] = useState('all');  // 'all' | 'Low' | 'Medium' | 'High'
    
    useEffect(() => {
        (async () => {
        setTasks(await loadTasks());
        setCategories(await loadCategories());
        })();
    }, []);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setTasks(await loadTasks());
                setCategories(await loadCategories());
            })();
        }, [])
    );

    const handleToggle = async (task) => {
        const updated = tasks.map((t) => {
            if (t.id === task.id) {
                let newStatus;
                if (t.status === 'Pending') {
                    newStatus = 'Todo';
                } else if (t.status === 'Todo') {
                    newStatus = 'Done';
                } else {
                    newStatus = 'Pending'; // kalau status Done, balik ke Pending
                }
                return { ...t, status: newStatus };
            }
            return t;
        });
        setTasks(updated);
        await saveTasks(updated);
    };


    const handleDelete = async (task) => {
        Alert.alert('Konfirmasi', 'Hapus tugas ini?', [
            {text: 'Batal'},
            {
                text: 'Ya',
                onPress: async () => {
                    const updated = tasks.filter(t => t.id !== task.id);
                    setTasks(updated);
                    await saveTasks(updated);
                }
            }
        ])
        const updated = tasks.filter((t) => t.id !== task.id);
        setTasks(updated);
        await saveTasks(updated);
    };

    // const categories = useMemo(() => {
    //     const categorySet = new Set();
    //     tasks.forEach(task => categorySet.add(task.category));
    //     return ['All', ...Array.from(categorySet)];
    // }, [tasks]);


    // const filteredTasks = useMemo(() => {
    //     return tasks.filter(task => {
    //         const matchCategory = selectedCategory === 'All' || task.category === selectedCategory;
    //         const matchStatus =
    //         selectedStatus === 'All' ||
    //         (selectedStatus === 'Done' && task.status === 'Done') ||
    //         (selectedStatus === 'Todo' && task.status === 'Todo') ||
    //         (selectedStatus === 'Pending' && task.status === 'Pending');
    //         return matchCategory && matchStatus;
    //     });
    // }, [selectedCategory, selectedStatus, tasks]);

return ( 
    <SafeAreaView style={styles.container}>
    <Text style={styles.header}>TaskMate – Daftar Tugas</Text>
    {/* <StatusFilter
        selected={selectedStatus}
        onSelect={setSelectedStatus}
    />
    <CategoryFilter 
        categories={categories} 
        selected={selectedCategory} 
        onSelect={setSelectedCategory} 
    /> */}
    <FlatList 
        data={tasks} 
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }} 
        renderItem={({ item }) => 
        < TaskItem 
            task={item} 
            onToggle={handleToggle}
            onDelete={handleDelete} 
        />}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center' }}>Tidak ada tugas</Text>
        }
    />
    </SafeAreaView>
); 
}
const styles = StyleSheet.create({ 
    container: { 
        flex: 1, 
        backgroundColor: '#f8fafc' 
    }, 
    header: { 
        fontSize: 20, 
        fontWeight: '700', 
        padding: 16 
    },
});