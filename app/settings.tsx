import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const router = useRouter();
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [messageNotifications, setMessageNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        // Handle logout
                        router.replace('/(tabs)' as any);
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={() => router.push('/edit-profile' as any)}
                    >
                        <View style={styles.settingLeft}>
                            <Ionicons name="person-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Edit Profile</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="lock-closed-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Privacy & Security</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="card-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Payment Methods</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>
                </View>

                {/* Notifications Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="notifications-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Push Notifications</Text>
                        </View>
                        <Switch
                            value={pushNotifications}
                            onValueChange={setPushNotifications}
                            trackColor={{ false: '#767577', true: '#4ECDC4' }}
                            thumbColor="#f4f3f4"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="mail-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Email Notifications</Text>
                        </View>
                        <Switch
                            value={emailNotifications}
                            onValueChange={setEmailNotifications}
                            trackColor={{ false: '#767577', true: '#4ECDC4' }}
                            thumbColor="#f4f3f4"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="chatbubble-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Message Notifications</Text>
                        </View>
                        <Switch
                            value={messageNotifications}
                            onValueChange={setMessageNotifications}
                            trackColor={{ false: '#767577', true: '#4ECDC4' }}
                            thumbColor="#f4f3f4"
                        />
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="moon-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: '#767577', true: '#4ECDC4' }}
                            thumbColor="#f4f3f4"
                        />
                    </View>

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="language-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Language</Text>
                        </View>
                        <View style={styles.settingRight}>
                            <Text style={styles.settingValue}>English</Text>
                            <Ionicons name="chevron-forward" size={20} color="#CCC" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="globe-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Currency</Text>
                        </View>
                        <View style={styles.settingRight}>
                            <Text style={styles.settingValue}>USD</Text>
                            <Ionicons name="chevron-forward" size={20} color="#CCC" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Host Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hosting</Text>

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="home-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Become a Host</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="swap-horizontal-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Switch to Host Mode</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="help-circle-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Help Center</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="chatbubbles-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Contact Support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="document-text-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Terms of Service</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="shield-checkmark-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>Privacy Policy</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="information-circle-outline" size={22} color="#666" />
                            <Text style={styles.settingLabel}>App Version</Text>
                        </View>
                        <Text style={styles.settingValue}>1.0.0</Text>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: '#FFF',
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    settingLabel: {
        fontSize: 16,
        color: '#333',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    settingValue: {
        fontSize: 15,
        color: '#999',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginTop: 30,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B30',
    },
});
