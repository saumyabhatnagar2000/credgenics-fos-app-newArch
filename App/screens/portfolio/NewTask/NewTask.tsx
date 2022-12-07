import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from '../../../components/Themed';
import DateTimeInputBox from '../../../components/common/DateTimePicker';
import { BackHandler, StyleSheet, ToastAndroid } from 'react-native';
import CustomAppBar from '../../../components/common/AppBar';
import {
    createBulkTask,
    createTask,
    getCustomerProfile,
    getLoanDetailsWithLoan,
    getLoanProfile
} from '../../../services/portfolioService';
import { useAuth } from '../../../hooks/useAuth';
import {
    BulkStatusType,
    LoanInternalDetailsType,
    VisitData
} from '../../../../types';
import { useTaskAction } from '../../../hooks/useTaskAction';
import { ProgressDialog } from '../../../components/common/Dialogs/ProgessDialog';
import BulkCreateModal from '../../../components/modals/BulkCreateModal';
import { NewVisitImage } from '../images/NewVisit';
import CustomButton from '../../../components/ui/CustomButton';
import { SuccessfullTaskImage } from './SuccessfulTask';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { ErrorTask } from './ErrorTask';
import { CompanyType, TaskOptions, TaskTypes } from '../../../../enums';
import { NewReminderImage } from '../images/NewReminder';
import { ScrollView } from 'react-native-gesture-handler';
import InputWithLabel from '../../../components/common/InputWithLabel';
import IconedBanner from '../../../components/common/IconedBanner';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { AddressBottomSheet } from '../../../components/common/AddressBottomSheet';
import { useFocusEffect } from '@react-navigation/native';
import { HorizontalLine } from '../../../components/HorizontalLine';
import { getAddress } from '../../../services/utils';
import { useClockIn } from '../../../hooks/useClockIn';
import { ClockInNudgeInitPage } from '../../../contexts/ClockInStatusContext';
import {
    modifyReduxCustomerDetails,
    modifyReduxLoanDetails
} from '../../../constants/ModifyData';
import Typography, {
    TypographyVariants
} from '../../../components/ui/Typography';
import DashedLine from 'react-native-dashed-line';
import { CustomRadioButton } from '../../../components/ui/CustomRadioButton';
import { SOMETHING_WENT_WRONG } from '../../../constants/constants';
import useLoanDetails from '../../../hooks/useLoanData';
import _ from 'lodash';

