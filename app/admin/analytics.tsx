import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

// Mock Chart Component (since we don't have a chart library installed)
const MockChart = ({ type, height = 200 }: { type: string; height?: number }) => (
    <View style={[styles.chartContainer, { height }]}>
        <View style={styles.chartPlaceholder}>
            <Ionicons
                name={type === 'line' ? 'pulse-outline' : type === 'bar' ? 'bar-chart-outline' : 'pie-chart-outline'}
                size={48}
                color="#ccc"
            />
            <Text style={styles.chartText}>{type === 'line' ? 'User Growth Trend' : type === 'bar' ? 'Revenue by Month' : 'Booking Distribution'}</Text>
        </View>
        {/* Simulated data points */}
        <View style={styles.chartOverlay}>
            {type === 'bar' && [40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                <View key={i} style={[styles.bar, { height: `${h}%` }]} />
            ))}
            {type === 'line' && (
                <View style={styles.linePath} />
            )}
        </View>
    </View>
);

export default function AnalyticsScreen() {
    const router = useRouter();
    const [timeRange, setTimeRange] = useState('30d');

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Platform Analytics</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Time Filter */}
                <View style={styles.filterContainer}>
                    {['7d', '30d', '90d', 'All'].map((range) => (
                        <TouchableOpacity
                            key={range}
                            style={[styles.filterTab, timeRange === range && styles.activeFilterTab]}
                            onPress={() => setTimeRange(range)}
                        >
                            <Text style={[styles.filterText, timeRange === range && styles.activeFilterText]}>
                                {range === 'All' ? 'All Time' : `Last ${range.toUpperCase()}`}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Key Metrics */}
                <View style={styles.metricsGrid}>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Total Revenue</Text>
                        <Text style={styles.metricValue}>$124.5k</Text>
                        <View style={styles.metricChange}>
                            <Ionicons name="arrow-up" size={12} color="#4CAF50" />
                            <Text style={styles.changeTextPositive}>12.5%</Text>
                        </View>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Active Users</Text>
                        <Text style={styles.metricValue}>8,240</Text>
                        <View style={styles.metricChange}>
                            <Ionicons name="arrow-up" size={12} color="#4CAF50" />
                            <Text style={styles.changeTextPositive}>5.2%</Text>
                        </View>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Bookings</Text>
                        <Text style={styles.metricValue}>1,432</Text>
                        <View style={styles.metricChange}>
                            <Ionicons name="arrow-down" size={12} color="#FF5252" />
                            <Text style={styles.changeTextNegative}>2.1%</Text>
                        </View>
                    </View>
                </View>

                {/* Charts */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>User Growth</Text>
                    <MockChart type="line" />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Revenue Overview</Text>
                    <MockChart type="bar" />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Booking Types</Text>
                    <MockChart type="pie" height={250} />
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>
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
    scrollView: {
        flex: 1,
        padding: 20,
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 4,
        borderRadius: 12,
        marginBottom: 24,
    },
    filterTab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeFilterTab: {
        backgroundColor: '#333',
    },
    filterText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
    activeFilterText: {
        color: '#fff',
    },
    metricsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    metricLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    metricChange: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    changeTextPositive: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4CAF50',
    },
    changeTextNegative: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FF5252',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    chartContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    chartPlaceholder: {
        alignItems: 'center',
        gap: 8,
        zIndex: 1,
    },
    chartText: {
        color: '#999',
        fontSize: 14,
    },
    chartOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingBottom: 20,
        opacity: 0.2,
    },
    bar: {
        width: 20,
        backgroundColor: '#4ECDC4',
        borderRadius: 4,
    },
    linePath: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        height: 100,
        borderTopWidth: 2,
        borderColor: '#4ECDC4',
        transform: [{ rotate: '-5deg' }],
    },
    bottomPadding: {
        height: 40,
    },
});
