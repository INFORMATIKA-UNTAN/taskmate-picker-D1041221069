import { useEffect, useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, Text, FlatList, StyleSheet, View, Button, Alert, SectionList } from 'react-native';
import TaskItem from '../src/components/Taskitem';
import FilterToolbarFancy from '../src/components/FilterToolBarFancy.jsx';
import AddCategoryModal from '../src/components/AddCategoryModal';
import { loadTasks, saveTasks, clearTasks } from '../src/storage/taskStorage';
import { loadCategories, saveCategories } from '../src/storage/categoryStorage';
import { pickColor } from '../src/constants/categories';
import { weightOfPriority } from '../src/constants/priorities';

export default function Home() {
  // [STATE] data
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  // [STATE] filter
  const [statusFilter, setStatusFilter] = useState('all');      // 'all' | 'todo' | 'Done'
  const [categoryFilter, setCategoryFilter] = useState('all');  // 'all' | 'Umum' | ...
  const [priorityFilter, setPriorityFilter] = useState('all');  // 'all' | 'Low' | 'Medium' | 'High'

  // [STATE] modal tambah kategori di Home (opsional)
  const [showCatModal, setShowCatModal] = useState(false);

  // [INIT] Muat data tugas & kategori
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

  // [AKSI] Toggle status Done/Pending
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

  // [AKSI] Hapus 1 tugas
  const handleDelete = async (task) => {
    const updated = tasks.filter(t => t.id !== task.id);
    setTasks(updated);
    await saveTasks(updated);
    // Alert.alert('Konfirmasi', 'Hapus tugas ini?', [
    //   { text: 'Batal' },
    //   {
    //     text: 'Ya',
    //     onPress: async () => {
    //       const updated = tasks.filter(t => t.id !== task.id);
    //       setTasks(updated);
    //       await saveTasks(updated);
    //     }
    //   }
    // ]);
  };

  // [INFO] Toolbar: Done/Total & Overdue
  const doneCount = useMemo(() => tasks.filter(t => t.status === 'Done').length, [tasks]);
  const today = useMemo(() => new Date().toISOString().slice(0,10), []);
  const overdueCount = useMemo(() =>
    tasks.filter(t => t.deadline && t.deadline < today && t.status !== 'Done').length
  , [tasks, today]);


    // [AKSI] Clear
    const handleClearDone = async (task) => {
        const kept = tasks.filter(t => t.status !== 'Done');
        setTasks(kept);
        await saveTasks(kept);
    };
    // const handleClearDone = () => {
    // if (!doneCount) { Alert.alert('Info', 'Tidak ada tugas Done.'); return; }
    // Alert.alert('Hapus Tugas Selesai', `Yakin hapus ${doneCount} tugas selesai?`, [
    //   { text:'Batal' },
    //   {
    //     text:'Hapus', style:'destructive', onPress: async () => {
    //       const kept = tasks.filter(t => t.status !== 'Done');
    //       setTasks(kept);
    //       await saveTasks(kept);
    //     }
    //   }
    // ]);
    //};

    const handleClearAll = async (task) => {
        setTasks([]);
        await clearTasks();
    };
//   const handleClearAll = () => {
//     if (!tasks.length) { Alert.alert('Info', 'Daftar tugas kosong.'); return; }
//     Alert.alert('Konfirmasi', 'Hapus semua tugas?', [
//       { text:'Batal' },
//       { text:'Ya', onPress: async () => { 
//         setTasks([]); 
//         await clearTasks(); 
//         } }
//     ]);
//   };

  // [FILTER] status + kategori + prioritas
  
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const byStatus =
        statusFilter === 'all' ||
        (statusFilter === 'todo' ? t.status !== 'Done' : t.status === 'Done');

      const byCategory =
        categoryFilter === 'all' || (t.category ?? 'Umum') === categoryFilter;

      const byPriority =
        priorityFilter === 'all' || (t.priority ?? 'Low') === priorityFilter;

      return byStatus && byCategory && byPriority;
    });
  }, [tasks, statusFilter, categoryFilter, priorityFilter]);

  // [SORT] prioritas High→Low, lalu deadline terdekat
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      const wa = weightOfPriority(a.priority ?? 'Low');
      const wb = weightOfPriority(b.priority ?? 'Low');
      if (wa !== wb) return wb - wa;  // prioritas tinggi dulu
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }, [filteredTasks]);

  // [OPSIONAL] Tambah kategori dari Home
  const handleSubmitCategory = async (cat) => {
    if (categories.some(c => c.key.toLowerCase() === cat.key.toLowerCase())) {
    //   Alert.alert('Info', 'Nama kategori sudah ada.');
      setShowCatModal(false);
      return;
    }
    const color = cat.color || pickColor(categories.length);
    const next = [...categories, { key: cat.key, color }];
    setCategories(next);
    await saveCategories(next);
    setCategoryFilter(cat.key);
    setShowCatModal(false);
  };

  const groupedTasks = useMemo(() => {
  const groups = {};

  sortedTasks.forEach(task => {
    const cat = task.category || 'Umum';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(task);
  });

  return Object.keys(groups).map(cat => ({
    title: cat,
    data: groups[cat],
  }));
}, [sortedTasks]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>TaskMate – Daftar Tugas</Text>

      {/* [UPDATE] Toolbar filter fancy */}
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        <FilterToolbarFancy
          categories={categories}
          categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
        />

        {/* [INFO] Toolbar ringkasan */}
        <View style={styles.toolbar}>
          <Text style={styles.toolbarText}>Done: {doneCount} / {tasks.length}</Text>
          <Text style={[styles.toolbarText, { color: overdueCount ? '#dc2626' : '#334155' }]}>
            Overdue: {overdueCount}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button title="Clear Done" onPress={handleClearDone} disabled={!doneCount} />
            <Button title="Clear All" onPress={handleClearAll} />
          </View>
        </View>
      </View>

      {/* [LIST] Tugas tersortir */}
      <SectionList
  sections={groupedTasks}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ padding: 16 }}
  renderItem={({ item }) => (
    <TaskItem
      task={item}
      categories={categories}
      onToggle={handleToggle}
      onDelete={handleDelete}
    />
  )}
  renderSectionHeader={({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  )}
  ListEmptyComponent={
    <Text style={{ textAlign: 'center' }}>Tidak ada tugas</Text>
  }
/>

      {/* [OPSIONAL] Modal tambah kategori dari Home */}
      <AddCategoryModal
        visible={showCatModal}
        onClose={() => setShowCatModal(false)}
        onSubmit={handleSubmitCategory}
        suggestedColor={pickColor(categories.length)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { fontSize: 20, fontWeight: '700', padding: 16 },
  toolbar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  toolbarText: { fontWeight: '600', color: '#334155' },
  sectionHeader: {
  fontSize: 16,
  fontWeight: '700',
  color: '#0f172a',
  backgroundColor: '#f1f5f9',
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 6,
  marginBottom: 6,
  marginTop: 12,
},
});