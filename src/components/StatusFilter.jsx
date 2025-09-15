import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function StatusFilter({ selected, onSelect }) {
  const statuses = ['All', 'Pending' ,'Todo', 'Done'];

  return (
    <View style={styles.container}>
      {statuses.map(status => (
        <TouchableOpacity
          key={status}
          onPress={() => onSelect(status)}
          style={[
            styles.button,
            selected === status && styles.activeButton
          ]}
        >
          <Text
            style={[
              styles.text,
              selected === status && styles.activeText
            ]}
          >
            {status}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
  },
  activeButton: {
    backgroundColor: '#3b82f6',
  },
  text: {
    color: '#1f2937',
    fontWeight: '500',
  },
  activeText: {
    color: 'white',
  },
});
