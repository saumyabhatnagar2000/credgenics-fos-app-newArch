import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
    AppState,
    BackHandler,
    FlatList,
    StatusBar,
    StyleSheet,
    ToastAndroid,
    View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
    PendingDepositType,
    RootStackParamList,
    TimerRefType
} from '../../../types';
import { DepositTimerAsset } from '../../assets/DepositTimerAsset';
import PaymentsLinkError from '../../assets/payments/PaymentsLinkError';
import PaymentsLinkSent from '../../assets/payments/PaymentsLinkSent';
import CurrencyTypography from '../../components/ui/CurrencyTypography';
import { Timer } from '../../components/ui/Timer';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../../components/ui/Typography';
import { SOMETHING_WENT_WRONG } from '../../constants/constants';
import { TIMESTAMP_DEPOSIT_TIMER } from '../../constants/Storage';
import { useAuth } from '../../hooks/useAuth';
import { useInterval } from '../../hooks/useInterval';
import {
    cancelDeposit,
    loadDepostHistory
} from '../../services/depositService';
import { getStorageData, setStorageData } from '../../utils/Storage';

const VERIFICATION_STATUS = {
    pending: 'pending',
    rejected: 'rejected',
    approved: 'approved'
};

const DEPOSIT_STEPS = {
    INITIAL: 0,
    COMPLETED: 1,
    REJECTED: 2
};

