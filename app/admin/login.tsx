import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminLoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [is2FAStep, setIs2FAStep] = useState(false);
    const [code, setCode] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter credentials');
            return;
        }
        // Mock validation
        if (email === 'admin@traverse.com' && password === 'admin123') {
            setIs2FAStep(true);
        } else {
            Alert.alert('Access Denied', 'Invalid admin credentials');
        }
    };

    const handleVerify2FA = () => {
        if (code === '123456') {
            router.replace('/admin/dashboard');
        } else {
            Alert.alert('Error', 'Invalid verification code');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.logoContainer}>
                    <View style={styles.adminBadge}>
                        <Ionicons name="shield-checkmark" size={32} color="#fff" />
                    </View>
                    <Text style={styles.title}>Admin Portal</Text>
                    <Text style={styles.subtitle}>Authorized Personnel Only</Text>
                </View>

                {!is2FAStep ? (
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Admin Email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Authenticate</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.form}>
                        <View style={styles.infoBox}>
                            <Ionicons name="phone-portrait-outline" size={24} color="#4ECDC4" />
                            <Text style={styles.infoText}>
                                Enter the 6-digit code sent to your secure device ending in ••89
                            </Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Ionicons name="keypad-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="000000"
                                value={code}
                                onChangeText={setCode}
                                keyboardType="number-pad"
                                maxLength={6}
                            />
                        </View>

                        <TouchableOpacity style={styles.loginButton} onPress={handleVerify2FA}>
                            <Text style={styles.loginButtonText}>Verify Access</Text>
                            <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.backButton} onPress={() => setIs2FAStep(false)}>
                            <Text style={styles.backButtonText}>Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.warningBox}>
                    <Ionicons name="warning-outline" size={20} color="#FF5252" />
                    <Text style={styles.warningText}>
                        Unauthorized access attempts are monitored and logged.
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A', // Dark theme for admin
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    adminBadge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#4ECDC4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        letterSpacing: 1,
    },
    form: {
        gap: 16,
        marginBottom: 32,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 16,
        color: '#fff',
    },
    loginButton: {
        flexDirection: 'row',
        backgroundColor: '#4ECDC4',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#2A2A2A',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#ccc',
        lineHeight: 20,
    },
    backButton: {
        alignItems: 'center',
        padding: 8,
    },
    backButtonText: {
        color: '#666',
        fontSize: 14,
    },
    warningBox: {
        flexDirection: 'row',
        backgroundColor: '#FF525215',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#FF525230',
    },
    warningText: {
        flex: 1,
        fontSize: 12,
        color: '#FF5252',
        lineHeight: 18,
    },
});
