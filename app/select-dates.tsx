import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { format, addDays } from 'date-fns';

export default function SelectDatesScreen() {
    const router = useRouter();
    const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
    const [markedDates, setMarkedDates] = useState<any>({});

    // Guest counts
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [pets, setPets] = useState(false);

    const handleDayPress = (day: DateData) => {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            // Start new selection
            setSelectedStartDate(day.dateString);
            setSelectedEndDate(null);
            setMarkedDates({
                [day.dateString]: { startingDay: true, color: '#4ECDC4', textColor: 'white' },
            });
        } else {
            // Complete selection
            const start = new Date(selectedStartDate);
            const end = new Date(day.dateString);

            if (end < start) {
                // If end is before start, make it the new start
                setSelectedStartDate(day.dateString);
                setSelectedEndDate(null);
                setMarkedDates({
                    [day.dateString]: { startingDay: true, color: '#4ECDC4', textColor: 'white' },
                });
            } else {
                setSelectedEndDate(day.dateString);

                // Mark range
                const range: any = {};
                let current = start;
                while (current <= end) {
                    const dateString = format(current, 'yyyy-MM-dd');
                    if (dateString === selectedStartDate) {
                        range[dateString] = { startingDay: true, color: '#4ECDC4', textColor: 'white' };
                    } else if (dateString === day.dateString) {
                        range[dateString] = { endingDay: true, color: '#4ECDC4', textColor: 'white' };
                    } else {
                        range[dateString] = { color: 'rgba(78, 205, 196, 0.2)', textColor: '#333' };
                    }
                    current = addDays(current, 1);
                }
                setMarkedDates(range);
            }
        }
    };

    const updateGuestCount = (type: 'adults' | 'children' | 'infants', increment: boolean) => {
        if (type === 'adults') {
            setAdults(prev => increment ? prev + 1 : Math.max(1, prev - 1));
        } else if (type === 'children') {
            setChildren(prev => increment ? prev + 1 : Math.max(0, prev - 1));
        } else {
            setInfants(prev => increment ? prev + 1 : Math.max(0, prev - 1));
        }
    };

    const handleSearch = () => {
        // Navigate to search results or accommodation list with params
        // For now, just go back or to a dummy results page
        router.push('/(tabs)/explore');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dates & Guests</Text>
                <TouchableOpacity onPress={() => {
                    setSelectedStartDate(null);
                    setSelectedEndDate(null);
                    setMarkedDates({});
                    setAdults(1);
                    setChildren(0);
                    setInfants(0);
                }}>
                    <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Date Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>When's your trip?</Text>
                    <View style={styles.calendarContainer}>
                        <Calendar
                            onDayPress={handleDayPress}
                            markedDates={markedDates}
                            markingType={'period'}
                            theme={{
                                backgroundColor: '#ffffff',
                                calendarBackground: '#ffffff',
                                textSectionTitleColor: '#b6c1cd',
                                selectedDayBackgroundColor: '#4ECDC4',
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: '#4ECDC4',
                                dayTextColor: '#2d4150',
                                textDisabledColor: '#d9e1e8',
                                dotColor: '#00adf5',
                                selectedDotColor: '#ffffff',
                                arrowColor: '#4ECDC4',
                                monthTextColor: '#333',
                                indicatorColor: 'blue',
                                textDayFontWeight: '300',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: '300',
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 14
                            }}
                        />
                    </View>
                </View>

                {/* Guest Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Who's coming?</Text>

                    <View style={styles.guestRow}>
                        <View>
                            <Text style={styles.guestLabel}>Adults</Text>
                            <Text style={styles.guestSubLabel}>Ages 13 or above</Text>
                        </View>
                        <View style={styles.counterContainer}>
                            <TouchableOpacity
                                style={[styles.counterButton, adults <= 1 && styles.counterButtonDisabled]}
                                onPress={() => updateGuestCount('adults', false)}
                                disabled={adults <= 1}
                            >
                                <Ionicons name="remove" size={20} color={adults <= 1 ? "#CCC" : "#333"} />
                            </TouchableOpacity>
                            <Text style={styles.counterValue}>{adults}</Text>
                            <TouchableOpacity
                                style={styles.counterButton}
                                onPress={() => updateGuestCount('adults', true)}
                            >
                                <Ionicons name="add" size={20} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.guestRow}>
                        <View>
                            <Text style={styles.guestLabel}>Children</Text>
                            <Text style={styles.guestSubLabel}>Ages 2-12</Text>
                        </View>
                        <View style={styles.counterContainer}>
                            <TouchableOpacity
                                style={[styles.counterButton, children <= 0 && styles.counterButtonDisabled]}
                                onPress={() => updateGuestCount('children', false)}
                                disabled={children <= 0}
                            >
                                <Ionicons name="remove" size={20} color={children <= 0 ? "#CCC" : "#333"} />
                            </TouchableOpacity>
                            <Text style={styles.counterValue}>{children}</Text>
                            <TouchableOpacity
                                style={styles.counterButton}
                                onPress={() => updateGuestCount('children', true)}
                            >
                                <Ionicons name="add" size={20} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.guestRow}>
                        <View>
                            <Text style={styles.guestLabel}>Infants</Text>
                            <Text style={styles.guestSubLabel}>Under 2</Text>
                        </View>
                        <View style={styles.counterContainer}>
                            <TouchableOpacity
                                style={[styles.counterButton, infants <= 0 && styles.counterButtonDisabled]}
                                onPress={() => updateGuestCount('infants', false)}
                                disabled={infants <= 0}
                            >
                                <Ionicons name="remove" size={20} color={infants <= 0 ? "#CCC" : "#333"} />
                            </TouchableOpacity>
                            <Text style={styles.counterValue}>{infants}</Text>
                            <TouchableOpacity
                                style={styles.counterButton}
                                onPress={() => updateGuestCount('infants', true)}
                            >
                                <Ionicons name="add" size={20} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.guestRow}>
                        <View>
                            <Text style={styles.guestLabel}>Pets</Text>
                            <Text style={styles.guestSubLabel}>Bringing a service animal?</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#4ECDC4" }}
                            thumbColor={pets ? "#f4f3f4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => setPets(!pets)}
                            value={pets}
                        />
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View>
                    <Text style={styles.footerLabel}>
                        {selectedStartDate && selectedEndDate
                            ? `${format(new Date(selectedStartDate), 'MMM dd')} - ${format(new Date(selectedEndDate), 'MMM dd')}`
                            : 'Select dates'}
                    </Text>
                    <Text style={styles.footerSubLabel}>
                        {adults + children} guests
                    </Text>
                </View>
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Ionicons name="search" size={20} color="#FFF" />
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>
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
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    clearText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        textDecorationLine: 'underline',
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 20,
    },
    calendarContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 16,
        overflow: 'hidden',
    },
    guestRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    guestLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    guestSubLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    counterButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterButtonDisabled: {
        borderColor: '#F0F0F0',
        backgroundColor: '#FAFAFA',
    },
    counterValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        width: 20,
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    footerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    footerSubLabel: {
        fontSize: 12,
        color: '#666',
    },
    searchButton: {
        backgroundColor: '#4ECDC4',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#4ECDC4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    searchButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