export default function NewTask({ route }: { route: any }) {
    const { loanData, taskType, allocationMonth } = route.params;
    const allocation_month = allocationMonth;

    const { authData, companyType } = useAuth();
    const { checkClockInNudge } = useClockIn();
    const { setNewVisitCreated, updatedAddressIndex } = useTaskAction();
    const { selectedLoanData, getAddressData, loanDetailMap } =
        useLoanDetails();
    const [date, setDate] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState<string>('00:00:00');
    const [comment, setComment] = useState<string>('');
    const addressData = getAddressData(
        allocationMonth,
        selectedLoanData.loan_id
    );
    const [finalStatuses, setFinalStatuses] = useState<Array<BulkStatusType>>(
        []
    );

    const [visible, setVisible] = useState(false);
    const [button, setButton] = useState(false);
    const [error, setError] = useState(true);

    const [apiSuccess, setApiSuccess] = useState('');
    const [apiError, setApiError] = useState('');

    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [details, setDetails] = useState<LoanInternalDetailsType>();

    const [selectedTaskType, setSelectedTaskType] = useState(taskType);

    const isBulk = loanData.length > 1;

    const taskTypeLabel = taskType === TaskTypes.ptp ? 'PTP' : taskType;
    let typeOptions = [TaskOptions.surprise_visit, TaskOptions.ptp];
    if (isBulk) {
        typeOptions = [TaskOptions.surprise_visit];
    }

    const typeSelected =
        TaskTypes.ptp == selectedTaskType
            ? TaskOptions.ptp
            : TaskOptions.surprise_visit;

    const title = isBulk
        ? `Create bulk ${taskTypeLabel}s`
        : `Create new ${taskTypeLabel}`;

    const subtitle = isBulk
        ? `${loanData.length} loans selected`
        : `${companyType == CompanyType.loan ? 'Loan Id' : 'Customer Id'} : ${
              loanData[0].loan_id
          }`;

    const selectTimeText = `Select ${taskTypeLabel} Time ${
        isBulk ? '(optional)' : ''
    }`;

    function checkIfDateTimeValid(date: string, time: string) {
        try {
            const d = date.split('-');
            const t = time.split(':');
            const x = new Date(...d, ...t);
            x.setMonth(x.getMonth() - 1); // months are indexes
            return x > new Date();
        } catch (e) {}
    }

    const locationText = () => {
        try {
            if (details?.address) {
                const convertedAddress = getAddress(
                    addressData?.applicant_type,
                    details?.address?.primary
                );
                if (convertedAddress?.address_text)
                    return `${convertedAddress?.address_text}, ${convertedAddress?.city}`;
                if (
                    convertedAddress &&
                    convertedAddress.longitude &&
                    convertedAddress.latitude
                )
                    return `${convertedAddress.latitude}, ${convertedAddress.longitude}`;
            }
        } catch (e) {}
        return 'Not Available';
    };

    const fetchLoanDetails = useCallback(() => {
        (async () => {
            if (isBulk) return;
            if (!Object.keys(selectedLoanData).length) return;
            setLoading(true);
            if (companyType == CompanyType.loan) {
                // try {
                try {
                    const res = await getLoanDetailsWithLoan(
                        [
                            {
                                loan_id: selectedLoanData.loan_id,
                                allocation_month: allocation_month
                            }
                        ],
                        authData
                    );
                    const loanDetails = await modifyReduxLoanDetails(
                        res[selectedLoanData.loan_id],
                        allocation_month,
                        false
                    );
                    setDetails(loanDetails);
                } catch (error: any) {
                    let message = SOMETHING_WENT_WRONG;
                    if (error?.response) {
                        message =
                            error?.response?.data?.output ??
                            error?.response?.data?.message;
                    }
                    ToastAndroid.show(message, ToastAndroid.LONG);
                }
            } else if (companyType == CompanyType.credit_line) {
                try {
                    const profileApiResponse = await getLoanDetailsWithLoan(
                        [
                            {
                                loan_id: selectedLoanData.loan_id,
                                allocation_month
                            }
                        ],
                        authData
                    );
                    if (profileApiResponse) {
                        const customer_details =
                            await modifyReduxCustomerDetails(
                                profileApiResponse[selectedLoanData.loan_id],
                                selectedLoanData,
                                allocation_month,
                                0,
                                0,
                                0
                            );
                        setDetails(customer_details);
                    }
                } catch (error: any) {
                    let message = SOMETHING_WENT_WRONG;
                    if (error.response) {
                        message =
                            error?.response?.data?.output ??
                            error?.response?.data?.message;
                    }
                    ToastAndroid.show(message, ToastAndroid.LONG);
                }
            }
            setLoading(false);
        })();
    }, [selectedLoanData, updatedAddressIndex]);

    useFocusEffect(fetchLoanDetails);

    const onButtonClick = async () => {
        const isValid = isBulk || checkIfDateTimeValid(date, time);

        if (!isValid) {
            ToastAndroid.show(
                'This time has passed, please select a future time.',
                ToastAndroid.LONG
            );
            return;
        }

        setLoading(true);
        if (!isBulk) {
            const loanDataItem = selectedLoanData;
            createTask(
                {
                    loan_id: loanDataItem.loan_id,
                    visit_date: `${date} ${time}`,
                    address_index: loanDataItem.address_index,
                    applicant_index: loanDataItem.applicant_index,
                    applicant_name: loanDataItem.applicant_name,
                    applicant_type: loanDataItem.applicant_type,
                    comment: comment.trim()
                } as VisitData,
                allocation_month,
                selectedTaskType,
                authData,
                false
            )
                .then((apiResponse?: any) => {
                    if (apiResponse?.success) {
                        const output = apiResponse?.message;
                        // setComment(output);
                        setApiSuccess(output);
                        setButton(true);
                        setVisible(true);
                        setNewVisitCreated(true);
                    }
                })
                .catch((error) => {
                    if (error) {
                        setApiError(error);
                    } else {
                        setApiError(SOMETHING_WENT_WRONG);
                        setButton(false);
                        setVisible(true);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // bulk create
            const commentText = comment.trim();

            createBulkTask(
                loanData,
                allocation_month,
                commentText,
                TaskTypes.visit,
                `${date} ${time}`,
                authData
            )
                .then((apiResponse?: any) => {
                    if (apiResponse?.success) {
                        const output = apiResponse?.data;
                        setFinalStatuses(output);
                        setComment(`${selectedTaskType} Scheduled`);
                        setButton(true);
                        setVisible(true);
                        setNewVisitCreated(true);
                    }
                })
                .catch((error) => {})
                .finally(() => {
                    setLoading(false);
                });
        }
    };
    const openAddressBottomSheet = () => {
        bottomSheetRef.current?.snapToIndex(0);
    };

    const bottomSheetRef = useRef<BottomSheet>(null);
    useEffect(() => {
        const backAction = () => {
            if (bottomSheetOpen) {
                bottomSheetRef.current?.close();
                setBottomSheetOpen(false);
                return true;
            }
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [bottomSheetRef, bottomSheetOpen]);

    useEffect(() => {
        setError(!date);
    }, [date]);

    useEffect(() => {
        checkClockInNudge(ClockInNudgeInitPage.create);
    }, []);

    const onRetry = () => {
        setVisible(false);
        setLoading(false);
        setApiError('');
        setApiSuccess('');
    };

    return (
        <>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'space-between',
                    backgroundColor: '#fff'
                }}
            >
                <CustomAppBar
                    title={title}
                    subtitle={subtitle}
                    backButton={true}
                    filter={false}
                    calendar={false}
                    add={false}
                    sort={false}
                    notifications={false}
                    options={false}
                    search={false}
                />

                <ProgressDialog title="Processing..." visible={loading} />

                {isBulk && finalStatuses?.length > 0 ? (
                    <BulkCreateModal
                        items={loanData}
                        statuses={finalStatuses}
                        visible={visible}
                        hideModal={setVisible}
                    />
                ) : null}

                {apiSuccess?.length ? (
                    <View style={{ flex: 1, backgroundColor: '#F6F8FB' }}>
                        <SuccessfullTaskImage
                            message={apiSuccess}
                            type={typeSelected}
                        />
                    </View>
                ) : apiError?.length ? (
                    <ErrorTask
                        message={apiError}
                        onRetry={onRetry}
                        type={typeSelected}
                    />
                ) : (
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#fff'
                        }}
                    >
                        <View>
                            {!isBulk! ? (
                                <>
                                    <IconedBanner
                                        value={locationText()}
                                        bgColor="#F6F8FB"
                                        type="location"
                                        onClickAddicon={openAddressBottomSheet}
                                        onTextClick={openAddressBottomSheet}
                                    />
                                    <HorizontalLine type="dashed" />
                                </>
                            ) : null}
                        </View>
                        {taskType === TaskTypes.ptp ? (
                            <NewReminderImage />
                        ) : (
                            <NewVisitImage />
                        )}
                        {companyType == CompanyType.credit_line && (
                            <>
                                <Typography
                                    style={{
                                        textAlign: 'center',
                                        marginVertical: RFPercentage(1.5)
                                    }}
                                    variant={TypographyVariants.heading3}
                                >
                                    {`Allocation Month: ${allocation_month}`}
                                </Typography>
                                <DashedLine
                                    dashColor="rgba(0,0,0,0.1)"
                                    style={{
                                        marginBottom: RFPercentage(1.75)
                                    }}
                                />
                            </>
                        )}
                        <CustomRadioButton
                            containerStyle={{ marginVertical: 10 }}
                            checked={typeSelected}
                            buttons={typeOptions}
                            setChecked={(value: TaskOptions) => {
                                if (value == TaskOptions.ptp)
                                    setSelectedTaskType(TaskTypes.ptp);
                                else setSelectedTaskType(TaskTypes.visit);
                            }}
                            label="Visit Purpose"
                        />
                        <DateTimeInputBox
                            placeholder={`Select ${taskTypeLabel} Date`}
                            type="date"
                            icon="calendar-alt"
                            setText={setDate}
                            label="Date"
                        />
                        {!isBulk && (
                            <DateTimeInputBox
                                placeholder={selectTimeText}
                                type="time"
                                icon="clock"
                                setText={setTime}
                                label="Time"
                            />
                        )}
                        <View
                            style={{
                                marginHorizontal: '2%',
                                backgroundColor: '#fff'
                            }}
                        >
                            <InputWithLabel
                                placeholder="add comment..."
                                label="Add Comment"
                                value={comment}
                                setText={setComment}
                                multiline={true}
                                numberOfLines={5}
                            />
                        </View>

                        <View style={styles.buttonWrapper}>
                            <CustomButton
                                title="Create"
                                onPress={onButtonClick}
                                disabled={error || loading}
                            />
                        </View>
                    </View>
                )}
            </ScrollView>
            <AddressBottomSheet
                data={details?.address}
                ref={bottomSheetRef}
                applicantType={selectedLoanData?.applicant_type}
                applicantIndex={selectedLoanData?.applicant_index}
                loanId={selectedLoanData?.loan_id}
            />
        </>
    );
}

const styles = StyleSheet.create({
    address: {
        fontFamily: 'poppins',
        fontSize: 18,
        paddingHorizontal: 10,
        paddingVertical: 2
    },
    addressText: {
        color: '#808080',
        fontFamily: 'poppins',
        padding: 10
    },
    buttonWrapper: {
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '100%'
    },
    container: {
        borderColor: '#e0e0e0',
        borderRadius: 10,
        borderWidth: 0.5,
        elevation: 1,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 5
    },
    messageText: {
        color: '#909195',
        fontFamily: 'Avenir Next',
        fontSize: RFPercentage(2.2),
        fontWeight: '500',
        paddingTop: 30
    },
    separator: {
        backgroundColor: '#e0e0e0',
        height: 1,
        width: '100%'
    }
});
