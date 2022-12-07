import React, { useCallback, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    ToastAndroid,
    View
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors, { BLUE_DARK } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { ErrorPlaceholder } from '../common/ErrorPlaceholder';
import { ReminderRow } from './ReminderRow';
import { ReminderType } from '../../../types';
import { useFocusEffect } from '@react-navigation/native';
import { getVisitReminders } from '../../services/callingService';
import moment from 'moment';

export const PendingList = ({
    ListType,
    type
}: {
    ListType: string;
    type: string;
}) => {
    const [ptpListItem, setPtpListItem] = useState<Array<ReminderType>>([]);
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(true);
    const { authData } = useAuth();

    const fetchListData = async () => {
        setLoading(true);
        setPtpListItem([]);
        try {
            const apiResponse = await getVisitReminders(
                '',
                moment().subtract(1, 'day').format('YYYY-M-DD'),
                authData
            );
            if (apiResponse?.data) {
                setPtpListItem(apiResponse?.data?.output?.reminders ?? []);
            }
        } catch (e) {
            ToastAndroid.show('Error fetching visits', ToastAndroid.SHORT);
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchListData();
        }, [update, ListType])
    );

    return (
        <>
            <View style={{ flex: 1 }}>
                <FlatList
                    ListEmptyComponent={
                        !loading ? (
                            <View style={{ marginVertical: '50%' }}>
                                <ErrorPlaceholder
                                    type="empty"
                                    message="No Pending PTPs Found"
                                />
                            </View>
                        ) : null
                    }
                    keyExtractor={(reminder) => String(reminder.loan_id)}
                    refreshControl={
                        <RefreshControl
                            colors={[BLUE_DARK]}
                            enabled
                            refreshing={loading}
                            onRefresh={() => {
                                setUpdate(!update);
                            }}
                        />
                    }
                    contentContainerStyle={{
                        marginVertical: RFPercentage(0.9)
                    }}
                    data={ptpListItem}
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
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: RFPercentage(1.7),
        marginTop: RFPercentage(3)
    },
    pendingRow: {
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: Colors.light.background,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: RFPercentage(0.2),
        paddingHorizontal: RFPercentage(2.5),
        paddingVertical: RFPercentage(1.2)
    }
});
