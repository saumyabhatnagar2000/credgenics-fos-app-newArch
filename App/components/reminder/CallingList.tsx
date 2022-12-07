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
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import moment, { Moment } from 'moment';
import Colors, { BLUE_DARK, GREY } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { ErrorPlaceholder } from '../common/ErrorPlaceholder';
import { useNavigation } from '@react-navigation/native';
import useDidMountEffect from '../../hooks/useDidMountEffect';
import {
    AddressData,
    CallingReminderType,
    ModalButtonType
} from '../../../types';
import {
    ApplicantTypes,
    CallingModeTypes,
    ReminderListType
} from '../../../enums';
import { getCallingReminders } from '../../services/callingService';
import { CallingRow } from './CallingRow';
import ConnectingClickToCallModal from '../modals/ConnectingClickToCallModal';
import CallTypeListModal from '../modals/CallTypeListModal';
import {
    getAddressDatafromLoanIds,
    getLoanDatafromIds
} from '../../services/portfolioService';
import { StringCompare } from '../../services/utils';
import { startCall } from '../../services/utils';
import { closeReminder } from '../../services/callingService';
import { callUser } from '../../services/communicationService';
import { CustomModal } from '../modals/ReusableModal';
import { Overall } from '../../constants/constants';
import useLoanDetails from '../../hooks/useLoanData';

