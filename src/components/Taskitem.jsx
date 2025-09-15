import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native'; 

const colors = [
  '#f87171', // red
  '#fbbf24', // amber
  '#34d399', // green
  '#60a5fa', // blue
  '#a78bfa', // purple
  '#f472b6', // pink
];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}
export default function TaskItem({ task, onToggle, onDelete }) { 
  return ( 
    <TouchableOpacity onPress={() => onToggle?.(task)} activeOpacity={0.7}> 
      <View style={[styles.card, task.status === 'Done' && styles.cardDone]}> 
        <View style={{ flex: 1 }}> 
          <Text style={[styles.title, task.status === 'Done' && styles.strike]}>
            {task.title}
          </Text> 
          <Text style={styles.desc}>{task.description}</Text> 
          <Text style={styles.meta}>{task.category} • Due {task.deadline}</Text> 
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
  cardDone: { backgroundColor: '#f1f5f9' }, 
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
  badgeTodo: { backgroundColor: '#fee2e2' },     // pink 
  badgeDone: { backgroundColor: '#dcfce7' },     // green 
  badgeText: { fontWeight: '700', fontSize: 12 }, 
}); 
