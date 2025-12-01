import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EditProfileScreen() {
    const router = useRouter();
    const [name, setName] = useState('Alex Rivera');
    const [username, setUsername] = useState('alexr');
    const [bio, setBio] = useState('✈️ Travel enthusiast | 📸 Photography lover | 🌍 Exploring the world');
    const [location, setLocation] = useState('San Francisco, CA');
    const [website, setWebsite] = useState('alexrivera.com');
    const [email, setEmail] = useState('alex@example.com');
    const [phone, setPhone] = useState('+1 (555) 123-4567');

    const handleSave = () => {
        Alert.alert('Success', 'Profile updated successfully!', [
            { text: 'OK', onPress: () => router.back() },
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Photo */}
                <View style={styles.photoSection}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?img=2' }}
                        style={styles.profilePhoto}
                    />
                    <TouchableOpacity style={styles.changePhotoButton}>
                        <Text style={styles.changePhotoText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter username"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell us about yourself"
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.input}
                            value={location}
                            onChangeText={setLocation}
                            placeholder="City, Country"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Website</Text>
                        <TextInput
                            style={styles.input}
                            value={website}
                            onChangeText={setWebsite}
                            placeholder="yourwebsite.com"
                            autoCapitalize="none"
                            keyboardType="url"
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.verifiedInput}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="email@example.com"
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                            <View style={styles.verifiedBadge}>
                                <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
                                <Text style={styles.verifiedText}>Verified</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone</Text>
                        <View style={styles.verifiedInput}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="+1 (555) 123-4567"
                                keyboardType="phone-pad"
                            />
                            <TouchableOpacity>
                                <Text style={styles.verifyText}>Verify</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Privacy Settings */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Privacy</Text>

                        <TouchableOpacity style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                                <Text style={styles.settingLabel}>Private Account</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#CCC" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="eye-off-outline" size={20} color="#666" />
                                <Text style={styles.settingLabel}>Blocked Users</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#CCC" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    cancelButton: {
        padding: 4,
    },
    cancelText: {
        fontSize: 16,
        color: '#666',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    saveButton: {
        padding: 4,
    },
    saveText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    content: {
        flex: 1,
    },
    photoSection: {
        alignItems: 'center',
        paddingVertical: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    changePhotoButton: {
        paddingVertical: 8,
    },
    changePhotoText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    formSection: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    verifiedInput: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    verifiedText: {
        fontSize: 13,
        color: '#4ECDC4',
        fontWeight: '500',
    },
    verifyText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 20,
    },
    section: {
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingLabel: {
        fontSize: 16,
        color: '#333',
    },
});
