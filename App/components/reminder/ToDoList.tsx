import React, { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import Typography, { TypographyVariants } from '../ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import moment, { Moment } from 'moment';
import Colors, { BLUE_DARK, GREY } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { ErrorPlaceholder } from '../common/ErrorPlaceholder';
import { useNavigation } from '@react-navigation/native';
import useDidMountEffect from '../../hooks/useDidMountEffect';
import { ReminderRow } from './ReminderRow';
import { ReminderType } from '../../../types';
import { getVisitReminders } from '../../services/callingService';

export const ToDoList = ({
    type,
    ListType,
    currentDate,
    setCurrentDate
}: {
    type: string;
    ListType: string;
    currentDate: string | Moment;
    setCurrentDate: any;
}) => {
    const { authData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [listItems, setListItems] = useState<Array<ReminderType>>([]);

    const [update, setUpdate] = useState(true);
    const navigation = useNavigation();
    let date = moment(currentDate, 'YYYY-M-DD').date();

    const reloadData = () => {
        setLoading(true);
        setUpdate(!update);
    };
    useDidMountEffect(() => {
        if (navigation.isFocused()) {
            reloadData();
        }
    }, [currentDate]);

    const [selectedDate, setSelectedDate] = useState(date);
    const fetchdata = async () => {
        try {
            const apiResponse = await getVisitReminders(
                moment(currentDate, 'YYYY-M-DD').format(
                    `YYYY-MM-${selectedDate}`
                ),
                moment(currentDate, 'YYYY-M-DD').format(
                    `YYYY-MM-${selectedDate}`
                ),
                authData
            );
            if (apiResponse?.data) {
                setListItems(apiResponse?.data?.output?.reminders ?? []);
            }
        } catch (e) {
            ToastAndroid.show('Error fetching visits', ToastAndroid.SHORT);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchdata();
    }, [update, selectedDate, ListType]);

    useEffect(() => {
        setSelectedDate(date);
    }, [date]);

    const [scrollableDates, setScrollableDates] = useState<Array<number>>([]);
    useEffect(() => {
        setScrollableDates([]);
        if (moment(currentDate, 'YYYY-M-DD').month() === moment().month())
            date = moment().date();
        else {
            date = moment(currentDate, 'YYYY-M-DD').date();
        }

        setSelectedDate(date);
        for (
            let i = date;
            i <= moment(currentDate, 'YYYY-M-DD').daysInMonth();
            i++
        ) {
            setScrollableDates((old) => [...old, i]);
        }
    }, [currentDate]);

    const DateItem = ({ date }: { date: number }) => {
        const momentDate = moment()
            .date(date)
            .month(moment(currentDate, 'YYYY-M-DD').month())
            .year(moment(currentDate, 'YYYY-M-DD').year());
        return (
            <>
                <View style={styles.dateItemContainer}>
                    <TouchableOpacity
                        key={date}
                        activeOpacity={0.5}
                        onPress={() => {
                            setSelectedDate(date);
                        }}
                        style={[
                            { margin: RFPercentage(0.5), borderRadius: 8 },
                            date === selectedDate ? styles.boxShadow : null
                        ]}
                    >
                        <View style={styles.dayContainer}>
                            <Typography
                                variant={TypographyVariants.caption1}
                                style={{ color: Colors.light.background }}
                            >
                                {moment(momentDate, 'YYYY-M-DD').format('ddd')}
                            </Typography>
                        </View>
                        <View
                            style={[
                                styles.dateContainer,
                                selectedDate === date
                                    ? {
                                          borderColor: BLUE_DARK,
                                          borderWidth: 0.5,
                                          borderTopWidth: 0
                                      }
                                    : {}
                            ]}
                        >
                            <Typography variant={TypographyVariants.title1}>
                                {date}
                            </Typography>
                        </View>
                    </TouchableOpacity>

                    <Typography
                        style={{ marginTop: RFPercentage(0.4), color: GREY }}
                        variant={TypographyVariants.caption2}
                    >
                        {moment().add(1, 'days').isSame(momentDate, 'days')
                            ? 'Tomorrow'
                            : null ?? moment().isSame(momentDate, 'days')
                            ? 'Today'
                            : null}
                    </Typography>
                </View>
            </>
        );
    };

    return (
        <>
            <View>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                >
                    {scrollableDates.map((date) => (
                        <DateItem key={date} date={date} />
                    ))}
                </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    keyExtractor={(reminder) => String(reminder.loan_id)}
                    contentContainerStyle={{
                        marginVertical: RFPercentage(0.9)
                    }}
                    refreshControl={
                        <RefreshControl
                            colors={[BLUE_DARK]}
                            enabled
                            refreshing={loading}
                            onRefresh={() => {
                                reloadData();
                            }}
                        />
                    }
                    ListEmptyComponent={
                        !loading ? (
                            <View style={{ marginVertical: '50%' }}>
                                <ErrorPlaceholder
                                    type="empty"
                                    message="No PTPs Found"
                                />
                            </View>
                        ) : null
                    }
                    data={listItems}
                    renderItem={(reminder) => {
                        return (
                            <ReminderRow type={type} reminder={reminder.item} />
                        );
                    }}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    boxShadow: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 2
    },
    calendarContainer: {
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        borderRadius: 4,
        flexDirection: 'row',
        paddingHorizontal: RFPercentage(1.5),
        paddingVertical: RFPercentage(0.1)
    },
    dateContainer: {
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        borderBottomEndRadius: 3,
        borderBottomStartRadius: 3,
        borderColor: '#E4E4EB',
        borderWidth: 1,
        padding: RFPercentage(0.6),
        width: RFPercentage(5.8)
    },
    dateItemContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    dayContainer: {
        alignItems: 'center',
        backgroundColor: Colors.light.tabIconSelected,
        borderTopEndRadius: 3,
        borderTopStartRadius: 3,
        height: RFPercentage(2.7),
        justifyContent: 'center',
        width: RFPercentage(5.8)
    },
    headerRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: RFPercentage(1.2),
        marginTop: RFPercentage(2.8)
    },
    toDoRowContainer: {
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: RFPercentage(0.2),
        paddingHorizontal: RFPercentage(2),
        paddingVertical: RFPercentage(1.2)
    }
});
