import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CategoryFilter({ categories, selected, onSelect }) {
    return (
        <View style={styles.container}>
            {categories.map(cat => (
                <TouchableOpacity
                    key={cat}
                    onPress={() => onSelect(cat)}
                    style={[
                        styles.button,
                        selected === cat && styles.activeButton
                    ]}
                >
                    <Text style={[
                        styles.text,
                        selected === cat && styles.activeText
                    ]}>
                        {cat}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 8,
        marginBottom: 8,
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: '#e2e8f0',
    },
    activeButton: {
        backgroundColor: '#3b82f6',
    },
    text: {
        color: '#1e293b',
        fontWeight: '500',
    },
    activeText: {
        color: 'white',
    },
});
