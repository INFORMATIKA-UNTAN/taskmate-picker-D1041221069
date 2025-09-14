import { View, Text, StyleSheet } from 'react-native';

// Warna untuk kategori
const categoryColors = {
    Mobile: '#34d399', // green
    RPL: '#fbbf24',    // yellow
    IoT: '#60a5fa',    // blue
};

export default function CategoryBadge({ categories }) {
    return (
        <View style={styles.container}>
            {categories.map((cat, index) => (
                <View
                    key={index}
                    style={[
                        styles.badge,
                        { backgroundColor: categoryColors[cat.name] || '#e2e8f0' }
                    ]}
                >
                    <Text style={styles.badgeText}>{cat.name}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
});
