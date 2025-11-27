import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock wallet data
const walletData = {
    totalBalance: 2150.00,
    currency: 'USD',
    citationBalance: '[cite: 36]',
    citationActions: '[cite: 37, 85]',
    loyaltyPoints: {
        current: 2500,
        nextTier: 2500,
        pointsToNext: 2500,
        citationRewards: '[cite: 38]',
    },
    transactions: [
        {
            id: 1,
            type: 'deposit',
            title: 'Deposit from Bank',
            date: 'June 15, 2023',
            amount: 500,
            icon: 'cash-outline',
        },
        {
            id: 2,
            type: 'expense',
            title: 'Hotel Booking',
            date: 'June 16, 2023',
            amount: -250,
            icon: 'bed-outline',
        },
        {
            id: 3,
            type: 'expense',
            title: 'Group Wallet Contribution',
            date: 'June 17, 2023',
            amount: -100,
            icon: 'people-outline',
        },
        {
            id: 4,
            type: 'reward',
            title: 'Loyalty Points Earned',
            date: 'June 14, 2023',
            amount: 50,
            icon: 'star-outline',
        },
    ],
    citationTransactions: '[cite: 54]',
};

export default function WalletScreen() {
    const router = useRouter();

    const handleDepositFunds = () => {
        console.log('Deposit funds');
        // Navigate to deposit screen or show modal
    };

    const handleWithdrawFunds = () => {
        console.log('Withdraw funds');
        // Navigate to withdraw screen or show modal
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'deposit':
            case 'reward':
                return '#4CAF50';
            case 'expense':
                return '#F44336';
            default:
                return '#666';
        }
    };

    const formatAmount = (amount: number) => {
        const sign = amount > 0 ? '+' : '';
        return `${sign}$${Math.abs(amount)}`;
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Wallet & Rewards</Text>
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
                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <View style={styles.balanceHeader}>
                        <Text style={styles.balanceLabel}>Total Balance</Text>
                        <Text style={styles.citation}>{walletData.citationBalance}</Text>
                    </View>
                    <Text style={styles.balanceAmount}>
                        ${walletData.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                    <Text style={styles.balanceSubtext}>Multi-currency wallet</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Text style={styles.citationActions}>{walletData.citationActions}</Text>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleDepositFunds}>
                            <Text style={styles.actionButtonText}>Deposit Funds</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={handleWithdrawFunds}>
                            <Text style={styles.actionButtonText}>Withdraw Funds</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Loyalty Rewards Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Loyalty Rewards</Text>
                        <Text style={styles.citation}>{walletData.loyaltyPoints.citationRewards}</Text>
                    </View>

                    <View style={styles.loyaltyCard}>
                        <Text style={styles.loyaltyPointsLabel}>Points Balance: </Text>
                        <Text style={styles.loyaltyPointsValue}>{walletData.loyaltyPoints.current.toLocaleString()}</Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '50%' }]} />
                        </View>
                        <View style={styles.progressLabels}>
                            <Text style={styles.progressLabel}>Next tier: {walletData.loyaltyPoints.nextTier}</Text>
                            <Text style={styles.progressLabel}>Points {walletData.loyaltyPoints.pointsToNext}</Text>
                        </View>
                    </View>

                    <Text style={styles.loyaltyMessage}>Earn points for planning trips!</Text>
                </View>

                {/* Recent Transactions Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Transactions</Text>
                        <Text style={styles.citation}>{walletData.citationTransactions}</Text>
                    </View>

                    <View style={styles.transactionsList}>
                        {walletData.transactions.map((transaction) => (
                            <View key={transaction.id} style={styles.transactionItem}>
                                <View style={styles.transactionIcon}>
                                    <Ionicons name={transaction.icon as any} size={24} color="#4ECDC4" />
                                </View>
                                <View style={styles.transactionInfo}>
                                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                                </View>
                                <Text
                                    style={[
                                        styles.transactionAmount,
                                        { color: getTransactionColor(transaction.type) },
                                    ]}
                                >
                                    {transaction.type === 'reward' ? `(+${transaction.amount})` : formatAmount(transaction.amount)}
                                </Text>
                            </View>
                        ))}
                    </View>
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
    balanceCard: {
        backgroundColor: '#0A5F5A',
        margin: 16,
        marginBottom: 8,
        padding: 24,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    balanceLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    balanceSubtext: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    citation: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    actionsContainer: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    citationActions: {
        fontSize: 10,
        color: '#999',
        textAlign: 'right',
        marginBottom: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#0A5F5A',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    section: {
        backgroundColor: '#FFF',
        marginTop: 8,
        padding: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EFEFEF',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    loyaltyCard: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 12,
    },
    loyaltyPointsLabel: {
        fontSize: 14,
        color: '#666',
    },
    loyaltyPointsValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    progressContainer: {
        marginBottom: 12,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#0A5F5A',
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabel: {
        fontSize: 11,
        color: '#666',
    },
    loyaltyMessage: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    transactionsList: {
        gap: 16,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionInfo: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    transactionDate: {
        fontSize: 12,
        color: '#666',
    },
    transactionAmount: {
        fontSize: 14,
        fontWeight: '600',
    },
});
