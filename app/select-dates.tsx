import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import StandardHeader from '../components/StandardHeader';

interface DateGuestSelectionProps {
    destination?: string;
    propertyId?: string;
}

interface GuestCount {
    adults: number;
    children: number;
    infants: number;
}

interface DateRange {
    checkIn: Date | null;
    checkOut: Date | null;
}

export default function SelectDatesScreen({ destination, propertyId }: DateGuestSelectionProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedDates, setSelectedDates] = useState<DateRange>({
        checkIn: null,
        checkOut: null,
    });
    const [guests, setGuests] = useState<GuestCount>({
        adults: 2,
        children: 0,
        infants: 0,
    });
    const [rooms, setRooms] = useState(1);

    // Calendar state
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showCheckInSelection, setShowCheckInSelection] = useState(true);

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = date.getMonth() === month;
            const isPast = date < today && !isSameDay(date, today);
            const isSelectedCheckIn = selectedDates.checkIn && isSameDay(date, selectedDates.checkIn);
            const isSelectedCheckOut = selectedDates.checkOut && isSameDay(date, selectedDates.checkOut);
            const isInRange = selectedDates.checkIn && selectedDates.checkOut && 
                            date > selectedDates.checkIn && date < selectedDates.checkOut;

            days.push({
                date,
                isCurrentMonth,
                isPast,
                isSelectedCheckIn,
                isSelectedCheckOut,
                isInRange,
            });
        }

        return days;
    };

    const isSameDay = (date1: Date, date2: Date) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    };

    const handleDateSelect = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (date < today) {
            Alert.alert('Invalid Date', 'Cannot select past dates');
            return;
        }

        if (showCheckInSelection) {
            setSelectedDates({ checkIn: date, checkOut: null });
            setShowCheckInSelection(false);
        } else {
            if (date <= selectedDates.checkIn!) {
                Alert.alert('Invalid Date', 'Check-out date must be after check-in date');
                return;
            }
            setSelectedDates({ ...selectedDates, checkOut: date });
        }
    };

    const handleGuestChange = (type: keyof GuestCount, increment: number) => {
        setGuests(prev => {
            const newValue = prev[type] + increment;
            if (type === 'adults' && newValue < 1) return prev;
            if (newValue < 0) return prev;
            if (newValue > 10) return prev;
            return { ...prev, [type]: newValue };
        });
    };

    const handleRoomChange = (increment: number) => {
        setRooms(prev => {
            const newValue = prev + increment;
            if (newValue < 1) return prev;
            if (newValue > 5) return prev;
            return newValue;
        });
    };

    const calculateNights = () => {
        if (!selectedDates.checkIn || !selectedDates.checkOut) return 0;
        const diffTime = Math.abs(selectedDates.checkOut.getTime() - selectedDates.checkIn.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const calculateEstimatedPrice = () => {
        const nights = calculateNights();
        const totalGuests = guests.adults + guests.children + guests.infants;
        const basePricePerNight = 120;
        const guestSurcharge = totalGuests > 2 ? (totalGuests - 2) * 25 : 0;
        const roomSurcharge = rooms > 1 ? (rooms - 1) * 50 : 0;
        
        return (nights * (basePricePerNight + guestSurcharge + roomSurcharge)).toFixed(2);
    };

    const handleSearch = () => {
        if (!selectedDates.checkIn || !selectedDates.checkOut) {
            Alert.alert('Missing Dates', 'Please select both check-in and check-out dates');
            return;
        }

        // Convert complex objects to JSON strings for URL parameters
        const searchData = {
            destination,
            propertyId,
            checkIn: selectedDates.checkIn.toISOString(),
            checkOut: selectedDates.checkOut.toISOString(),
            guests: JSON.stringify(guests),
            rooms: rooms.toString(),
        };

        if (propertyId) {
            // Navigate to property details since booking-review doesn't exist
            router.push({
                pathname: '/property-details',
                params: { id: propertyId }
            } as any);
        } else {
            // Navigate to accommodation list
            router.push({
                pathname: '/accommodation-booking',
                params: searchData
            } as any);
        }
    };

    const formatMonth = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const formatDate = (date: Date | null) => {
        if (!date) return 'Select date';
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const calendarDays = generateCalendarDays();
    const totalGuests = guests.adults + guests.children + guests.infants;
    const canSearch = selectedDates.checkIn && selectedDates.checkOut;

    return (
        <SafeAreaView style={styles.container}>
            <StandardHeader title="Select Dates & Guests" />
            
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Destination Info */}
                {destination && (
                    <View style={styles.destinationCard}>
                        <Ionicons name="location" size={20} color="#007AFF" />
                        <Text style={styles.destinationText}>{destination}</Text>
                    </View>
                )}

                {/* Date Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Dates</Text>
                    
                    <View style={styles.dateSelectionCard}>
                        <TouchableOpacity 
                            style={[
                                styles.dateButton,
                                selectedDates.checkIn && styles.dateButtonSelected
                            ]}
                            onPress={() => setShowCheckInSelection(true)}
                        >
                            <Text style={styles.dateLabel}>Check-in</Text>
                            <Text style={styles.dateValue}>{formatDate(selectedDates.checkIn)}</Text>
                        </TouchableOpacity>
                        
                        <View style={styles.dateArrow}>
                            <Ionicons name="arrow-forward" size={20} color="#666" />
                        </View>
                        
                        <TouchableOpacity 
                            style={[
                                styles.dateButton,
                                selectedDates.checkOut && styles.dateButtonSelected
                            ]}
                            onPress={() => setShowCheckInSelection(false)}
                        >
                            <Text style={styles.dateLabel}>Check-out</Text>
                            <Text style={styles.dateValue}>{formatDate(selectedDates.checkOut)}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Calendar */}
                    <View style={styles.calendar}>
                        <View style={styles.calendarHeader}>
                            <TouchableOpacity onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                                <Ionicons name="chevron-back" size={24} color="#666" />
                            </TouchableOpacity>
                            <Text style={styles.calendarTitle}>{formatMonth(currentMonth)}</Text>
                            <TouchableOpacity onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                                <Ionicons name="chevron-forward" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.weekDays}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <Text key={day} style={styles.weekDay}>{day}</Text>
                            ))}
                        </View>

                        <View style={styles.daysGrid}>
                            {calendarDays.map((day, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.dayCell,
                                        !day.isCurrentMonth && styles.dayOtherMonth,
                                        day.isPast && styles.dayPast,
                                        day.isSelectedCheckIn && styles.daySelectedCheckIn,
                                        day.isSelectedCheckOut && styles.daySelectedCheckOut,
                                        day.isInRange && styles.dayInRange,
                                    ]}
                                    onPress={() => handleDateSelect(day.date)}
                                    disabled={day.isPast || !day.isCurrentMonth}
                                >
                                    <Text style={[
                                        styles.dayText,
                                        !day.isCurrentMonth && styles.dayOtherMonthText,
                                        day.isPast && styles.dayPastText,
                                        (day.isSelectedCheckIn || day.isSelectedCheckOut) && styles.daySelectedText,
                                    ]}>
                                        {day.date.getDate()}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Guest Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Guests & Rooms</Text>
                    
                    <View style={styles.guestCard}>
                        <View style={styles.guestRow}>
                            <View style={styles.guestInfo}>
                                <Text style={styles.guestLabel}>Adults</Text>
                                <Text style={styles.guestDescription}>Age 13+</Text>
                            </View>
                            <View style={styles.counter}>
                                <TouchableOpacity 
                                    style={styles.counterButton}
                                    onPress={() => handleGuestChange('adults', -1)}
                                >
                                    <Ionicons name="remove" size={20} color="#666" />
                                </TouchableOpacity>
                                <Text style={styles.counterValue}>{guests.adults}</Text>
                                <TouchableOpacity 
                                    style={styles.counterButton}
                                    onPress={() => handleGuestChange('adults', 1)}
                                >
                                    <Ionicons name="add" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.guestRow}>
                            <View style={styles.guestInfo}>
                                <Text style={styles.guestLabel}>Children</Text>
                                <Text style={styles.guestDescription}>Age 2-12</Text>
                            </View>
                            <View style={styles.counter}>
                                <TouchableOpacity 
                                    style={styles.counterButton}
                                    onPress={() => handleGuestChange('children', -1)}
                                >
                                    <Ionicons name="remove" size={20} color="#666" />
                                </TouchableOpacity>
                                <Text style={styles.counterValue}>{guests.children}</Text>
                                <TouchableOpacity 
                                    style={styles.counterButton}
                                    onPress={() => handleGuestChange('children', 1)}
                                >
                                    <Ionicons name="add" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.guestRow}>
                            <View style={styles.guestInfo}>
                                <Text style={styles.guestLabel}>Infants</Text>
                                <Text style={styles.guestDescription}>Under 2</Text>
                            </View>
                            <View style={styles.counter}>
                                <TouchableOpacity 
                                    style={styles.counterButton}
                                    onPress={() => handleGuestChange('infants', -1)}
                                >
                                    <Ionicons name="remove" size={20} color="#666" />
                                </TouchableOpacity>
                                <Text style={styles.counterValue}>{guests.infants}</Text>
                                <TouchableOpacity 
                                    style={styles.counterButton}
                                    onPress={() => handleGuestChange('infants', 1)}
                                >
                                    <Ionicons name="add" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.guestRow}>
                            <View style={styles.guestInfo}>
                                <Text style={styles.guestLabel}>Rooms</Text>
                                <Text style={styles.guestDescription}>Number of rooms</Text>
                            </View>
                            <View style={styles.counter}>
                                <TouchableOpacity 
                                    style={styles.counterButton}
                                    onPress={() => handleRoomChange(-1)}
                                >
                                    <Ionicons name="remove" size={20} color="#666" />
                                </TouchableOpacity>
                                <Text style={styles.counterValue}>{rooms}</Text>
                                <TouchableOpacity 
                                    style={styles.counterButton}
                                    onPress={() => handleRoomChange(1)}
                                >
                                    <Ionicons name="add" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Price Estimate */}
                {selectedDates.checkIn && selectedDates.checkOut && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Price Estimate</Text>
                        <View style={styles.priceCard}>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>${120} x {calculateNights()} nights</Text>
                                <Text style={styles.priceValue}>${(120 * calculateNights()).toFixed(2)}</Text>
                            </View>
                            {totalGuests > 2 && (
                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>Extra guest fee</Text>
                                    <Text style={styles.priceValue}>${((totalGuests - 2) * 25 * calculateNights()).toFixed(2)}</Text>
                                </View>
                            )}
                            {rooms > 1 && (
                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>Extra room fee</Text>
                                    <Text style={styles.priceValue}>${((rooms - 1) * 50 * calculateNights()).toFixed(2)}</Text>
                                </View>
                            )}
                            <View style={[styles.divider, { marginVertical: 12 }]} />
                            <View style={styles.priceRow}>
                                <Text style={styles.totalLabel}>Total (estimated)</Text>
                                <Text style={styles.totalValue}>${calculateEstimatedPrice()}</Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Search Button */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.searchButton, !canSearch && styles.searchButtonDisabled]}
                    onPress={handleSearch}
                    disabled={!canSearch || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.searchButtonText}>
                                Search Accommodations
                            </Text>
                            <Ionicons name="search" size={20} color="#fff" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    destinationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    destinationText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginLeft: 8,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    dateSelectionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    dateButton: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    dateButtonSelected: {
        borderColor: '#007AFF',
        backgroundColor: '#f0f8ff',
    },
    dateLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    dateArrow: {
        paddingHorizontal: 16,
    },
    calendar: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
    },
    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    calendarTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    weekDays: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    weekDay: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '500',
        color: '#666',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    dayOtherMonth: {
        opacity: 0.3,
    },
    dayPast: {
        opacity: 0.5,
    },
    daySelectedCheckIn: {
        backgroundColor: '#007AFF',
    },
    daySelectedCheckOut: {
        backgroundColor: '#007AFF',
    },
    dayInRange: {
        backgroundColor: '#e6f3ff',
    },
    dayText: {
        fontSize: 14,
        color: '#333',
    },
    dayOtherMonthText: {
        color: '#999',
    },
    dayPastText: {
        color: '#ccc',
    },
    daySelectedText: {
        color: '#fff',
        fontWeight: '600',
    },
    guestCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 4,
    },
    guestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    guestInfo: {
        flex: 1,
    },
    guestLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    guestDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    counterButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginHorizontal: 16,
        minWidth: 24,
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 16,
    },
    priceCard: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    priceLabel: {
        fontSize: 14,
        color: '#666',
    },
    priceValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#007AFF',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    searchButtonDisabled: {
        backgroundColor: '#ccc',
    },
    searchButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
