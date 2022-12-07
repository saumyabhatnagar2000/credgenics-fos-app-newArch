import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, ToastAndroid, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { CallingModeTypes, CompanyType, LoanStatusType } from '../../../enums';
import { BLUE_DARK } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { getNextTasks } from '../../services/callingService';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import NextTaskItem from './NextTaskItem';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CallingReminderType, ModalButtonType } from '../../../types';
import ConnectingClickToCallModal from '../modals/ConnectingClickToCallModal';
import CallTypeListModal from '../modals/CallTypeListModal';
import {
    getCustomerProfile,
    getLoanProfile,
    loadPortfolioList
} from '../../services/portfolioService';
import { StringCompare } from '../../services/utils';
import { SortPortfolioTypes, SortValue } from '../../../enums';
import { startCall } from '../../services/utils';
import { closeReminder } from '../../services/callingService';
import { callUser } from '../../services/communicationService';
import { CustomModal } from '../modals/ReusableModal';
import { TaskCompletePlaceholder } from '../common/TaskCompletePlaceholder';
import { NextTaskCallingItem } from './NextTaskCallingItem';
import {
    modifyCustomerDetails,
    modifyLoanDetails
} from '../../constants/ModifyData';
import useLoanDetails from '../../hooks/useLoanData';
import {
    LOAN_IS_CLOSED,
    Overall,
    SOMETHING_WENT_WRONG
} from '../../constants/constants';

