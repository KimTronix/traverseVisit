import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock group data
const groupData = {
    name: 'Summer Eurotrip 2024',
    citationTitle: '[cite: 40]',
    members: [
        { id: 1, name: 'Alex', role: 'Admin', image: 'https://i.pravatar.cc/150?img=12' },
        { id: 2, name: 'Sarah', image: 'https://i.pravatar.cc/150?img=5' },
        { id: 3, name: 'Mike', image: 'https://i.pravatar.cc/150?img=8' },
        { id: 4, name: 'Emma', image: 'https://i.pravatar.cc/150?img=9' },
        { id: 5, name: 'John', image: 'https://i.pravatar.cc/150?img=13' },
    ],
    citationMembers: '[cite: 41]',
    wallet: {
        amount: 3500,
        status: 'Pooled',
        citationWallet: '[cite: 41]',
        withdrawNote: '(disabled for non-admins)',
    },
    itinerary: [
        { id: 1, date: 'June 15', activity: 'Arrive in Paris', icon: 'calendar-outline' },
        { id: 2, date: 'June 16', activity: 'Eiffel Tower Tour', icon: 'calendar-outline' },
        { id: 3, date: 'June 18', activity: 'Train to Amsterdam', icon: 'location-outline' },
    ],
    citationItinerary: '[cite: 41]',
};

export default function GroupPlanningScreen() {
    const router = useRouter();

    const handleProposeExpense = () => {
        console.log('Propose expense');
        // Navigate to expense proposal screen
    };

    const handleBookTravel = () => {
        console.log('Book travel');
        // Navigate to booking screen
        router.push('/accommodation-booking');
    };

    const handleWithdrawFunds = () => {
        console.log('Withdraw funds');
        // Show withdrawal modal
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Group Planning</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="search-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/chat')}>
                        <Ionicons name="chatbubble-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Group Title */}
                <View style={styles.groupTitleSection}>
                    <View style={styles.groupIconContainer}>
                        <Ionicons name="people-circle" size={32} color="#4ECDC4" />
                    </View>
                    <View style={styles.groupTitleInfo}>
                        <Text style={styles.groupName}>{groupData.name}</Text>
                        <Text style={styles.citation}>{groupData.citationTitle}</Text>
                    </View>
                </View>

                {/* Members Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Members</Text>
                        <Text style={styles.citation}>{groupData.citationMembers}</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.membersScroll}>
                        {groupData.members.map((member) => (
                            <View key={member.id} style={styles.memberItem}>
                                <Image source={{ uri: member.image }} style={styles.memberImage} />
                                <Text style={styles.memberName}>{member.name}</Text>
                                {member.role && <Text style={styles.memberRole}>({member.role})</Text>}
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Group Wallet Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Group Wallet</Text>
                        <Text style={styles.citation}>{groupData.wallet.citationWallet}</Text>
                    </View>
                    <View style={styles.walletCard}>
                        <View style={styles.walletInfo}>
                            <Text style={styles.walletAmount}>${groupData.wallet.amount.toLocaleString()}</Text>
                            <Text style={styles.walletStatus}>{groupData.wallet.status}</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.withdrawButton, styles.withdrawButtonDisabled]}
                            onPress={handleWithdrawFunds}
                            disabled
                        >
                            <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
                            <Text style={styles.withdrawNote}>{groupData.wallet.withdrawNote}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Shared Itinerary Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Shared Itinerary</Text>
                    </View>
                    <View style={styles.itineraryList}>
                        {groupData.itinerary.map((item) => (
                            <View key={item.id} style={styles.itineraryItem}>
                                <Ionicons name={item.icon as any} size={20} color="#4ECDC4" />
                                <View style={styles.itineraryInfo}>
                                    <Text style={styles.itineraryDate}>{item.date}:</Text>
                                    <Text style={styles.itineraryActivity}>{item.activity}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                    <Text style={styles.citation}>{groupData.citationItinerary}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsSection}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleProposeExpense}>
                        <Text style={styles.actionButtonText}>Propose Expense</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButtonPrimary} onPress={handleBookTravel}>
                        <Text style={styles.actionButtonPrimaryText}>Book Travel</Text>
                        <Text style={styles.actionButtonNote}>(available to admin)</Text>
                    </TouchableOpacity>
                </View>
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
        flex: 1,
        marginLeft: 12,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    groupTitleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    groupIconContainer: {
        marginRight: 12,
    },
    groupTitleInfo: {
        flex: 1,
    },
    groupName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    citation: {
        fontSize: 10,
        color: '#999',
        marginTop: 2,
    },
    section: {
        backgroundColor: '#FFF',
        padding: 16,
        marginTop: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    membersScroll: {
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    memberItem: {
        alignItems: 'center',
        marginRight: 16,
    },
    memberImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 6,
    },
    memberName: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
    },
    memberRole: {
        fontSize: 10,
        color: '#666',
    },
    walletCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    walletInfo: {
        flex: 1,
    },
    walletAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    walletStatus: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    withdrawButton: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    withdrawButtonDisabled: {
        opacity: 0.6,
    },
    withdrawButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    withdrawNote: {
        fontSize: 9,
        color: '#999',
        marginTop: 2,
    },
    itineraryList: {
        gap: 12,
    },
    itineraryItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    itineraryInfo: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    itineraryDate: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginRight: 6,
    },
    itineraryActivity: {
        fontSize: 14,
        color: '#666',
    },
    actionsSection: {
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        marginTop: 8,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#0A5F5A',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    actionButtonPrimary: {
        flex: 1,
        backgroundColor: '#0A5F5A',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonPrimaryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    actionButtonNote: {
        fontSize: 9,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
});
