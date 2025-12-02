import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        const { error } = await signIn(email, password);
        setLoading(false);

        if (error) {
            console.error('Login error:', error);
            Alert.alert('Login Failed', error.message || 'Invalid credentials');
        } else {
            router.replace('/(tabs)');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.content}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="airplane" size={48} color="#4ECDC4" />
                    </View>
                    <Text style={styles.appName}>Traverse Visit</Text>
                    <Text style={styles.tagline}>Explore. Connect. Travel.</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue your journey</Text>

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => router.push('/forgot-password' as any)}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.loginButtonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    {/* Social Login */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider} />
                    </View>

                    <View style={styles.socialButtons}>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-google" size={24} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-apple" size={24} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                        </TouchableOpacity>
                    </View>

                    {/* Sign Up Link */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/signup' as any)}>
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 14,
        color: '#666',
    },
    formContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 32,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#4ECDC4',
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#4ECDC4',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#4ECDC4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: '#999',
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    signupText: {
        fontSize: 14,
        color: '#666',
    },
    signupLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4ECDC4',
    },
});
