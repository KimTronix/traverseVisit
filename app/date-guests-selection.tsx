import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface GuestCount {
    adults: number;
    children: number;
    infants: number;
}

export default function DateGuestsSelectionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const destination = params.destination as string;
    
    // Date states
    const [checkInDate, setCheckInDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
    const [showCheckInPicker, setShowCheckInPicker] = useState(false);
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
    
    // Guest states
    const [guests, setGuests] = useState<GuestCount>({
        adults: 2,
        children: 0,
        infants: 0,
    });
    
    // Get today's date for minimum selection
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format date for display
    const formatDate = (date: Date | null): string => {
        if (!date) return 'Select date';
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    // Handle date selection
    const handleCheckInDateSelect = (date: Date) => {
        setCheckInDate(date);
        setShowCheckInPicker(false);
        
        // Auto-set checkout to next day if not set or before check-in
        if (!checkOutDate || checkOutDate <= date) {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            setCheckOutDate(nextDay);
        }
    };

    const handleCheckOutDateSelect = (date: Date) => {
        if (checkInDate && date <= checkInDate) {
            Alert.alert('Invalid Date', 'Check-out date must be after check-in date');
            return;
        }
        setCheckOutDate(date);
        setShowCheckOutPicker(false);
    };

    // Handle guest count changes
    const updateGuestCount = (type: keyof GuestCount, increment: boolean) => {
        setGuests(prev => {
            const newValue = increment ? prev[type] + 1 : prev[type] - 1;
            
            // Validation
            if (type === 'adults' && newValue < 1) return prev; // At least 1 adult
            if (type === 'adults' && newValue > 10) return prev; // Max 10 adults
            if (type === 'children' && (newValue < 0 || newValue > 5)) return prev; // 0-5 children
            if (type === 'infants' && (newValue < 0 || newValue > 3)) return prev; // 0-3 infants
            
            return {
                ...prev,
                [type]: newValue,
            };
        });
    };

    // Calculate total guests
    const totalGuests = guests.adults + guests.children + guests.infants;

    // Calculate nights between dates
    const calculateNights = (): number => {
        if (!checkInDate || !checkOutDate) return 0;
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    };

    // Handle search
    const handleSearch = () => {
        if (!checkInDate || !checkOutDate) {
            Alert.alert('Missing Dates', 'Please select both check-in and check-out dates');
            return;
        }

        if (totalGuests === 0) {
            Alert.alert('No Guests', 'Please select at least 1 guest');
            return;
        }

        // Parse existing booking data if coming from property-details
        let bookingData = {
            propertyId: params.propertyId as string || '1',
            propertyName: '',
            propertyImage: '',
            propertyLocation: destination,
            checkIn: checkInDate.toISOString(),
            checkOut: checkOutDate.toISOString(),
            nights: calculateNights(),
            guests: guests,
            pricePerNight: 0,
            totalPrice: 0,
            cleaningFee: 50,
            serviceFee: 75,
            taxes: 35,
        };

        // If we have booking data from property-details, merge it
        if (params.booking) {
            const existingBooking = JSON.parse(params.booking as string);
            bookingData = {
                ...existingBooking,
                checkIn: checkInDate.toISOString(),
                checkOut: checkOutDate.toISOString(),
                nights: calculateNights(),
                guests: guests,
                totalPrice: (existingBooking.pricePerNight * calculateNights()) + 50 + 75 + 35,
            };
        }

        // Navigate to booking review with complete booking data
        router.push({
            pathname: '/booking-review',
            params: {
                booking: JSON.stringify(bookingData),
            },
        });
    };

    // Generate mock dates for picker (in real app, use a proper date picker library)
    const generateMockDates = (startDate: Date, days: number): Date[] => {
        const dates: Date[] = [];
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const checkInDates = generateMockDates(today, 30);
    const checkOutDates = checkInDate ? generateMockDates(checkInDate, 30) : generateMockDates(tomorrow, 30);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Dates & Guests</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Destination Info */}
                <View style={styles.destinationInfo}>
                    <Ionicons name="location" size={20} color="#4ECDC4" />
                    <Text style={styles.destinationText}>{destination || 'Selected Destination'}</Text>
                </View>

                {/* Check-in Date */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Check-in Date</Text>
                    <TouchableOpacity 
                        style={[
                            styles.dateSelector,
                            checkInDate && styles.dateSelectorSelected
                        ]}
                        onPress={() => setShowCheckInPicker(!showCheckInPicker)}
                    >
                        <View style={styles.dateContent}>
                            <View style={[
                                styles.dateIconContainer,
                                checkInDate && styles.dateIconContainerSelected
                            ]}>
                                <Ionicons 
                                    name="calendar-outline" 
                                    size={24} 
                                    color={checkInDate ? "#fff" : "#4ECDC4"} 
                                />
                            </View>
                            <View>
                                <Text style={styles.dateLabel}>Check-in</Text>
                                <Text style={[
                                    styles.dateValue,
                                    checkInDate && styles.dateValueSelected
                                ]}>{formatDate(checkInDate)}</Text>
                            </View>
                        </View>
                        <View style={[
                            styles.chevronContainer,
                            showCheckInPicker && styles.chevronContainerRotated
                        ]}>
                            <Ionicons name="chevron-down" size={20} color="#4ECDC4" />
                        </View>
                    </TouchableOpacity>

                    {showCheckInPicker && (
                        <View style={styles.datePicker}>
                            <Text style={styles.pickerTitle}>Select Check-in Date</Text>
                            <ScrollView style={styles.datesList} showsVerticalScrollIndicator={false}>
                                {checkInDates.map((date, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.dateOption,
                                            checkInDate?.toDateString() === date.toDateString() && styles.selectedDateOption
                                        ]}
                                        onPress={() => handleCheckInDateSelect(date)}
                                    >
                                        <Text style={[
                                            styles.dateOptionText,
                                            checkInDate?.toDateString() === date.toDateString() && styles.selectedDateOptionText
                                        ]}>
                                            {formatDate(date)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                {/* Check-out Date */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Check-out Date</Text>
                    <TouchableOpacity 
                        style={[
                            styles.dateSelector,
                            checkOutDate && styles.dateSelectorSelected,
                            !checkInDate && styles.dateSelectorDisabled
                        ]}
                        onPress={() => {
                            if (!checkInDate) {
                                Alert.alert('Select Check-in First', 'Please select a check-in date first');
                                return;
                            }
                            setShowCheckOutPicker(!showCheckOutPicker);
                        }}
                        disabled={!checkInDate}
                    >
                        <View style={styles.dateContent}>
                            <View style={[
                                styles.dateIconContainer,
                                checkOutDate && styles.dateIconContainerSelected,
                                !checkInDate && styles.dateIconContainerDisabled
                            ]}>
                                <Ionicons 
                                    name="calendar-outline" 
                                    size={24} 
                                    color={checkOutDate ? "#fff" : (!checkInDate ? "#999" : "#4ECDC4")} 
                                />
                            </View>
                            <View>
                                <Text style={styles.dateLabel}>Check-out</Text>
                                <Text style={[
                                    styles.dateValue,
                                    checkOutDate && styles.dateValueSelected,
                                    !checkInDate && styles.dateValueDisabled
                                ]}>{formatDate(checkOutDate)}</Text>
                            </View>
                        </View>
                        <View style={[
                            styles.chevronContainer,
                            showCheckOutPicker && styles.chevronContainerRotated,
                            !checkInDate && styles.chevronContainerDisabled
                        ]}>
                            <Ionicons 
                                name="chevron-down" 
                                size={20} 
                                color={!checkInDate ? "#999" : "#4ECDC4"} 
                            />
                        </View>
                    </TouchableOpacity>

                    {showCheckOutPicker && (
                        <View style={styles.datePicker}>
                            <Text style={styles.pickerTitle}>Select Check-out Date</Text>
                            <ScrollView style={styles.datesList} showsVerticalScrollIndicator={false}>
                                {checkOutDates.map((date, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.dateOption,
                                            checkOutDate?.toDateString() === date.toDateString() && styles.selectedDateOption
                                        ]}
                                        onPress={() => handleCheckOutDateSelect(date)}
                                    >
                                        <Text style={[
                                            styles.dateOptionText,
                                            checkOutDate?.toDateString() === date.toDateString() && styles.selectedDateOptionText
                                        ]}>
                                            {formatDate(date)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                {/* Guests Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Guests</Text>
                    <View style={styles.guestsContainer}>
                        {/* Adults */}
                        <View style={styles.guestRow}>
                            <View style={styles.guestInfo}>
                                <Text style={styles.guestType}>Adults</Text>
                                <Text style={styles.guestDescription}>Age 13+</Text>
                            </View>
                            <View style={styles.guestCounter}>
                                <TouchableOpacity
                                    style={[
                                        styles.counterButton,
                                        guests.adults <= 1 && styles.counterButtonDisabled
                                    ]}
                                    onPress={() => updateGuestCount('adults', false)}
                                    disabled={guests.adults <= 1}
                                >
                                    <Ionicons 
                                        name="remove" 
                                        size={20} 
                                        color={guests.adults <= 1 ? "#999" : "#4ECDC4"} 
                                    />
                                </TouchableOpacity>
                                <Text style={styles.guestCount}>{guests.adults}</Text>
                                <TouchableOpacity
                                    style={[
                                        styles.counterButton,
                                        guests.adults >= 10 && styles.counterButtonDisabled
                                    ]}
                                    onPress={() => updateGuestCount('adults', true)}
                                    disabled={guests.adults >= 10}
                                >
                                    <Ionicons 
                                        name="add" 
                                        size={20} 
                                        color={guests.adults >= 10 ? "#999" : "#4ECDC4"} 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Children */}
                        <View style={styles.guestRow}>
                            <View style={styles.guestInfo}>
                                <Text style={styles.guestType}>Children</Text>
                                <Text style={styles.guestDescription}>Age 2-12</Text>
                            </View>
                            <View style={styles.guestCounter}>
                                <TouchableOpacity
                                    style={[
                                        styles.counterButton,
                                        guests.children <= 0 && styles.counterButtonDisabled
                                    ]}
                                    onPress={() => updateGuestCount('children', false)}
                                    disabled={guests.children <= 0}
                                >
                                    <Ionicons 
                                        name="remove" 
                                        size={20} 
                                        color={guests.children <= 0 ? "#999" : "#4ECDC4"} 
                                    />
                                </TouchableOpacity>
                                <Text style={styles.guestCount}>{guests.children}</Text>
                                <TouchableOpacity
                                    style={[
                                        styles.counterButton,
                                        guests.children >= 5 && styles.counterButtonDisabled
                                    ]}
                                    onPress={() => updateGuestCount('children', true)}
                                    disabled={guests.children >= 5}
                                >
                                    <Ionicons 
                                        name="add" 
                                        size={20} 
                                        color={guests.children >= 5 ? "#999" : "#4ECDC4"} 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Infants */}
                        <View style={styles.guestRow}>
                            <View style={styles.guestInfo}>
                                <Text style={styles.guestType}>Infants</Text>
                                <Text style={styles.guestDescription}>Under 2</Text>
                            </View>
                            <View style={styles.guestCounter}>
                                <TouchableOpacity
                                    style={[
                                        styles.counterButton,
                                        guests.infants <= 0 && styles.counterButtonDisabled
                                    ]}
                                    onPress={() => updateGuestCount('infants', false)}
                                    disabled={guests.infants <= 0}
                                >
                                    <Ionicons 
                                        name="remove" 
                                        size={20} 
                                        color={guests.infants <= 0 ? "#999" : "#4ECDC4"} 
                                    />
                                </TouchableOpacity>
                                <Text style={styles.guestCount}>{guests.infants}</Text>
                                <TouchableOpacity
                                    style={[
                                        styles.counterButton,
                                        guests.infants >= 3 && styles.counterButtonDisabled
                                    ]}
                                    onPress={() => updateGuestCount('infants', true)}
                                    disabled={guests.infants >= 3}
                                >
                                    <Ionicons 
                                        name="add" 
                                        size={20} 
                                        color={guests.infants >= 3 ? "#999" : "#4ECDC4"} 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Summary */}
                {(checkInDate && checkOutDate) && (
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Booking Summary</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Duration:</Text>
                            <Text style={styles.summaryValue}>
                                {Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))} nights
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Guests:</Text>
                            <Text style={styles.summaryValue}>{totalGuests} guests</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Search Button */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[
                        styles.searchButton,
                        (!checkInDate || !checkOutDate) && styles.searchButtonDisabled
                    ]}
                    onPress={handleSearch}
                    disabled={!checkInDate || !checkOutDate}
                >
                    <Ionicons name="search" size={20} color="#fff" />
                    <Text style={styles.searchButtonText}>Search Accommodations</Text>
                </TouchableOpacity>
            </View>
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
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerRight: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    destinationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    destinationText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: '#E8F4F8',
    },
    dateSelectorSelected: {
        backgroundColor: '#F0F9FF',
        borderColor: '#4ECDC4',
        shadowColor: '#4ECDC4',
        shadowOpacity: 0.2,
    },
    dateSelectorDisabled: {
        backgroundColor: '#F8F8F8',
        borderColor: '#E0E0E0',
    },
    dateIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F0F9FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    dateIconContainerSelected: {
        backgroundColor: '#4ECDC4',
    },
    dateIconContainerDisabled: {
        backgroundColor: '#F0F0F0',
    },
    dateContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    dateLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    dateValueSelected: {
        color: '#4ECDC4',
    },
    dateValueDisabled: {
        color: '#999',
    },
    chevronContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chevronContainerRotated: {
        transform: [{ rotate: '180deg' }],
    },
    chevronContainerDisabled: {
        backgroundColor: '#F0F0F0',
    },
    datePicker: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    pickerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    datesList: {
        maxHeight: 200,
    },
    dateOption: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    selectedDateOption: {
        backgroundColor: '#F0F9FF',
        borderLeftWidth: 3,
        borderLeftColor: '#4ECDC4',
    },
    dateOptionText: {
        fontSize: 14,
        color: '#333',
    },
    selectedDateOptionText: {
        fontWeight: '600',
        color: '#4ECDC4',
    },
    guestsContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    guestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    guestInfo: {
        flex: 1,
    },
    guestType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    guestDescription: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    guestCounter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    counterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4ECDC4',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    counterButtonDisabled: {
        backgroundColor: '#F8F8F8',
        borderColor: '#E0E0E0',
        shadowOpacity: 0,
        elevation: 0,
    },
    guestCount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        minWidth: 24,
        textAlign: 'center',
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    footer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4ECDC4',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    searchButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
