import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from './BottomSheet';

interface ReportPostBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
}

const reportReasons = [
    { id: 'spam', label: 'Spam' },
    { id: 'inappropriate', label: 'Inappropriate Content' },
    { id: 'misinformation', label: 'Misinformation' },
    { id: 'harassment', label: 'Harassment or Bullying' },
    { id: 'other', label: 'Other' },
];

export default function ReportPostBottomSheet({
    visible,
    onClose,
    onSubmit,
}: ReportPostBottomSheetProps) {
    const [selectedReason, setSelectedReason] = useState('inappropriate');

    const handleSubmit = () => {
        onSubmit(selectedReason);
        onClose();
    };

    return (
        <BottomSheet visible={visible} onClose={onClose} title="Report this post" height={450}>
            <View style={styles.container}>
                <Text style={styles.question}>Why are you reporting this?</Text>

                {/* Report Reasons */}
                <View style={styles.reasonsList}>
                    {reportReasons.map((reason) => (
                        <TouchableOpacity
                            key={reason.id}
                            style={styles.reasonOption}
                            onPress={() => setSelectedReason(reason.id)}
                        >
                            <View style={styles.reasonLeft}>
                                <Text style={styles.reasonLabel}>{reason.label}</Text>
                            </View>
                            <View
                                style={[
                                    styles.radioButton,
                                    selectedReason === reason.id && styles.radioButtonSelected,
                                ]}
                            >
                                {selectedReason === reason.id && (
                                    <View style={styles.radioButtonInner} />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit Report</Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
    },
    question: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginBottom: 16,
    },
    reasonsList: {
        gap: 12,
        marginBottom: 24,
    },
    reasonOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    reasonLeft: {
        flex: 1,
    },
    reasonLabel: {
        fontSize: 15,
        color: '#333',
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#D0D0D0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: '#0A5F5A',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#0A5F5A',
    },
    submitButton: {
        backgroundColor: '#0A5F5A',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
});
