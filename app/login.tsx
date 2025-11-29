import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // Handle login logic here
        console.log('Login with:', { email, password });
        // Navigate to home page (tabs)
        router.replace('/(tabs)');
    };

    const handleSocialLogin = (provider: string) => {
        console.log('Login with:', provider);
        // Navigate to home page (tabs)
        router.replace('/(tabs)');
    };

    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80' }}
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo and Title */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Ionicons name="navigate-circle" size={48} color="#4ECDC4" />
                            <Text style={styles.logoText}>Traverse-Visit</Text>
                        </View>
                        <Text style={styles.welcomeText}>Welcome Back, Traveler!</Text>
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
                        {/* Email Input */}
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputIconContainer}>
                                <Ionicons name="mail-outline" size={20} color="rgba(255, 255, 255, 0.7)" />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Email or Username"
                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputIconContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="rgba(255, 255, 255, 0.7)" />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="rgba(255, 255, 255, 0.7)"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity style={styles.forgotPasswordContainer}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Log In</Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR LOG IN WITH</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Login Buttons */}
                        <View style={styles.socialButtonsContainer}>
                            <TouchableOpacity
                                style={styles.socialButton}
                                onPress={() => handleSocialLogin('Google')}
                            >
                                <Ionicons name="logo-google" size={24} color="#DB4437" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.socialButton}
                                onPress={() => handleSocialLogin('Twitter')}
                            >
                                <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.socialButton}
                                onPress={() => handleSocialLogin('Facebook')}
                            >
                                <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                            </TouchableOpacity>
                        </View>

                        {/* Sign Up Link */}
                        <View style={styles.signUpContainer}>
                            <Text style={styles.signUpText}>Don't have an account? </Text>
                            <Link href="/signup" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.signUpLink}>Sign Up</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        backdropFilter: 'blur(10px)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 8,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(20px)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 15,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
    },
    inputIconContainer: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
    },
    eyeIcon: {
        padding: 4,
    },
    forgotPasswordContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#FFFFFF',
        textDecorationLine: 'underline',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    loginButton: {
        backgroundColor: 'rgba(78, 205, 196, 0.8)',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(78, 205, 196, 0.4)',
        backdropFilter: 'blur(10px)',
        shadowColor: '#4ECDC4',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    dividerText: {
        fontSize: 12,
        color: '#FFFFFF',
        marginHorizontal: 16,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        backdropFilter: 'blur(10px)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    signUpText: {
        fontSize: 14,
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    signUpLink: {
        fontSize: 14,
        color: '#4ECDC4',
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});
