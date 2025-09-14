import { useMemo, useState } from 'react'; 
import { SafeAreaView, StyleSheet, Text, FlatList, View, TouchableOpacity} from 'react-native'; 
import TaskItem from '../src/components/Taskitem.jsx';
import StatusFilter from '../src/components/StatusFilter.jsx';
import CategoryFilter from '../src/components/CategoryFilter.jsx';
import { dummyTasks } from '../src/data/dummyTasks.js';

export default function HomeScreen() { 
    const [tasks, setTasks] = useState(dummyTasks); 
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');

    const handleToggle = (task) => { 
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t)); 
    };

    const categories = useMemo(()=>{
        const categorySet = new Set();
        dummyTasks.forEach(
            task => categorySet.add(task.category)
        )
        return ['All', ...Array.from(categorySet)];
    },[])

    const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
        const matchCategory = selectedCategory === 'All' || task.category === selectedCategory;
        const matchStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Done' && task.status === 'done') ||
        (selectedStatus === 'ToDo' && task.status === 'pending');
        return matchCategory && matchStatus;
    });
    }, [selectedCategory, selectedStatus, tasks]);

return ( 
    <SafeAreaView style={styles.container}>
    <Text style={styles.header}>TaskMate – Daftar Tugas</Text>
    <CategoryFilter 
        categories={categories} 
        selected={selectedCategory} 
        onSelect={setSelectedCategory} 
    />
    <StatusFilter
        selected={selectedStatus}
        onSelect={setSelectedStatus}
    />
    <FlatList 
        data={filteredTasks} 
        keyExtractor={(item) => item.id} 
        contentContainerStyle={{ padding: 16 }} 
        renderItem={({ item }) => <TaskItem task={item} onToggle={handleToggle} />} 
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