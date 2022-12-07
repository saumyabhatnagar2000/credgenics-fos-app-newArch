import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
    FilterTaskTypesText,
    HistoryScreenTabType,
    TaskFilterType,
    TaskHistoryFilterType,
    TaskOptions
} from '../../../enums';
import { BLUE_DARK } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { useTaskFilter } from '../../hooks/useTaskFilter';
import { useTaskHistoryFilter } from '../../hooks/useTaskHistoryFilter';
import { getHomepageData } from '../../services/dashboardService';
import { keyConverter } from '../../services/utils';
import { CustomActivityIndicator } from '../placeholders/CustomActivityIndicator';
import Typography, { TypographyVariants } from '../ui/Typography';

enum DashboardKeys {
    planned_surprise_visits = 'Planned Surprise Visits',
    planned_ptp_visits = 'Planned PTP Visits',
    completed_visits = 'Completed Visits',
    pending_deposits = 'Pending Deposits'
}

type DashboardKeysData = {
    [DashboardKeys.planned_surprise_visits]: number;
    [DashboardKeys.planned_ptp_visits]: number;
    [DashboardKeys.completed_visits]: number;
    [DashboardKeys.pending_deposits]: number;
};

export default function TodaysCalenderComponent() {
    const { authData } = useAuth();
    const { navigate } = useNavigation();
    const { setFinalTaskFilterData } = useTaskFilter();
    const { setFinalTaskHistoryFilterData } = useTaskHistoryFilter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [dashboardKeys, setDashboardKeys] = useState<DashboardKeysData>({
        [DashboardKeys.planned_surprise_visits]: 0,
        [DashboardKeys.planned_ptp_visits]: 0,
        [DashboardKeys.completed_visits]: 0,
        [DashboardKeys.pending_deposits]: 0
    });

    const getData = useCallback(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await getHomepageData(authData);
                const keys = response?.data ?? {};
                setDashboardKeys(keys);
            } catch (error: AxiosError | any) {
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useFocusEffect(getData);

    let content = <CustomActivityIndicator />;

    if (error)
        content = (
            <Typography
                style={styles.buttonText}
                variant={TypographyVariants.body1}
            >
                Error
            </Typography>
        );

    const onCardClick = (key: string) => {
        switch (key) {
            case DashboardKeys.planned_surprise_visits:
                setFinalTaskFilterData({
                    [TaskFilterType.visit_purpose]: {
                        [TaskOptions.surprise_visit]: true
                    },
                    [TaskFilterType.scheduled_date]: {
                        [FilterTaskTypesText.today]: true
                    }
                });
                navigate('FieldVisitScreen');
                break;
            case DashboardKeys.planned_ptp_visits:
                setFinalTaskFilterData({
                    [TaskFilterType.visit_purpose]: {
                        [TaskOptions.ptp]: true
                    },
                    [TaskFilterType.scheduled_date]: {
                        [FilterTaskTypesText.today]: true
                    }
                });
                navigate('FieldVisitScreen');
                break;
            case DashboardKeys.completed_visits:
                navigate('HistoryScreen', {
                    initialRoute: HistoryScreenTabType.visits
                });
                setFinalTaskHistoryFilterData({
                    [TaskHistoryFilterType.submitted]: {
                        [FilterTaskTypesText.today]: true
                    }
                });
                break;
            case DashboardKeys.pending_deposits:
                navigate('DepositPendingScreen');
                break;
            default:
                ToastAndroid.show('Error', ToastAndroid.SHORT);
                break;
        }
    };

    if (!loading)
        content = (
            <>
                <View style={styles.headerContainer}>
                    <Typography variant={TypographyVariants.title1}>
                        Today's Calendar
                    </Typography>
                    <Typography
                        style={styles.date}
                        variant={TypographyVariants.body4}
                    >
                        {moment().format('D MMM, YYYY')}
                    </Typography>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {Object.keys(dashboardKeys).map((data) => (
                        <TouchableOpacity
                            key={data}
                            style={styles.itemContainer}
                            onPress={() => onCardClick(data)}
                        >
                            <View style={styles.header}>
                                <Typography variant={TypographyVariants.body}>
                                    {String(dashboardKeys?.[data] ?? 0)}
                                </Typography>
                            </View>
                            <View style={styles.data}>
                                <Typography
                                    style={{ textAlign: 'center' }}
                                    variant={TypographyVariants.caption3}
                                >
                                    {keyConverter(data)}
                                </Typography>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </>
        );

    return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
    buttonText: {
        color: 'white',
        margin: RFPercentage(0.8),
        marginHorizontal: RFPercentage(1.2)
    },
    clickContainer: {
        backgroundColor: BLUE_DARK,
        borderRadius: 3
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        flexGrow: 1,
        justifyContent: 'space-between',
        marginHorizontal: RFPercentage(1.8),
        marginVertical: RFPercentage(1),
        padding: RFPercentage(1)
    },
    data: {
        alignItems: 'center',
        flex: 1.5,
        justifyContent: 'center',
        padding: 2,
        paddingTop: 0
    },
    date: { marginLeft: 8 },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        margin: 4
    },

    headerContainer: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        flex: 1,
        marginBottom: RFPercentage(0.8),
        marginLeft: RFPercentage(1)
    },
    iconStyle: {
        marginRight: RFPercentage(1)
    },
    itemContainer: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 4,
        height: RFPercentage(12),
        justifyContent: 'space-around',
        margin: 4,
        padding: RFPercentage(0.4),
        width: RFPercentage(12)
    },
    loaderStyle: {
        flex: 1,
        justifyContent: 'center'
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    scrollContainer: {
        justifyContent: 'space-around'
    }
});
