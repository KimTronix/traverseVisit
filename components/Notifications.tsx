import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Notifications() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.content}>
                <Ionicons name="notifications-outline" size={80} color="#4ECDC4" />
                <Text style={styles.title}>Notifications</Text>
                <Text style={styles.subtitle}>Stay updated with your travels</Text>
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
    },
});
