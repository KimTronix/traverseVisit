import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    actionButton?: string;
    onActionPress?: () => void;
    fullScreen?: boolean;
}

export function EmptyState({ 
    icon, 
    title, 
    description, 
    actionButton, 
    onActionPress,
    fullScreen = false 
}: EmptyStateProps) {
    const content = (
        <View style={[styles.emptyState, fullScreen && styles.fullScreen]}>
            <View style={styles.emptyStateIcon}>
                <Ionicons name={icon as any} size={64} color="#ccc" />
            </View>
            <Text style={styles.emptyStateTitle}>{title}</Text>
            <Text style={styles.emptyStateDescription}>{description}</Text>
            {actionButton && onActionPress && (
                <TouchableOpacity style={styles.emptyStateButton} onPress={onActionPress}>
                    <Text style={styles.emptyStateButtonText}>{actionButton}</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return content;
}

interface ErrorStateProps {
    icon?: string;
    title?: string;
    description?: string;
    actionButton?: string;
    onActionPress?: () => void;
    fullScreen?: boolean;
}

export function ErrorState({ 
    icon = 'cloud-offline-outline',
    title = 'Something went wrong',
    description = 'Please check your connection and try again',
    actionButton = 'Retry',
    onActionPress,
    fullScreen = false 
}: ErrorStateProps) {
    const content = (
        <View style={[styles.errorState, fullScreen && styles.fullScreen]}>
            <View style={styles.errorStateIcon}>
                <Ionicons name={icon as any} size={64} color="#FF3B30" />
            </View>
            <Text style={styles.errorStateTitle}>{title}</Text>
            <Text style={styles.errorStateDescription}>{description}</Text>
            {actionButton && onActionPress && (
                <TouchableOpacity style={styles.errorStateButton} onPress={onActionPress}>
                    <Text style={styles.errorStateButtonText}>{actionButton}</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return content;
}

interface SuccessStateProps {
    icon?: string;
    title?: string;
    description?: string;
    actionButton?: string;
    onActionPress?: () => void;
    fullScreen?: boolean;
}

export function SuccessState({ 
    icon = 'checkmark-circle-outline',
    title = 'Success!',
    description = 'Operation completed successfully',
    actionButton,
    onActionPress,
    fullScreen = false 
}: SuccessStateProps) {
    const content = (
        <View style={[styles.successState, fullScreen && styles.fullScreen]}>
            <View style={styles.successStateIcon}>
                <Ionicons name={icon as any} size={64} color="#00C851" />
            </View>
            <Text style={styles.successStateTitle}>{title}</Text>
            <Text style={styles.successStateDescription}>{description}</Text>
            {actionButton && onActionPress && (
                <TouchableOpacity style={styles.successStateButton} onPress={onActionPress}>
                    <Text style={styles.successStateButtonText}>{actionButton}</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return content;
}

interface NetworkErrorProps {
    onRetry?: () => void;
}

export function NetworkError({ onRetry }: NetworkErrorProps) {
    return (
        <ErrorState
            icon="wifi-outline"
            title="No Internet Connection"
            description="Please check your internet connection and try again"
            actionButton="Retry"
            onActionPress={onRetry}
            fullScreen={true}
        />
    );
}

interface ServerErrorProps {
    onRetry?: () => void;
}

export function ServerError({ onRetry }: ServerErrorProps) {
    return (
        <ErrorState
            icon="server-outline"
            title="Server Error"
            description="We're having trouble connecting to our servers. Please try again later."
            actionButton="Retry"
            onActionPress={onRetry}
            fullScreen={true}
        />
    );
}

interface NoDataProps {
    title?: string;
    description?: string;
    actionButton?: string;
    onActionPress?: () => void;
}

export function NoData({ 
    title = 'No data available',
    description = 'There\'s nothing to show here right now',
    actionButton,
    onActionPress 
}: NoDataProps) {
    return (
        <EmptyState
            icon="documents-outline"
            title={title}
            description={description}
            actionButton={actionButton}
            onActionPress={onActionPress}
            fullScreen={true}
        />
    );
}

// Toast notification utilities
export interface ToastConfig {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

// Global toast state (in a real app, this would be managed with context)
let toastQueue: ToastConfig[] = [];

export const showToast = (config: ToastConfig) => {
    toastQueue.push({
        ...config,
        type: config.type || 'info',
        duration: config.duration || 3000,
    });
    
    // In a real app, this would trigger a toast notification
    console.log('Toast:', config.message);
};

export const showSuccessToast = (message: string) => {
    showToast({ message, type: 'success' });
};

export const showErrorToast = (message: string) => {
    showToast({ message, type: 'error' });
};

export const showWarningToast = (message: string) => {
    showToast({ message, type: 'warning' });
};

export const showInfoToast = (message: string) => {
    showToast({ message, type: 'info' });
};

// Common empty states
export const NoBookingsEmpty = ({ onExplore }: { onExplore?: () => void }) => (
    <EmptyState
        icon="calendar-outline"
        title="No bookings yet"
        description="Start exploring destinations and book your first trip"
        actionButton="Explore Now"
        onActionPress={onExplore}
    />
);

export const NoMessagesEmpty = ({ onNewMessage }: { onNewMessage?: () => void }) => (
    <EmptyState
        icon="chatbubble-ellipses-outline"
        title="No messages yet"
        description="Start a conversation with hosts or other travelers"
        actionButton="Start Conversation"
        onActionPress={onNewMessage}
    />
);

export const NoNotificationsEmpty = () => (
    <EmptyState
        icon="notifications-off-outline"
        title="No notifications"
        description="We'll notify you about bookings, social activity, and updates here"
    />
);

export const NoSearchResults = ({ onClearSearch }: { onClearSearch?: () => void }) => (
    <EmptyState
        icon="search-outline"
        title="No results found"
        description="Try adjusting your search terms or filters"
        actionButton="Clear Search"
        onActionPress={onClearSearch}
    />
);

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
    
    // Empty state styles
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyStateIcon: {
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptyStateDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    emptyStateButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyStateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    // Error state styles
    errorState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    errorStateIcon: {
        marginBottom: 16,
    },
    errorStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    errorStateDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    errorStateButton: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    errorStateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    // Success state styles
    successState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    successStateIcon: {
        marginBottom: 16,
    },
    successStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    successStateDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    successStateButton: {
        backgroundColor: '#00C851',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    successStateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
