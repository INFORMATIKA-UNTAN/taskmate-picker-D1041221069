import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';

export default function CategoryFilter({ categories, selected, onSelect }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (cat) => {
    onSelect(cat);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Tombol utama */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.dropdownText}>{selected || 'Pilih kategori'}</Text>
      </TouchableOpacity>

      {/* Modal dropdown */}
      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setOpen(false)}
          activeOpacity={1}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    item === selected && styles.activeItem,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.itemText,
                      item === selected && styles.activeItemText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  dropdownButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  dropdownText: {
    color: '#1e293b',
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdown: {
    marginHorizontal: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
  },
  item: {
    padding: 12,
  },
  activeItem: {
    backgroundColor: '#3b82f6',
  },
  itemText: {
    fontSize: 14,
    color: '#1e293b',
  },
  activeItemText: {
    color: '#fff',
    fontWeight: '600',
  },
});