export const CallingList = ({
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
    const { authData, callingModes } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isConnectingVisible, setIsConnectingVisible] = useState(false);
    const [detailsMap, setDetailsMap] = useState({});
    const [localLoanId, setLocalLoanId] = useState('');

    const [update, setUpdate] = useState(true);
    const [callListItems, setCallListItems] = useState<
        Array<CallingReminderType>
    >([]);
    const [selectedNumber, setSelectedNumber] = useState('');

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const navigation = useNavigation();
    const [localAllocationMonth, setLocalAllocationMonth] = useState('');
    const [addressData, setAddressData] = useState<AddressData>();
    const { setSelectedLoanData } = useLoanDetails();
    let date = moment(currentDate, 'YYYY-M-DD').date();

    const reloadData = () => {
        setUpdate(!update);
    };
    useDidMountEffect(() => {
        if (navigation.isFocused()) {
            reloadData();
        }
    }, [currentDate]);
    const openConfirmModal = () => {
        setShowConfirmModal(true);
    };

    const [selectedDate, setSelectedDate] = useState(date);
    const fetchdata = async () => {
        setLoading(true);
        if (type == ReminderListType.to_do) {
            try {
                const apiRepsonse = await getCallingReminders(
                    String(
                        moment(currentDate, 'YYYY-M-DD').format(
                            `YYYY-MM-${selectedDate}`
                        )
                    ),
                    moment(currentDate, 'YYYY-M-DD').format(
                        `YYYY-MM-${selectedDate}`
                    ),
                    authData
                );
                if (apiRepsonse?.data) {
                    setCallListItems(apiRepsonse.data?.output?.reminders ?? []);
                }
            } catch (e) {
                ToastAndroid.show(
                    'Error fetching reminders',
                    ToastAndroid.SHORT
                );
            }
        } else {
            try {
                const apiResponse = await getCallingReminders(
                    '',
                    moment().subtract(1, 'day').format('YYYY-MM-DD'),
                    authData
                );
                if (apiResponse) {
                    setCallListItems(apiResponse.data?.output?.reminders ?? []);
                }
            } catch (e) {
                ToastAndroid.show(
                    'Error fetching reminders',
                    ToastAndroid.SHORT
                );
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchdata();
    }, [update, selectedDate, ListType, type]);

    useEffect(() => {
        setSelectedDate(date);
    }, [date]);

    const [scrollableDates, setScrollableDates] = useState<Array<number>>([]);

    const onCall = (number: string, allocation_month: string) => {
        setLocalAllocationMonth(allocation_month);
        if (StringCompare(allocation_month, Overall)) {
            ToastAndroid.show(
                `Call cannot be placed at ‘Overall’ allocation month, please select an individual month.`,
                ToastAndroid.LONG
            );
            return;
        }
        const isC2CAvailable = callingModes.includes(
            CallingModeTypes.click_to_call
        );
        const isManualAvailable = callingModes.includes(
            CallingModeTypes.manual
        );

        if (isC2CAvailable && isManualAvailable) setSelectedNumber(number);
        else if (isManualAvailable) startCall(number);
        else if (isC2CAvailable) c2c(number, allocation_month);
    };
    const handleCallTypeSelect = (type: CallingModeTypes) => {
        const number = selectedNumber;
        setSelectedNumber('');
        if (type === CallingModeTypes.manual) startCall(number);
        if (type === CallingModeTypes.click_to_call)
            c2c(number, localAllocationMonth);
    };
    const resolveReminder = async () => {
        setShowConfirmModal(false);
        try {
            const apiRepsonse = await closeReminder(
                localLoanId,
                false,
                authData
            );
            if (apiRepsonse?.data)
                ToastAndroid.show(
                    'Reminder closed successfully',
                    ToastAndroid.SHORT
                );
        } catch (e) {
            ToastAndroid.show('Some error occurred', ToastAndroid.SHORT);
        }
        setUpdate(!update);
    };
    const onCallIconClick = async (data: CallingReminderType) => {
        ToastAndroid.show('Fetching Details', ToastAndroid.LONG);
        try {
            const response = await getAddressDatafromLoanIds(
                data.loan_id,
                data.allocation_month,
                authData
            );
            if (response?.data) {
                const apiAddressData: AddressData =
                    response.data.output[data.loan_id].address_data;
                setAddressData({
                    ...apiAddressData,
                    ['loan_id']: data.loan_id
                });

                try {
                    const apiResponse = await getLoanDatafromIds(
                        data.loan_id,
                        authData
                    );
                    let contactNumber: string = '';
                    let applicantName: string = '';
                    if (apiResponse?.data) {
                        const applicantData =
                            apiResponse.data?.output.data[0] ?? [];
                        if (
                            apiAddressData.applicant_type ==
                            ApplicantTypes.applicant
                        ) {
                            contactNumber =
                                applicantData.applicant_contact_number;
                            applicantName = applicantData.applicant_name;
                        } else if (
                            apiAddressData.applicant_type ==
                            ApplicantTypes.co_applicant
                        ) {
                            contactNumber =
                                applicantData.co_applicant[
                                    apiAddressData.applicant_index
                                ].co_applicant_contact_number;
                            applicantName =
                                applicantData.co_applicant[
                                    apiAddressData.applicant_index
                                ].co_applicant_name;
                        }
                        setSelectedLoanData({
                            ...apiAddressData,
                            ['allocation_month']: data.allocation_month,
                            ['loan_id']: data.loan_id,
                            ['applicant_name']: applicantName
                        });
                        setDetailsMap((_prev) => {
                            return {
                                ..._prev,
                                [data.loan_id]: {
                                    contact_number: contactNumber
                                }
                            };
                        });
                    }
                } catch (e) {}
            }
        } catch (e) {
            ToastAndroid.show('Error fetching data', ToastAndroid.SHORT);
        }
    };
    const showConnecting = () => {
        setIsConnectingVisible(true);
        setInterval(() => {
            setIsConnectingVisible(false);
        }, 5000);
    };
    const c2c = async (number: string, allocation_month: string) => {
        const data = {
            To: number,
            From: authData?.mobile,
            applicant_type: addressData?.applicant_type ?? '',
            status: 'call_attempted'
        };
        try {
            const apiResponse = await callUser(
                addressData?.loan_id ?? '',
                allocation_month,
                data.To,
                data.From,
                data.applicant_type,
                data.status,
                authData
            );
            navigation.navigate('DispositionFormScreen', {
                shootId: apiResponse?.data?.shoot_id ?? '',
                phoneNumber: data.To
            });
            showConnecting();
        } catch (e: any) {}
    };

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
    const CustomHeaderComponent = () => (
        <View>
            <Typography style={styles.headerText}>
                {'Are you sure you want to close the reminder?'}
            </Typography>
        </View>
    );
    const CustomModaldata: Array<ModalButtonType> = [
        {
            buttonText: 'No, Wait',
            buttonTextStyle: styles.buttonOneText,
            buttonStyle: styles.buttonOneContainer,
            buttonFunction: () => setShowConfirmModal(false)
        },
        {
            buttonText: 'Yes, Submit',
            buttonTextStyle: styles.buttonTwoText,
            buttonStyle: styles.buttonTwoContainer,
            buttonFunction: () => resolveReminder()
        }
    ];

    return (
        <>
            <CustomModal
                visible={showConfirmModal}
                dismissable={false}
                HeaderComponent={CustomHeaderComponent}
                data={CustomModaldata}
            />
            <ConnectingClickToCallModal visible={isConnectingVisible} />
            {true && (
                <CallTypeListModal
                    visible={!!selectedNumber}
                    hide={() => setSelectedNumber('')}
                    onTypeSelect={handleCallTypeSelect}
                />
            )}
            <View>
                {type == ReminderListType.to_do ? (
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                    >
                        {scrollableDates.map((date) => (
                            <DateItem key={date} date={date} />
                        ))}
                    </ScrollView>
                ) : null}
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    keyExtractor={(reminder) => String(reminder.created)}
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
                                    message="No Calls Found"
                                />
                            </View>
                        ) : null
                    }
                    data={callListItems}
                    renderItem={(reminder) => {
                        return (
                            <CallingRow
                                reminder={reminder.item}
                                onClickResolve={() => {
                                    setLocalLoanId(reminder.item.loan_id);
                                    openConfirmModal();
                                }}
                                onClickCall={onCallIconClick}
                                onCall={onCall}
                                detailsMap={detailsMap}
                            />
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
    buttonOneContainer: {
        backgroundColor: '#fff',
        borderColor: BLUE_DARK,
        borderWidth: 0.5,
        justifyContent: 'center',
        marginRight: RFPercentage(0.5),
        minHeight: RFPercentage(4.2),
        minWidth: RFPercentage(13.5)
    },
    buttonOneText: {
        color: BLUE_DARK,
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(2),
        textAlign: 'center'
    },
    buttonTwoContainer: {
        backgroundColor: BLUE_DARK,
        marginLeft: RFPercentage(0.5),
        minHeight: RFPercentage(4.2),
        minWidth: RFPercentage(13.5)
    },
    buttonTwoText: {
        color: '#fff',
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(2)
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
    headerText: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2.4),
        lineHeight: RFPercentage(3.5),
        textAlign: 'center'
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
