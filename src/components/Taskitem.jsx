import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { colorOfName } from '../constants/categories';
import { colorOfPriority } from '../constants/priorities';

export default function TaskItem({ task, onToggle, onDelete }) {
  const catColor = colorOfName(task.category ?? 'Umum');
  const prioColor = colorOfPriority(task.priority ?? 'Low');

  let deadlineInfo = null;
  if (task.deadline) {
    const today = new Date().toISOString().slice(0, 10);
    if (task.deadline < today) {
      deadlineInfo = <Text style={[styles.deadline, { color: '#dc2626' }]}>Overdue</Text>;
    } else {
      const diff = Math.ceil(
        (new Date(task.deadline) - new Date(today)) / (1000 * 60 * 60 * 24)
      );
      deadlineInfo = (
        <Text style={[styles.deadline, { color: '#0f172a' }]}>
          Sisa {diff} hari
        </Text>
      );
    }
  }

  return (
    <TouchableOpacity onPress={() => onToggle?.(task)} activeOpacity={0.7}> 
      <View style={[
        styles.card, task.status === 'Done' && styles.cardDone,
        task.priority?.toLowerCase() === 'low' && styles.cardLow,
        task.priority?.toLowerCase() === 'medium' && styles.cardMedium,
        task.priority?.toLowerCase() === 'high' && styles.cardHigh,
      ]}> 
        <View style={{ flex: 1 }}> 
          <Text style={[styles.title, task.status === 'Done' && styles.strike]}>
            {task.title}
          </Text>

          {!!task.deadline && <Text style={styles.deadline}>Deadline: {task.deadline}</Text>}{deadlineInfo}
          {!!task.description && <Text style={styles.desc}>{task.description}</Text>}
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <View style={[styles.badge, { borderColor: catColor, backgroundColor: `${catColor}20` }]}>
              <Text style={[styles.badgeText, { color: catColor }]}>{task.category ?? 'Umum'}</Text>
            </View>
            <View style={[styles.badge, { borderColor: prioColor, backgroundColor: `${prioColor}20` }]}>
              <Text style={[styles.badgeText, { color: prioColor }]}>{task.priority ?? 'Low'}</Text>
            </View>
        </View>

        </View> 

        {/* Badge status */}
        <View
          style={[
            styles.badge,
            task.status === 'Pending'
              ? styles.badgePending
              : task.status === 'Todo'
              ? styles.badgeTodo
              : styles.badgeDone
          ]}
        >
          <Text style={styles.badgeText}>{task.status}</Text> 
        </View>

        {/* Tombol hapus */}
        <View style={styles.badge}>
          <Button title="🗑" onPress={() => onDelete?.(task)} />
        </View>
      </View> 
    </TouchableOpacity> 
  ); 
} 

const styles = StyleSheet.create({ 
  card: { 
    padding: 14, 
    borderRadius: 12, 
    backgroundColor: '#fff', 
    marginBottom: 10, 
    flexDirection: 'row', 
    alignItems: 'center', 
    elevation: 1 
  }, 
  
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 }, 
  strike: { textDecorationLine: 'line-through', color: '#64748b' }, 
  desc: { color: '#475569', marginBottom: 6 }, 
  meta: { fontSize: 12, color: '#64748b' }, 
  badge: { 
    paddingVertical: 6, 
    paddingHorizontal: 10, 
    borderRadius: 8, 
    marginLeft: 12 
  }, 
  badgePending: { backgroundColor: '#fdba74' },   // orange 
  badgeTodo: { backgroundColor: '#ed3131ff' },     // pink 
  badgeDone: { backgroundColor: '#dcfce7' },     // green 
  badgeText: { fontWeight: '700', fontSize: 12 },

  cardDone: { backgroundColor: '#f4f9f1ff' }, 
  cardHigh: { backgroundColor: '#ffe4e6' },   // merah muda
  cardMedium: { backgroundColor: '#fef9c3' }, // kuning muda
  cardLow: { backgroundColor: '#f1f5f9' },    // abu-abu muda
}); 