function NextTasksComponent() {
    const [nextTasks, setNextTasks] = useState([]);

    const { authData, callingModes, allocationMonth, companyType } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isConnectingVisible, setIsConnectingVisible] = useState(false);
    const [detailsMap, setDetailsMap] = useState({});
    const [localLoanId, setLocalLoanId] = useState('');

    const [update, setUpdate] = useState(true);
    const [selectedNumber, setSelectedNumber] = useState('');

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const navigation = useNavigation();
    const { selectedLoanData, setSelectedLoanData } = useLoanDetails();
    const [localAllocationMonth, setLocalAllocationMonth] = useState('');

    const openConfirmModal = () => {
        setShowConfirmModal(true);
    };

    const fetchData = useCallback(() => {
        (async () => {
            try {
                setLoading(true);
                const apiResponse = await getNextTasks(
                    moment().format('YYYY-M-DD'),
                    moment().format('YYYY-M-DD'),
                    authData
                );
                if (apiResponse?.data) {
                    setNextTasks(apiResponse?.data?.output?.reminders ?? []);
                }
            } catch (e) {
                ToastAndroid.show('Error fetching visits', ToastAndroid.SHORT);
            } finally {
                setLoading(false);
            }
        })();
    }, [authData]);

    useFocusEffect(fetchData);

    const onCall = (number: string, allocation_month: string) => {
        setLocalAllocationMonth(allocation_month);
        if (StringCompare(allocationMonth, Overall)) {
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
        else if (isC2CAvailable) c2c(number);
    };
    const handleCallTypeSelect = (type: CallingModeTypes) => {
        const number = selectedNumber;
        setSelectedNumber('');
        if (type === CallingModeTypes.manual) startCall(number);
        if (type === CallingModeTypes.click_to_call) c2c(number);
    };
    const resolveReminder = async () => {
        setShowConfirmModal(false);
        try {
            const apiRepsonse = await closeReminder(
                localLoanId,
                false,
                authData
            );
            fetchData();
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
            const loanResponse = await loadPortfolioList(
                data.allocation_month,
                1,
                10,
                {
                    type: SortPortfolioTypes.date_of_default,
                    value: SortValue.ascending
                },
                '',
                authData,
                { latitude: 0, longitude: 0 },
                data.loan_id,
                'loan_id',
                '',
                ''
            );
            if (loanResponse?.data) {
                let tempLoanData =
                    loanResponse.data.output?.customer_details[0];
                const allocation_month =
                    loanResponse?.data?.output?.allocation_month;
                tempLoanData = { ...tempLoanData, allocation_month };
                setSelectedLoanData({ ...tempLoanData });

                try {
                    if (companyType == CompanyType.loan) {
                        const loanProfileResponse = await getLoanProfile(
                            data.loan_id,
                            data.allocation_month,
                            authData
                        );
                        if (loanProfileResponse?.data) {
                            const loanDetails = await modifyLoanDetails(
                                tempLoanData,
                                loanProfileResponse?.data.output?.question_dict,
                                data.allocation_month,
                                undefined,
                                false,
                                authData
                            );
                            setDetailsMap({
                                ...detailsMap,
                                [tempLoanData?.loan_id]: loanDetails
                            });
                        }
                    } else {
                        const apiResponse = await getCustomerProfile(
                            data.loan_id,
                            allocationMonth,
                            authData
                        );
                        if (apiResponse?.data) {
                            const customerDetails = await modifyCustomerDetails(
                                tempLoanData,
                                apiResponse?.data?.output,
                                allocationMonth,
                                undefined,
                                undefined,
                                undefined,
                                authData
                            );
                            setDetailsMap({
                                ...detailsMap,
                                [tempLoanData?.loan_id]: customerDetails
                            });
                        }
                    }
                } catch (e: any) {
                    let message = SOMETHING_WENT_WRONG;
                    if (e?.response) {
                        message =
                            e?.response?.data.output ??
                            e?.response?.data.message;
                    }
                    ToastAndroid.show(message, ToastAndroid.LONG);
                }
            }
        } catch (e) {
            ToastAndroid.show(
                'Unable to fetch loan details',
                ToastAndroid.SHORT
            );
        }
    };
    const showConnecting = () => {
        setIsConnectingVisible(true);
        setInterval(() => {
            setIsConnectingVisible(false);
        }, 5000);
    };
    const c2c = async (number: string) => {
        const data = {
            To: number,
            From: authData?.mobile,
            applicant_type: selectedLoanData?.applicant_type ?? '',
            status: 'call_attempted'
        };

        try {
            const apiResponse = await callUser(
                selectedLoanData?.loan_id ?? '',
                localAllocationMonth,
                data.To,
                data.From,
                data.applicant_type,
                data.status,
                authData
            );
            if (
                StringCompare(
                    selectedLoanData?.final_status,
                    LoanStatusType.closed
                )
            ) {
                ToastAndroid.show(LOAN_IS_CLOSED, ToastAndroid.LONG);
                return;
            }
            navigation.navigate('DispositionFormScreen', {
                shootId: apiResponse?.data?.shoot_id ?? '',
                phoneNumber: data.To
            });
            showConnecting();
        } catch (e: any) {}
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
        <View style={styles.container}>
            <ConnectingClickToCallModal visible={isConnectingVisible} />
            <CallTypeListModal
                visible={!!selectedNumber}
                hide={() => setSelectedNumber('')}
                onTypeSelect={handleCallTypeSelect}
            />
            <CustomModal
                visible={showConfirmModal}
                dismissable={false}
                HeaderComponent={CustomHeaderComponent}
                data={CustomModaldata}
            />
            <View style={styles.headerContainer}>
                <Typography variant={TypographyVariants.title1}>
                    ToDo's ( Reminder )
                </Typography>
            </View>
            <FlatList
                keyExtractor={(reminder) => String(reminder.loan_id)}
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        colors={[BLUE_DARK]}
                        enabled
                        refreshing={loading}
                        onRefresh={fetchData}
                    />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View style={{ marginVertical: 12 }}>
                            <TaskCompletePlaceholder message="All set for today!" />
                        </View>
                    ) : null
                }
                data={nextTasks}
                renderItem={({ item }) => {
                    let content;
                    if (item.next_step == 'field_visit') {
                        content = <NextTaskItem reminder={item} />;
                    } else
                        content = (
                            <NextTaskCallingItem
                                reminder={item}
                                onClickResolve={() => {
                                    setLocalLoanId(item.loan_id);
                                    openConfirmModal();
                                }}
                                onClickCall={onCallIconClick}
                                onCall={onCall}
                                detailsMap={detailsMap}
                            />
                        );

                    return (
                        <View style={{ marginVertical: 4, elevation: 10 }}>
                            {content}
                        </View>
                    );
                }}
            />
        </View>
    );
}

export default NextTasksComponent;

const styles = StyleSheet.create({
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
    container: {
        borderRadius: 4,
        flexGrow: 1,
        justifyContent: 'space-between',
        marginHorizontal: RFPercentage(2),
        marginVertical: RFPercentage(2),
        padding: RFPercentage(0.4)
    },
    headerContainer: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        marginLeft: 4
    },
    headerText: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2.4),
        lineHeight: RFPercentage(3.5),
        textAlign: 'center'
    },
    scrollContainer: {
        flex: 1
    }
});
