import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface SettingsState {
    notifications: {
        push: boolean;
        email: boolean;
        sms: boolean;
        bookingUpdates: boolean;
        priceAlerts: boolean;
        socialActivity: boolean;
    };
    privacy: {
        profileVisibility: 'public' | 'friends' | 'private';
        showOnlineStatus: boolean;
        allowLocationSharing: boolean;
        dataSharing: boolean;
    };
    account: {
        accountType: 'traveler' | 'host' | 'both';
        emailVerified: boolean;
        phoneVerified: boolean;
        twoFactorEnabled: boolean;
    };
    preferences: {
        theme: 'light' | 'dark' | 'system';
        language: string;
        currency: string;
        autoPlayVideos: boolean;
        highQualityPhotos: boolean;
    };
}

export default function SettingsScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState<SettingsState>({
        notifications: {
            push: true,
            email: true,
            sms: false,
            bookingUpdates: true,
            priceAlerts: true,
            socialActivity: true,
        },
        privacy: {
            profileVisibility: 'public',
            showOnlineStatus: true,
            allowLocationSharing: false,
            dataSharing: false,
        },
        account: {
            accountType: 'traveler',
            emailVerified: true,
            phoneVerified: false,
            twoFactorEnabled: false,
        },
        preferences: {
            theme: 'system',
            language: 'en',
            currency: 'USD',
            autoPlayVideos: false,
            highQualityPhotos: true,
        },
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedSettings = await AsyncStorage.getItem('user_settings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveSettings = async (newSettings: SettingsState) => {
        try {
            await AsyncStorage.setItem('user_settings', JSON.stringify(newSettings));
            setSettings(newSettings);
        } catch (error) {
            console.error('Error saving settings:', error);
            Alert.alert('Error', 'Failed to save settings');
        }
    };

    const updateNotificationSetting = (key: keyof SettingsState['notifications'], value: boolean) => {
        const newSettings = {
            ...settings,
            notifications: {
                ...settings.notifications,
                [key]: value,
            },
        };
        saveSettings(newSettings);
    };

    const updatePrivacySetting = (key: keyof SettingsState['privacy'], value: any) => {
        const newSettings = {
            ...settings,
            privacy: {
                ...settings.privacy,
                [key]: value,
            },
        };
        saveSettings(newSettings);
    };

    const updatePreference = (key: keyof SettingsState['preferences'], value: any) => {
        const newSettings = {
            ...settings,
            preferences: {
                ...settings.preferences,
                [key]: value,
            },
        };
        saveSettings(newSettings);
    };

    const handleAccountTypeChange = (type: 'traveler' | 'host' | 'both') => {
        if (type === 'host' || type === 'both') {
            router.push('/business-registration');
        } else {
            const newSettings = {
                ...settings,
                account: {
                    ...settings.account,
                    accountType: type,
                },
            };
            saveSettings(newSettings);
        }
    };

    const handleEditProfile = () => {
        router.push('/edit-profile');
    };

    const handlePaymentMethods = () => {
        Alert.alert('Payment Methods', 'This feature will show your saved payment methods. Coming soon!');
    };

    const handleSecuritySettings = () => {
        Alert.alert('Security Settings', 'This feature will show security options like 2FA. Coming soon!');
    };

    const handleHelpSupport = () => {
        Alert.alert('Help & Support', 'This will open the help center. Coming soon!');
    };

    const handleAboutLegal = () => {
        Alert.alert('About & Legal', 'This will show terms, privacy policy, etc. Coming soon!');
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('user_token');
                            await AsyncStorage.removeItem('user_profile');
                            router.replace('/login');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout');
                        }
                    }
                }
            ]
        );
    };

    const handleVerifyEmail = () => {
        Alert.alert('Verify Email', 'Verification email sent! Please check your inbox.');
    };

    const handleVerifyPhone = () => {
        router.push('/verify-phone');
    };

    const handleEnable2FA = () => {
        Alert.alert('Enable 2FA', 'This will guide you through setting up two-factor authentication. Coming soon!');
    };

    const handleBecomeHost = () => {
        router.push('/business-registration');
    };

    const renderSettingItem = (
        icon: string,
        title: string,
        subtitle?: string,
        rightComponent?: React.ReactNode,
        onPress?: () => void,
        showArrow?: boolean
    ) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
            <View style={styles.settingLeft}>
                <Ionicons name={icon as any} size={24} color="#666" />
                <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <View style={styles.settingRight}>
                {rightComponent}
                {showArrow && onPress && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
            </View>
        </TouchableOpacity>
    );

    const renderNotificationSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            
            {renderSettingItem(
                'notifications-outline',
                'Push Notifications',
                'Receive notifications on your device',
                <Switch
                    value={settings.notifications.push}
                    onValueChange={(value) => updateNotificationSetting('push', value)}
                />
            )}

            {renderSettingItem(
                'mail-outline',
                'Email Notifications',
                'Receive updates via email',
                <Switch
                    value={settings.notifications.email}
                    onValueChange={(value) => updateNotificationSetting('email', value)}
                />
            )}

            {renderSettingItem(
                'phone-portrait-outline',
                'SMS Notifications',
                'Get text messages for important updates',
                <Switch
                    value={settings.notifications.sms}
                    onValueChange={(value) => updateNotificationSetting('sms', value)}
                />
            )}

            {renderSettingItem(
                'calendar-outline',
                'Booking Updates',
                'Notifications about your bookings',
                <Switch
                    value={settings.notifications.bookingUpdates}
                    onValueChange={(value) => updateNotificationSetting('bookingUpdates', value)}
                />
            )}

            {renderSettingItem(
                'pricetag-outline',
                'Price Alerts',
                'Get notified about price changes',
                <Switch
                    value={settings.notifications.priceAlerts}
                    onValueChange={(value) => updateNotificationSetting('priceAlerts', value)}
                />
            )}

            {renderSettingItem(
                'people-outline',
                'Social Activity',
                'Likes, comments, and follows',
                <Switch
                    value={settings.notifications.socialActivity}
                    onValueChange={(value) => updateNotificationSetting('socialActivity', value)}
                />
            )}
        </View>
    );

    const renderPrivacySection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy & Security</Text>
            
            {renderSettingItem(
                'eye-outline',
                'Profile Visibility',
                `Currently: ${settings.privacy.profileVisibility}`,
                <Text style={styles.settingValue}>{settings.privacy.profileVisibility}</Text>,
                () => Alert.alert('Profile Visibility', 'Choose who can see your profile. Coming soon!'),
                true
            )}

            {renderSettingItem(
                'radio-outline',
                'Show Online Status',
                'Let others see when you\'re online',
                <Switch
                    value={settings.privacy.showOnlineStatus}
                    onValueChange={(value) => updatePrivacySetting('showOnlineStatus', value)}
                />
            )}

            {renderSettingItem(
                'location-outline',
                'Location Sharing',
                'Share your location for better recommendations',
                <Switch
                    value={settings.privacy.allowLocationSharing}
                    onValueChange={(value) => updatePrivacySetting('allowLocationSharing', value)}
                />
            )}

            {renderSettingItem(
                'share-outline',
                'Data Sharing',
                'Share anonymous data to improve the app',
                <Switch
                    value={settings.privacy.dataSharing}
                    onValueChange={(value) => updatePrivacySetting('dataSharing', value)}
                />
            )}

            {renderSettingItem(
                'shield-checkmark-outline',
                'Security Settings',
                'Two-factor authentication, password change',
                null,
                handleSecuritySettings,
                true
            )}
        </View>
    );

    const renderAccountSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            {renderSettingItem(
                'person-outline',
                'Edit Profile',
                'Update your profile information',
                null,
                handleEditProfile,
                true
            )}

            {renderSettingItem(
                'card-outline',
                'Payment Methods',
                'Manage your payment options',
                null,
                handlePaymentMethods,
                true
            )}

            {renderSettingItem(
                'wallet-outline',
                'Wallet',
                'View your balance and transaction history',
                null,
                () => router.push('/wallet'),
                true
            )}

            {renderSettingItem(
                'business-outline',
                'Account Type',
                `Currently: ${settings.account.accountType}`,
                <Text style={styles.settingValue}>{settings.account.accountType}</Text>,
                () => Alert.alert(
                    'Account Type',
                    'Choose your account type',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Traveler', onPress: () => handleAccountTypeChange('traveler') },
                        { text: 'Host', onPress: () => handleAccountTypeChange('host') },
                        { text: 'Both', onPress: () => handleAccountTypeChange('both') },
                    ]
                ),
                true
            )}

            {renderSettingItem(
                'mail-outline',
                'Email Verification',
                settings.account.emailVerified ? 'Verified' : 'Not verified',
                <View style={styles.verificationBadge}>
                    <Ionicons 
                        name={settings.account.emailVerified ? 'checkmark-circle' : 'close-circle'} 
                        size={20} 
                        color={settings.account.emailVerified ? '#00C851' : '#FF3B30'} 
                    />
                </View>,
                settings.account.emailVerified ? undefined : handleVerifyEmail,
                !settings.account.emailVerified
            )}

            {renderSettingItem(
                'phone-portrait-outline',
                'Phone Verification',
                settings.account.phoneVerified ? 'Verified' : 'Not verified',
                <View style={styles.verificationBadge}>
                    <Ionicons 
                        name={settings.account.phoneVerified ? 'checkmark-circle' : 'close-circle'} 
                        size={20} 
                        color={settings.account.phoneVerified ? '#00C851' : '#FF3B30'} 
                    />
                </View>,
                settings.account.phoneVerified ? undefined : handleVerifyPhone,
                !settings.account.phoneVerified
            )}

            {renderSettingItem(
                'key-outline',
                'Two-Factor Authentication',
                settings.account.twoFactorEnabled ? 'Enabled' : 'Disabled',
                <View style={styles.verificationBadge}>
                    <Ionicons 
                        name={settings.account.twoFactorEnabled ? 'checkmark-circle' : 'close-circle'} 
                        size={20} 
                        color={settings.account.twoFactorEnabled ? '#00C851' : '#FF3B30'} 
                    />
                </View>,
                settings.account.twoFactorEnabled ? undefined : handleEnable2FA,
                !settings.account.twoFactorEnabled
            )}
        </View>
    );

    const renderPreferencesSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            {renderSettingItem(
                'color-palette-outline',
                'Theme',
                `Currently: ${settings.preferences.theme}`,
                <Text style={styles.settingValue}>{settings.preferences.theme}</Text>,
                () => Alert.alert(
                    'Theme',
                    'Choose your preferred theme',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Light', onPress: () => updatePreference('theme', 'light') },
                        { text: 'Dark', onPress: () => updatePreference('theme', 'dark') },
                        { text: 'System', onPress: () => updatePreference('theme', 'system') },
                    ]
                ),
                true
            )}

            {renderSettingItem(
                'language-outline',
                'Language',
                `Currently: ${settings.preferences.language}`,
                <Text style={styles.settingValue}>{settings.preferences.language}</Text>,
                () => Alert.alert('Language', 'Language selection coming soon!'),
                true
            )}

            {renderSettingItem(
                'cash-outline',
                'Currency',
                `Currently: ${settings.preferences.currency}`,
                <Text style={styles.settingValue}>{settings.preferences.currency}</Text>,
                () => Alert.alert('Currency', 'Currency selection coming soon!'),
                true
            )}

            {renderSettingItem(
                'videocam-outline',
                'Auto-play Videos',
                'Automatically play videos in feed',
                <Switch
                    value={settings.preferences.autoPlayVideos}
                    onValueChange={(value) => updatePreference('autoPlayVideos', value)}
                />
            )}

            {renderSettingItem(
                'image-outline',
                'High Quality Photos',
                'Load photos in high quality (uses more data)',
                <Switch
                    value={settings.preferences.highQualityPhotos}
                    onValueChange={(value) => updatePreference('highQualityPhotos', value)}
                />
            )}
        </View>
    );

    const renderSupportSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            {renderSettingItem(
                'help-circle-outline',
                'Help & Support',
                'Get help with common issues',
                null,
                handleHelpSupport,
                true
            )}

            {renderSettingItem(
                'document-text-outline',
                'About & Legal',
                'Terms, privacy policy, and more',
                null,
                handleAboutLegal,
                true
            )}

            {renderSettingItem(
                'star-outline',
                'Rate App',
                'Rate us on the app store',
                null,
                () => Alert.alert('Rate App', 'Thank you for using Traverse-Visit!'),
                true
            )}

            {renderSettingItem(
                'share-social-outline',
                'Share App',
                'Share Traverse-Visit with friends',
                null,
                () => Alert.alert('Share App', 'Share feature coming soon!'),
                true
            )}
        </View>
    );

    const renderBecomeHostSection = () => (
        <View style={styles.section}>
            <TouchableOpacity style={styles.becomeHostCard} onPress={handleBecomeHost}>
                <Ionicons name="home-outline" size={32} color="#007AFF" />
                <View style={styles.becomeHostContent}>
                    <Text style={styles.becomeHostTitle}>Become a Host</Text>
                    <Text style={styles.becomeHostSubtitle}>
                        Earn money by sharing your space with travelers
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#007AFF" />
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading settings...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {renderNotificationSection()}
                {renderPrivacySection()}
                {renderAccountSection()}
                {renderPreferencesSection()}
                
                {settings.account.accountType === 'traveler' && renderBecomeHostSection()}
                
                {renderSupportSection()}

                {/* Logout Button */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.versionText}>Traverse-Visit v1.0.0</Text>
                    <Text style={styles.copyrightText}>© 2025 Traverse-Visit Inc.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingContent: {
        marginLeft: 16,
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValue: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    verificationBadge: {
        marginLeft: 8,
    },
    becomeHostCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    becomeHostContent: {
        flex: 1,
        marginLeft: 16,
    },
    becomeHostTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#007AFF',
        marginBottom: 4,
    },
    becomeHostSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#FF3B30',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B30',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 32,
        marginTop: 20,
    },
    versionText: {
        fontSize: 14,
        color: '#999',
        marginBottom: 4,
    },
    copyrightText: {
        fontSize: 12,
        color: '#ccc',
    },
});
