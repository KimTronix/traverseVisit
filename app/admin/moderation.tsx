import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockReports = [
    {
        id: '1',
        type: 'post',
        reporter: 'john_doe',
        reportedUser: 'spam_bot_99',
        reason: 'Spam',
        content: 'Check out this amazing crypto opportunity! 🚀💰',
        image: 'https://picsum.photos/400/300?random=10',
        date: '10 mins ago',
    },
    {
        id: '2',
        type: 'comment',
        reporter: 'sarah_j',
        reportedUser: 'angry_user',
        reason: 'Harassment',
        content: 'This place is terrible and you are stupid for liking it.',
        date: '1 hour ago',
    },
    {
        id: '3',
        type: 'post',
        reporter: 'mike_s',
        reportedUser: 'fake_account',
        reason: 'Inappropriate Content',
        content: 'Not safe for work content here...',
        image: 'https://picsum.photos/400/300?random=11',
        date: '3 hours ago',
    },
];

export default function ModerationScreen() {
    const router = useRouter();
    const [reports, setReports] = useState(mockReports);

    const handleKeep = (id: string) => {
        Alert.alert('Dismiss Report', 'Keep this content active?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Keep',
                onPress: () => {
                    setReports(reports.filter((r) => r.id !== id));
                },
            },
        ]);
    };

    const handleRemove = (id: string) => {
        Alert.alert('Remove Content', 'Are you sure you want to remove this content? This action is irreversible.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: () => {
                    setReports(reports.filter((r) => r.id !== id));
                },
            },
        ]);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.reportInfo}>
                    <View style={styles.reportBadge}>
                        <Ionicons name="flag" size={12} color="#fff" />
                        <Text style={styles.reportBadgeText}>{item.reason}</Text>
                    </View>
                    <Text style={styles.reportDate}>{item.date}</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                </TouchableOpacity>
            </View>

            <View style={styles.contentPreview}>
                <Text style={styles.reporterText}>
                    Reported by <Text style={styles.bold}>@{item.reporter}</Text> against{' '}
                    <Text style={styles.bold}>@{item.reportedUser}</Text>
                </Text>

                <View style={styles.contentBox}>
                    {item.image && (
                        <Image source={{ uri: item.image }} style={styles.contentImage} />
                    )}
                    <Text style={styles.contentText}>{item.content}</Text>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.keepButton} onPress={() => handleKeep(item.id)}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
                    <Text style={styles.keepText}>Keep</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.id)}>
                    <Ionicons name="trash-outline" size={20} color="#FF5252" />
                    <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Content Moderation</Text>
                <View style={styles.placeholder} />
            </View>

            {/* List */}
            <FlatList
                data={reports}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-done-circle-outline" size={64} color="#4CAF50" />
                        <Text style={styles.emptyText}>All caught up!</Text>
                        <Text style={styles.emptySubtext}>No pending reports to review.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    placeholder: {
        width: 32,
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    reportInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    reportBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF5252',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    reportBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    reportDate: {
        fontSize: 12,
        color: '#999',
    },
    contentPreview: {
        marginBottom: 16,
    },
    reporterText: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    bold: {
        fontWeight: '600',
        color: '#333',
    },
    contentBox: {
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    contentImage: {
        width: '100%',
        height: 150,
    },
    contentText: {
        padding: 12,
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    keepButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#E8F5E9',
        gap: 8,
    },
    keepText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4CAF50',
    },
    removeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#FFEBEE',
        gap: 8,
    },
    removeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FF5252',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
    },
});
