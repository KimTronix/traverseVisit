import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';

export default function SignUpScreen() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const { error } = await signUp(email, password, name);
        setLoading(false);

        if (error) {
            const errorMessage = error.message || 'Could not create account';
            console.error('Signup error details:', error);
            Alert.alert(
                'Sign Up Failed',
                errorMessage,
                [{ text: 'OK' }]
            );
        } else {
            Alert.alert(
                'Success',
                'Account created! Please check your email to verify your account.',
                [{ text: 'OK', onPress: () => router.replace('/login') }]
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.content}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="airplane" size={48} color="#4ECDC4" />
                        </View>
                        <Text style={styles.appName}>Traverse Visit</Text>
                        <Text style={styles.tagline}>Start your journey today</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Sign up to get started</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="#999"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>

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

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor="#999"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
                            onPress={handleSignUp}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.signUpButtonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>

                        {/* Debug Button - Remove in production */}
                        <TouchableOpacity
                            style={[styles.signUpButton, { backgroundColor: '#FF9500', marginTop: 10 }]}
                            onPress={async () => {
                                try {
                                    const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
                                    console.log('Testing connection to:', url);

                                    // Test 1: Root URL
                                    const rootRes = await fetch(url || '');
                                    console.log('Root Status:', rootRes.status);

                                    // Test 2: Auth Health
                                    const authRes = await fetch((url || '') + '/auth/v1/health');
                                    console.log('Auth Status:', authRes.status);

                                    Alert.alert(
                                        'Connection Diagnostics',
                                        'Root: ' + rootRes.status + '\n' +
                                        'Auth: ' + authRes.status + '\n' +
                                        'Msg: ' + (await authRes.text()).substring(0, 50)
                                    );
                                } catch (e: any) {
                                    Alert.alert('Connection Failed', e.message);
                                }
                            }}
                        >
                            <Text style={styles.signUpButtonText}>Test Connection</Text>
                        </TouchableOpacity>

                        {/* Social Sign Up */}
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

                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text style={styles.loginLink}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
    signUpButton: {
        backgroundColor: '#4ECDC4',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#4ECDC4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        marginTop: 8,
    },
    signUpButtonDisabled: {
        opacity: 0.7,
    },
    signUpButtonText: {
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    loginText: {
        fontSize: 14,
        color: '#666',
    },
    loginLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4ECDC4',
    },
});
