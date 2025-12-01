import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Background Image */}
            <Image
                source={{ uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80' }}
                style={styles.backgroundImage}
            />

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
                style={styles.gradient}
            />

            <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="airplane" size={48} color="#FFF" />
                    </View>
                    <Text style={styles.appName}>Traverse Visit</Text>
                </View>

                {/* Bottom Content */}
                <View style={styles.bottomContent}>
                    <Text style={styles.title}>Explore the World</Text>
                    <Text style={styles.subtitle}>
                        Discover amazing destinations, connect with travelers, and create unforgettable memories
                    </Text>

                    <TouchableOpacity
                        style={styles.getStartedButton}
                        onPress={() => router.push('/signup' as any)}
                    >
                        <Text style={styles.getStartedButtonText}>Get Started</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => router.push('/login' as any)}
                    >
                        <Text style={styles.loginButtonText}>Already have an account? Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.guestButton}
                        onPress={() => router.replace('/(tabs)' as any)}
                    >
                        <Text style={styles.guestButtonText}>Continue as Guest</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundImage: {
        position: 'absolute',
        width,
        height,
    },
    gradient: {
        position: 'absolute',
        width,
        height,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(78, 205, 196, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    appName: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFF',
    },
    bottomContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
        marginBottom: 40,
    },
    getStartedButton: {
        backgroundColor: '#4ECDC4',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#4ECDC4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },
    getStartedButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
    loginButton: {
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    loginButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    guestButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    guestButtonText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
    },
});