export const DepositTimerScreen:
    | StackNavigationProp<RootStackParamList, 'DepositTimerScreen'>
    | any = ({
    navigation,
    route
}: {
    navigation: StackNavigationProp<RootStackParamList, 'DepositTimerScreen'>;
    route: RouteProp<RootStackParamList, 'DepositTimerScreen'>;
}) => {
    const depositAmount: number = route.params?.depositAmount ?? 0;
    const depositData: Array<PendingDepositType> =
        route.params?.depositData ?? [];
    const depositId: string = route?.params?.depositId ?? '';
    const { authData, companyName } = useAuth();
    const [depositStep, setDepositStep] = useState(DEPOSIT_STEPS.INITIAL);
    const timerRef = useRef<TimerRefType>(null);
    const [stopPolling, setStopPolling] = useState(false);
    const [depositTrackRetryCount, setDepositTrackRetryCount] = useState(0);

    useEffect(() => {
        AppState.addEventListener('change', async (state) => {
            if (state == 'background') {
                //saving timestamp when app goes out of focus
                timerRef.current?.stopTimer();
                await setStorageData(
                    TIMESTAMP_DEPOSIT_TIMER,
                    JSON.stringify(moment())
                );
            } else if (state == 'active') {
                //retriving timestamp and updating the timer
                let data: any;
                try {
                    data = await getStorageData(TIMESTAMP_DEPOSIT_TIMER);
                } catch {
                    data = moment();
                }
                const oldTime = JSON.parse(data!);
                const difference = moment().diff(moment(oldTime), 'seconds');
                timerRef.current?.setUpdateTimer(difference);
            }
        });
        return () => {
            AppState.removeEventListener('change', () => {});
        };
    }, []);

    const checkDepositStatus = async (retryCount = depositTrackRetryCount) => {
        try {
            const apiResponse = await loadDepostHistory(depositId, authData);
            if (apiResponse) {
                setDepositTrackRetryCount(0);
                const verificationStatus =
                    apiResponse?.data?.[0]?.verification_status;
                if (verificationStatus == VERIFICATION_STATUS.rejected) {
                    setDepositStep(DEPOSIT_STEPS.REJECTED);
                    setStopPolling(true);
                } else if (verificationStatus == VERIFICATION_STATUS.approved) {
                    setStopPolling(true);
                    timerRef.current?.stopTimer();
                    setDepositStep(DEPOSIT_STEPS.COMPLETED);
                } else {
                    if (timerRef.current?.getTimePassed() <= 0) {
                        setDepositStep(DEPOSIT_STEPS.REJECTED);
                        setStopPolling(true);
                        callCancelDeposit(true);
                    }
                }
            }
        } catch (e) {
            if (retryCount >= 2) {
                timerRef.current?.stopTimer();
                setStopPolling(true);
                setDepositStep(DEPOSIT_STEPS.REJECTED);
                return;
            }
            setDepositTrackRetryCount((_prev) => _prev + 1);
        }
    };

    const callCancelDeposit = async (timeout: boolean) => {
        try {
            const apiResponse = await cancelDeposit(
                depositId,
                timeout,
                authData
            );
            if (apiResponse?.success) {
                ToastAndroid.show(apiResponse?.message, ToastAndroid.SHORT);
                navigation.canGoBack() && navigation.goBack();
                setStopPolling(true);
            } else if (!apiResponse?.success) {
                setDepositStep(DEPOSIT_STEPS.COMPLETED);
                ToastAndroid.show(apiResponse?.message, ToastAndroid.SHORT);
            }
        } catch (e) {
            ToastAndroid.show(
                e?.response?.message ?? SOMETHING_WENT_WRONG,
                ToastAndroid.SHORT
            );
            navigation.canGoBack() && navigation.goBack();
        }
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => true
        );
        return () => backHandler.remove();
    }, []);

    useInterval(() => {
        if (!stopPolling) {
            checkDepositStatus();
        }
    }, 60 * 1000);

    const onClickButton = async () => {
        switch (depositStep) {
            case DEPOSIT_STEPS.COMPLETED:
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Drawer' }]
                });
                break;

            case DEPOSIT_STEPS.REJECTED:
                timerRef.current?.resetTimer();
                setStopPolling(false);
                setDepositStep(DEPOSIT_STEPS.INITIAL);
                navigation.canGoBack() && navigation.goBack();
                break;
            default:
                timerRef.current?.resetTimer();
                callCancelDeposit(false);
                break;
        }
    };
    useEffect(() => {
        checkDepositStatus();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {depositStep == DEPOSIT_STEPS.INITIAL ? (
                <View style={styles.refreshContainer}>
                    <Typography style={styles.refreshText}>
                        Do not refresh or close the app while processing
                    </Typography>
                </View>
            ) : (
                <View style={{ marginVertical: StatusBar.currentHeight }} />
            )}
            <View style={styles.headerInfo}>
                <View style={styles.headerInfoInner}>
                    <Typography
                        style={styles.headingText}
                        variant={TypographyVariants.caption3}
                    >
                        {'Company Name: '}
                    </Typography>
                    <Typography
                        style={styles.headingText}
                        variant={TypographyVariants.caption}
                    >
                        {companyName}
                    </Typography>
                </View>
                <View style={styles.headerInfoInner}>
                    <Typography
                        style={styles.headingText}
                        variant={TypographyVariants.caption3}
                    >
                        {'Deposit Id: '}
                    </Typography>
                    <Typography
                        style={styles.headingText}
                        variant={TypographyVariants.caption}
                    >
                        {depositId}
                    </Typography>
                </View>
            </View>
            <View>
                <Typography
                    style={[
                        styles.confirmationText,
                        getScreenAssests(depositStep).titleStyle
                    ]}
                    variant={TypographyVariants.heading3}
                >
                    {getScreenAssests(depositStep).title}
                </Typography>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {getScreenAssests(depositStep)?.assest}
            </View>

            {depositStep == DEPOSIT_STEPS.INITIAL && (
                <View>
                    <Timer ref={timerRef} onTimeComplete={checkDepositStatus} />
                </View>
            )}
            <TouchableOpacity
                onPress={onClickButton}
                containerStyle={styles.buttonContainer}
            >
                <Typography
                    variant={TypographyVariants.heading3}
                    style={styles.buttonText}
                >
                    {getScreenAssests(depositStep)?.buttonTitle}
                </Typography>
            </TouchableOpacity>
            <View style={styles.amountContainer}>
                <View style={{ marginTop: RFPercentage(2) }}>
                    <CurrencyTypography
                        variant={TypographyVariants.subHeading}
                        style={{ color: '#000', textAlign: 'center' }}
                        amount={depositAmount}
                    />

                    <Typography
                        variant={TypographyVariants.caption1}
                        style={{ color: '#000', textAlign: 'center' }}
                    >
                        Deposit Amount
                    </Typography>
                </View>

                <View style={styles.flatListContainer}>
                    <FlatList
                        ListHeaderComponent={<HeaderComponent />}
                        data={depositData}
                        renderItem={(item) => <DepositRow data={item.item} />}
                    />
                </View>
            </View>
        </View>
    );
};

