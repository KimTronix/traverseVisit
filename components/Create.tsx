import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Create() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.content}>
                <Ionicons name="add-circle-outline" size={80} color="#4ECDC4" />
                <Text style={styles.title}>Create</Text>
                <Text style={styles.subtitle}>Plan your next adventure</Text>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push('/group-planning')}
                    >
                        <Ionicons name="people-outline" size={40} color="#4ECDC4" />
                        <Text style={styles.actionTitle}>Group Planning</Text>
                        <Text style={styles.actionDescription}>Plan trips with friends</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push('/create-post')}
                    >
                        <Ionicons name="camera-outline" size={40} color="#4ECDC4" />
                        <Text style={styles.actionTitle}>Share Post</Text>
                        <Text style={styles.actionDescription}>Share your travels</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push('/destination-map')}
                    >
                        <Ionicons name="map-outline" size={40} color="#4ECDC4" />
                        <Text style={styles.actionTitle}>Plan Trip</Text>
                        <Text style={styles.actionDescription}>Explore destinations</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push('/business-registration')}
                    >
                        <Ionicons name="briefcase-outline" size={40} color="#4ECDC4" />
                        <Text style={styles.actionTitle}>Register Business</Text>
                        <Text style={styles.actionDescription}>Become a service provider</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        width: width,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
        marginBottom: 32,
    },
    actionsContainer: {
        width: '100%',
        gap: 16,
    },
    actionCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 12,
    },
    actionDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});
