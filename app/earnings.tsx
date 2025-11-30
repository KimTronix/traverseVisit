import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock Data
const earningsData = {
    totalEarnings: 12450.00,
    pendingPayout: 450.00,
    nextPayoutDate: 'Oct 15, 2024',
    recentTransactions: [
        { id: 1, type: 'Payout', amount: 1200.00, date: 'Oct 01, 2024', status: 'completed' },
        { id: 2, type: 'Booking', amount: 450.00, date: 'Sep 28, 2024', status: 'pending' },
        { id: 3, type: 'Payout', amount: 980.00, date: 'Sep 15, 2024', status: 'completed' },
        { id: 4, type: 'Booking', amount: 320.00, date: 'Sep 12, 2024', status: 'completed' },
    ]
};

const ChartBar = ({ height, label, active }: { height: number, label: string, active?: boolean }) => (
    <View style={styles.chartBarContainer}>
        <View style={[styles.chartBar, { height: `${height}%` }, active && styles.chartBarActive]} />
        <Text style={[styles.chartLabel, active && styles.chartLabelActive]}>{label}</Text>
    </View>
);

export default function EarningsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Earnings</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="help-circle-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Total Earnings Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Total Earnings</Text>
                    <Text style={styles.balanceAmount}>${earningsData.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>

                    <View style={styles.payoutInfo}>
                        <View style={styles.payoutItem}>
                            <Text style={styles.payoutLabel}>Pending</Text>
                            <Text style={styles.payoutValue}>${earningsData.pendingPayout.toFixed(2)}</Text>
                        </View>
                        <View style={styles.payoutDivider} />
                        <View style={styles.payoutItem}>
                            <Text style={styles.payoutLabel}>Next Payout</Text>
                            <Text style={styles.payoutValue}>{earningsData.nextPayoutDate}</Text>
                        </View>
                    </View>
                </View>

                {/* Chart Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Monthly Overview</Text>
                    <View style={styles.chartContainer}>
                        <ChartBar height={40} label="May" />
                        <ChartBar height={60} label="Jun" />
                        <ChartBar height={45} label="Jul" />
                        <ChartBar height={80} label="Aug" />
                        <ChartBar height={55} label="Sep" />
                        <ChartBar height={70} label="Oct" active />
                    </View>
                </View>

                {/* Recent Transactions */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.transactionsList}>
                        {earningsData.recentTransactions.map((item) => (
                            <View key={item.id} style={styles.transactionItem}>
                                <View style={[
                                    styles.transactionIcon,
                                    item.type === 'Payout' ? styles.iconPayout : styles.iconBooking
                                ]}>
                                    <Ionicons
                                        name={item.type === 'Payout' ? 'wallet-outline' : 'calendar-outline'}
                                        size={20}
                                        color={item.type === 'Payout' ? '#4CAF50' : '#4ECDC4'}
                                    />
                                </View>
                                <View style={styles.transactionInfo}>
                                    <Text style={styles.transactionType}>{item.type}</Text>
                                    <Text style={styles.transactionDate}>{item.date}</Text>
                                </View>
                                <View style={styles.transactionAmountContainer}>
                                    <Text style={[
                                        styles.transactionAmount,
                                        item.type === 'Payout' ? styles.amountPayout : styles.amountBooking
                                    ]}>
                                        {item.type === 'Payout' ? '-' : '+'}${item.amount.toFixed(2)}
                                    </Text>
                                    <Text style={[
                                        styles.transactionStatus,
                                        item.status === 'pending' && styles.statusPending
                                    ]}>
                                        {item.status}
                                    </Text>
                                </View>
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
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    iconButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    balanceCard: {
        backgroundColor: '#0A5F5A',
        margin: 20,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#0A5F5A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    balanceLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 24,
    },
    payoutInfo: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
    },
    payoutItem: {
        flex: 1,
    },
    payoutDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: 16,
    },
    payoutLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 4,
    },
    payoutValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    seeAllText: {
        fontSize: 14,
        color: '#4ECDC4',
        fontWeight: '600',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 150,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    chartBarContainer: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'flex-end',
        width: 30,
    },
    chartBar: {
        width: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 8,
    },
    chartBarActive: {
        backgroundColor: '#4ECDC4',
    },
    chartLabel: {
        fontSize: 12,
        color: '#999',
    },
    chartLabelActive: {
        color: '#333',
        fontWeight: '600',
    },
    transactionsList: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    iconPayout: {
        backgroundColor: '#E8F5E9',
    },
    iconBooking: {
        backgroundColor: '#E0F2F1',
    },
    transactionInfo: {
        flex: 1,
    },
    transactionType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 12,
        color: '#999',
    },
    transactionAmountContainer: {
        alignItems: 'flex-end',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    amountPayout: {
        color: '#333',
    },
    amountBooking: {
        color: '#4CAF50',
    },
    transactionStatus: {
        fontSize: 11,
        color: '#999',
        textTransform: 'capitalize',
    },
    statusPending: {
        color: '#FF9800',
    },
});
