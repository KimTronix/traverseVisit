import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockUsers = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'User',
        status: 'active',
        joinDate: 'Oct 12, 2025',
    },
    {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        role: 'Provider',
        status: 'active',
        joinDate: 'Nov 01, 2025',
    },
    {
        id: '3',
        name: 'Mike Smith',
        email: 'mike.s@example.com',
        role: 'User',
        status: 'suspended',
        joinDate: 'Sep 23, 2025',
    },
    {
        id: '4',
        name: 'Emma Wilson',
        email: 'emma.w@example.com',
        role: 'Provider',
        status: 'active',
        joinDate: 'Nov 15, 2025',
    },
];

export default function UserManagementScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState(mockUsers);

    const handleSuspend = (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        const action = currentStatus === 'active' ? 'Suspend' : 'Activate';

        Alert.alert(
            `${action} User`,
            `Are you sure you want to ${action.toLowerCase()} this user?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: action,
                    style: currentStatus === 'active' ? 'destructive' : 'default',
                    onPress: () => {
                        setUsers(users.map(u =>
                            u.id === userId ? { ...u, status: newStatus } : u
                        ));
                    },
                },
            ]
        );
    };

    const handleDelete = (userId: string) => {
        Alert.alert(
            'Delete User',
            'Are you sure you want to permanently delete this user? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setUsers(users.filter(u => u.id !== userId));
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{item.name[0]}</Text>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    item.status === 'active' ? styles.statusActive : styles.statusSuspended
                ]}>
                    <Text style={[
                        styles.statusText,
                        item.status === 'active' ? styles.textActive : styles.textSuspended
                    ]}>
                        {item.status === 'active' ? 'Active' : 'Suspended'}
                    </Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.metaInfo}>
                    <View style={styles.metaItem}>
                        <Ionicons name="person-outline" size={14} color="#666" />
                        <Text style={styles.metaText}>{item.role}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={14} color="#666" />
                        <Text style={styles.metaText}>Joined {item.joinDate}</Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleSuspend(item.id, item.status)}
                    >
                        <Ionicons
                            name={item.status === 'active' ? "ban-outline" : "checkmark-circle-outline"}
                            size={20}
                            color={item.status === 'active' ? "#FF9800" : "#4CAF50"}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Ionicons name="trash-outline" size={20} color="#FF5252" />
                    </TouchableOpacity>
                </View>
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
                <Text style={styles.headerTitle}>User Management</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* List */}
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
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
    searchContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E0F2F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#009688',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusActive: {
        backgroundColor: '#E8F5E9',
    },
    statusSuspended: {
        backgroundColor: '#FFEBEE',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    textActive: {
        color: '#4CAF50',
    },
    textSuspended: {
        color: '#FF5252',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F5F7FA',
        paddingTop: 12,
    },
    metaInfo: {
        flexDirection: 'row',
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#666',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 8,
        backgroundColor: '#F5F7FA',
        borderRadius: 8,
    },
});
