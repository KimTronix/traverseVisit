import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    height?: number;
}

export default function BottomSheet({
    visible,
    onClose,
    title,
    children,
    height: customHeight,
}: BottomSheetProps) {
    const slideAnim = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: height,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.bottomSheet,
                                {
                                    transform: [{ translateY: slideAnim }],
                                    maxHeight: customHeight || height * 0.7,
                                },
                            ]}
                        >
                            {/* Handle Bar */}
                            <View style={styles.handleBar} />

                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.title}>{title}</Text>
                                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Content */}
                            <View style={styles.content}>{children}</View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#D0D0D0',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
});
