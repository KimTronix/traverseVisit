import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ApprovalDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // Mock data based on ID
    const application = {
        id,
        businessName: 'Ocean View Villa',
        ownerName: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 123-4567',
        type: 'Individual Host',
        address: '123 Coastal Hwy, Malibu, CA',
        submittedDate: 'Nov 28, 2025',
        documents: [
            { name: 'Business License.pdf', type: 'pdf' },
            { name: 'ID Verification.jpg', type: 'image' },
            { name: 'Property Deed.pdf', type: 'pdf' },
        ],
        status: 'pending',
    };

    const handleApprove = () => {
        Alert.alert(
            'Approve Provider',
            'Are you sure you want to approve this provider? They will be able to list properties immediately.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Approve',
                    onPress: () => {
                        Alert.alert('Success', 'Provider approved successfully');
                        router.back();
                    },
                },
            ]
        );
    };

    const handleReject = () => {
        Alert.alert(
            'Reject Application',
            'Please provide a reason for rejection:',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reject',
                    style: 'destructive',
                    onPress: () => {
                        router.back();
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Application Details</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Status Banner */}
                <View style={styles.statusBanner}>
                    <Ionicons name="time-outline" size={24} color="#FF9800" />
                    <Text style={styles.statusText}>Pending Review</Text>
                </View>

                {/* Business Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Business Information</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Business Name</Text>
                                <Text style={styles.value}>{application.businessName}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Business Type</Text>
                                <Text style={styles.value}>{application.type}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Address</Text>
                                <Text style={styles.value}>{application.address}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Owner Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Owner Details</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{application.ownerName[0]}</Text>
                            </View>
                            <View>
                                <Text style={styles.value}>{application.ownerName}</Text>
                                <Text style={styles.subValue}>Owner</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.contactRow}>
                            <Ionicons name="mail-outline" size={20} color="#666" />
                            <Text style={styles.contactText}>{application.email}</Text>
                        </View>
                        <View style={styles.contactRow}>
                            <Ionicons name="call-outline" size={20} color="#666" />
                            <Text style={styles.contactText}>{application.phone}</Text>
                        </View>
                    </View>
                </View>

                {/* Documents */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Documents</Text>
                    <View style={styles.card}>
                        {application.documents.map((doc, index) => (
                            <TouchableOpacity key={index} style={styles.documentRow}>
                                <View style={styles.docIcon}>
                                    <Ionicons
                                        name={doc.type === 'pdf' ? 'document-text' : 'image'}
                                        size={24}
                                        color="#4ECDC4"
                                    />
                                </View>
                                <Text style={styles.docName}>{doc.name}</Text>
                                <Ionicons name="eye-outline" size={20} color="#666" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>

            {/* Action Bar */}
            <View style={styles.actionBar}>
                <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                    <Ionicons name="close-circle-outline" size={20} color="#FF5252" />
                    <Text style={styles.rejectText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                    <Text style={styles.approveText}>Approve Application</Text>
                </TouchableOpacity>
            </View>
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
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF3E0',
        padding: 12,
        gap: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FF9800',
    },
    section: {
        padding: 20,
        paddingBottom: 0,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelContainer: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    subValue: {
        fontSize: 12,
        color: '#666',
    },
    divider: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginVertical: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#4ECDC420',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#4ECDC4',
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 8,
    },
    contactText: {
        fontSize: 14,
        color: '#666',
    },
    documentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    docIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    docName: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    bottomPadding: {
        height: 100,
    },
    actionBar: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        gap: 12,
    },
    rejectButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: '#FF525210',
        gap: 8,
    },
    rejectText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF5252',
    },
    approveButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: '#4CAF50',
        gap: 8,
    },
    approveText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