const HeaderComponent = () => {
    return (
        <View style={styles.headerContainer}>
            <Typography
                variant={TypographyVariants.caption}
                style={styles.headerText}
            >
                Loan IDs
            </Typography>
            <Typography
                variant={TypographyVariants.caption}
                style={styles.headerText}
            >
                Amount
            </Typography>
        </View>
    );
};

const DepositRow = ({ data }: { data: PendingDepositType }) => {
    return (
        <View style={styles.rowContainer}>
            <Typography
                variant={TypographyVariants.caption3}
                style={{ color: '#000', textAlign: 'center' }}
            >
                {data.loan_id}
            </Typography>
            <Typography>
                <CurrencyTypography
                    variant={TypographyVariants.caption3}
                    amount={data.amount_recovered}
                    style={{ color: '#000', textAlign: 'left' }}
                />
            </Typography>
        </View>
    );
};

const getScreenAssests = (type: number) => {
    switch (type) {
        case DEPOSIT_STEPS.COMPLETED:
            return {
                assest: <PaymentsLinkSent />,
                buttonTitle: 'Done',
                title: 'Deposit Successful!',
                titleStyle: { color: '#377E22' }
            };
        case DEPOSIT_STEPS.REJECTED:
            return {
                assest: <PaymentsLinkError />,
                buttonTitle: 'Try Again',
                title: 'Deposit Failed!',
                titleStyle: { color: '#AA3D3D' }
            };
        default:
            return {
                assest: <DepositTimerAsset />,
                buttonTitle: 'Cancel Deposit',
                title: `Waiting... for confirmation \nfrom Airtel!`,
                titleStyle: {
                    color: '#043E90',
                    marginVertical: RFPercentage(4)
                }
            };
    }
};

const styles = StyleSheet.create({
    amountContainer: {
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        flex: 1,
        justifyContent: 'center'
    },
    buttonContainer: {
        alignSelf: 'center',
        marginBottom: RFPercentage(2),
        marginTop: RFPercentage(3),
        paddingVertical: RFPercentage(0.5),
        width: '50%'
    },
    buttonText: {
        color: '#3889E9',
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    confirmationText: {
        lineHeight: RFPercentage(4),
        marginTop: RFPercentage(1),
        textAlign: 'center'
    },
    flatListContainer: {
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        justifyContent: 'center',
        marginTop: RFPercentage(2),
        marginBottom: RFPercentage(3),
        width: '95%'
    },
    headerContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: RFPercentage(1),
        width: '60%'
    },
    headerText: {
        color: '#000',
        textAlign: 'left'
    },
    refreshContainer: {
        backgroundColor: '#043E9010',
        marginTop: StatusBar.currentHeight,
        paddingVertical: RFPercentage(1.5)
    },
    refreshText: {
        color: '#28293D',
        fontFamily: TypographyFontFamily.lightOblique,
        fontSize: RFPercentage(1.75),
        textAlign: 'center'
    },
    rowContainer: {
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: RFPercentage(0.5),
        width: '60%'
    },
    headerInfo: {
        marginHorizontal: RFPercentage(3),
        marginTop: RFPercentage(3),
        marginBottom: RFPercentage(1),
        alignItems: 'center'
    },
    headingText: {
        color: '#000000',
        opacity: 0.9
    },
    headerInfoInner: {
        flexDirection: 'row',
        marginBottom: RFPercentage(1)
    }
});
