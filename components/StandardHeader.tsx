import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface StandardHeaderProps {
    title: string;
    showBackButton?: boolean;
    showNotifications?: boolean;
    showMessages?: boolean;
    showSettings?: boolean;
    unreadNotifications?: number;
    unreadMessages?: number;
    onBackPress?: () => void;
    onNotificationsPress?: () => void;
    onMessagesPress?: () => void;
    onSettingsPress?: () => void;
}

export default function StandardHeader({
    title,
    showBackButton = true,
    showNotifications = true,
    showMessages = true,
    showSettings = false,
    unreadNotifications = 0,
    unreadMessages = 0,
    onBackPress,
    onNotificationsPress,
    onMessagesPress,
    onSettingsPress,
}: StandardHeaderProps) {
    const router = useRouter();

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    const handleNotificationsPress = () => {
        if (onNotificationsPress) {
            onNotificationsPress();
        } else {
            router.push('/notifications-list' as any);
        }
    };

    const handleMessagesPress = () => {
        if (onMessagesPress) {
            onMessagesPress();
        } else {
            router.push('/(tabs)/messages' as any);
        }
    };

    const handleSettingsPress = () => {
        if (onSettingsPress) {
            onSettingsPress();
        } else {
            router.push('/settings' as any);
        }
    };

    return (
        <View style={styles.header}>
            <View style={styles.leftSection}>
                {showBackButton && (
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
            </Text>

            <View style={styles.rightSection}>
                {showNotifications && (
                    <TouchableOpacity onPress={handleNotificationsPress} style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={24} color="#333" />
                        {unreadNotifications > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{unreadNotifications > 99 ? '99+' : unreadNotifications}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}

                {showMessages && (
                    <TouchableOpacity onPress={handleMessagesPress} style={styles.iconButton}>
                        <Ionicons name="chatbubble-outline" size={24} color="#333" />
                        {unreadMessages > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{unreadMessages > 99 ? '99+' : unreadMessages}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}

                {showSettings && (
                    <TouchableOpacity onPress={handleSettingsPress} style={styles.iconButton}>
                        <Ionicons name="settings-outline" size={24} color="#333" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    leftSection: {
        width: 40,
        alignItems: 'flex-start',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 120,
        justifyContent: 'flex-end',
        gap: 8,
    },
    iconButton: {
        position: 'relative',
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
});
