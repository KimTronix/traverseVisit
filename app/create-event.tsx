import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { useAuth } from './context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateEventScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [image, setImage] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [maxAttendees, setMaxAttendees] = useState('');
    const [price, setPrice] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Request permissions
    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please grant photo library access to select images.');
            return false;
        }
        return true;
    };

    // Pick image from gallery
    const pickImageFromGallery = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
        }
    };

    // Remove selected image
    const removeImage = () => {
        setImage(null);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const onTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setTime(selectedTime);
        }
    };

    // Create event
    const handleCreateEvent = async () => {
        if (!user) {
            Alert.alert('Error', 'You must be logged in to create an event');
            return;
        }

        if (!title.trim()) {
            Alert.alert('Error', 'Please add a title for your event');
            return;
        }

        if (!description.trim()) {
            Alert.alert('Error', 'Please add a description');
            return;
        }

        if (!location.trim()) {
            Alert.alert('Error', 'Please add a location');
            return;
        }

        setIsCreating(true);
        try {
            console.log('📅 Creating event...');

            // Combine date and time
            const eventDateTime = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                time.getHours(),
                time.getMinutes()
            );

            // TODO: Create events table in Supabase
            // For now, show a success message
            Alert.alert(
                'Coming Soon',
                'Event creation will be available once the events table is set up in the database.\n\nEvent Details:\n' +
                `Title: ${title}\n` +
                `Location: ${location}\n` +
                `Date: ${eventDateTime.toLocaleDateString()}\n` +
                `Time: ${eventDateTime.toLocaleTimeString()}`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.push('/(tabs)');
                        },
                    },
                ]
            );

            /* 
            // This will be used once events table is created:
            const { data, error } = await supabase
                .from('events')
                .insert({
                    organizer_id: user.id,
                    title: title.trim(),
                    description: description.trim(),
                    location: location.trim(),
                    event_date: eventDateTime.toISOString(),
                    max_attendees: maxAttendees ? parseInt(maxAttendees) : null,
                    price: price.trim() ? parseFloat(price.replace(/[^0-9.]/g, '')) : 0,
                    cover_image_url: image,
                })
                .select()
                .single();

            if (error) {
                console.error('❌ Error creating event:', error);
                throw error;
            }

            console.log('✅ Event created successfully:', data);

            Alert.alert('Success', 'Your event has been created!', [
                {
                    text: 'OK',
                    onPress: () => {
                        router.push('/(tabs)');
                    },
                },
            ]);
            */
        } catch (error: any) {
            console.error('❌ Exception creating event:', error);
            Alert.alert('Error', error.message || 'Failed to create event. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Event</Text>
                <TouchableOpacity onPress={handleCreateEvent} disabled={isCreating}>
                    {isCreating ? (
                        <ActivityIndicator size="small" color="#4ECDC4" />
                    ) : (
                        <Text style={styles.createButton}>Create</Text>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Image Section */}
                    {image ? (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: image }} style={styles.eventImage} />
                            <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
                                <Ionicons name="close-circle" size={32} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <TouchableOpacity style={styles.addPhotoButton} onPress={pickImageFromGallery}>
                                <Ionicons name="image" size={48} color="#4ECDC4" />
                                <Text style={styles.addPhotoText}>Add Cover Image</Text>
                                <Text style={styles.addPhotoSubtext}>Optional</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        {/* Title Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Event Title *</Text>
                            <TextInput
                                style={styles.input}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="e.g., Beach Cleanup & BBQ"
                                placeholderTextColor="#999"
                            />
                        </View>

                        {/* Description Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Description *</Text>
                            <TextInput
                                style={[styles.input, styles.descriptionInput]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Tell people about your event..."
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Location Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Location *</Text>
                            <View style={styles.inputWithIcon}>
                                <Ionicons name="location-outline" size={20} color="#666" />
                                <TextInput
                                    style={styles.inputText}
                                    value={location}
                                    onChangeText={setLocation}
                                    placeholder="Where will this happen?"
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        {/* Date & Time */}
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.label}>Date *</Text>
                                <TouchableOpacity
                                    style={styles.inputWithIcon}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Ionicons name="calendar-outline" size={20} color="#666" />
                                    <Text style={styles.dateText}>
                                        {date.toLocaleDateString()}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.label}>Time *</Text>
                                <TouchableOpacity
                                    style={styles.inputWithIcon}
                                    onPress={() => setShowTimePicker(true)}
                                >
                                    <Ionicons name="time-outline" size={20} color="#666" />
                                    <Text style={styles.dateText}>
                                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                minimumDate={new Date()}
                            />
                        )}

                        {showTimePicker && (
                            <DateTimePicker
                                value={time}
                                mode="time"
                                display="default"
                                onChange={onTimeChange}
                            />
                        )}

                        {/* Max Attendees */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Max Attendees (Optional)</Text>
                            <View style={styles.inputWithIcon}>
                                <Ionicons name="people-outline" size={20} color="#666" />
                                <TextInput
                                    style={styles.inputText}
                                    value={maxAttendees}
                                    onChangeText={setMaxAttendees}
                                    placeholder="e.g., 50"
                                    placeholderTextColor="#999"
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>

                        {/* Price */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Price (Optional)</Text>
                            <View style={styles.inputWithIcon}>
                                <Ionicons name="cash-outline" size={20} color="#666" />
                                <TextInput
                                    style={styles.inputText}
                                    value={price}
                                    onChangeText={setPrice}
                                    placeholder="Free or enter amount (e.g., $10)"
                                    placeholderTextColor="#999"
                                    keyboardType="decimal-pad"
                                />
                            </View>
                        </View>

                        {/* Info Box */}
                        <View style={styles.infoBox}>
                            <Ionicons name="information-circle" size={20} color="#4ECDC4" />
                            <Text style={styles.infoText}>
                                Events are a great way to meet fellow travelers and explore together!
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    createButton: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4ECDC4',
        paddingHorizontal: 8,
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
    },
    eventImage: {
        width: '100%',
        height: '100%',
    },
    removeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
    },
    placeholderContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    addPhotoButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    addPhotoText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    addPhotoSubtext: {
        fontSize: 14,
        color: '#666',
    },
    formSection: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    descriptionInput: {
        height: 100,
        paddingTop: 12,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    inputText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    dateText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        padding: 16,
        borderRadius: 8,
        gap: 12,
        marginTop: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});
