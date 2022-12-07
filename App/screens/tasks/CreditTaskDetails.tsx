import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {
    Alert,
    BackHandler,
    StyleSheet,
    ToastAndroid,
    View
} from 'react-native';
import ProofSelectorContainer from '../../components/common/ProofSelector/ProofSelector';
import { useAuth } from '../../hooks/useAuth';
import {
    ImageInputType,
    LoanInternalDetailsType,
    LocationType,
    ModalButtonType,
    TaskBottomSheetData,
    TaskSubmitType,
    TransactionFormType,
    TransactionListType,
    VisitData,
    VisitOtpDataType
} from '../../../types';
import CustomAppBar from '../../components/common/AppBar';
import {
    closeVisit,
    generateVisitOtp,
    getFieldVisitHistory,
    getTransactionData,
    submitTask
} from '../../services/taskService';
import { useTaskAction } from '../../hooks/useTaskAction';
import {
    checkIfStatusIsPTP,
    checkProofAttached,
    getDecimalCountInString,
    getStraightLineDistance,
    getValidAmountString
} from '../../services/utils';
import { ProgressDialog } from '../../components/common/Dialogs/ProgessDialog';
import ResultModal from '../../components/modals/ResultModal';
import {
    DepositTypes,
    LoanStatusType,
    LocationAccessType,
    OtpVerifyTypes,
    PermissionType,
    ReminderFromType,
    TaskTypes,
    VisitPurposeType
} from '../../../enums';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { CustomRadioButton } from '../../components/ui/CustomRadioButton';
import { HorizontalLine } from '../../components/HorizontalLine';
import InputWithLabel from '../../components/common/InputWithLabel';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../../components/ui/Typography';
import CustomButton from '../../components/ui/CustomButton';
import Colors, { BLUE_3, BLUE_DARK } from '../../constants/Colors';
import { TaskBottomSheet } from '../../components/tasks/TaskBottomSheet';
import moment from 'moment';
import {
    LOAN_STATUS_TEXT,
    Overall,
    SMS_CONTENT_TEMPLATE_ID,
    SMS_PRINCIPAL_ENTITY_ID,
    SOMETHING_WENT_WRONG,
    get_email_body,
    get_sms_body,
    otp_max_try_error_string,
    LOAN_IS_CLOSED
} from '../../constants/constants';
import { CustomModal } from '../../components/modals/ReusableModal';
import { CustomActivityIndicator } from '../../components/placeholders/CustomActivityIndicator';
import { getAddress } from '../../services/utils';
import BottomSheet from '@gorhom/bottom-sheet';
import PaymentLinkBottomSheet from '../../components/tasks/PaymentBottomSheet/PaymentBottomSheet';
import { DispositionDropdown } from '../../components/common/DispositionStatusDropdown';
import {
    DispositionFormErrorType,
    DispositionType,
    DropDownType
} from '../../../types';
import { StringCompare } from '../../services/utils';
import {
    createNewReminder,
    getCallingHistory
} from '../../services/callingService';
import {
    createTask,
    getCustomerProfile,
    getDigitalNotice,
    getLoanDetailsWithLoan,
    getSpeedPost,
    getTransactionList
} from '../../services/portfolioService';
import { useClockIn } from '../../hooks/useClockIn';
import { ClockInNudgeInitPage } from '../../contexts/ClockInStatusContext';
import {
    getLoanDetailsFromId,
    getRecVar
} from '../../services/portfolioService';
import CollectionAmountHeading from '../../components/tasks/CollectionAmountHeading';
import CollectionAmountInput from '../../components/tasks/CollectionAmountInput';
import { getRecoveredKey } from '../../constants/Keys';
import {
    modifyCallingHistory,
    modifyReduxCustomerDetails
} from '../../constants/ModifyData';
import { TransactionTable } from '../../components/tasks/TransactionTable';
import { useLocation } from '../../hooks/useLocation';
import DetailsHeader from '../../components/DetailsHeader';
import ChequeMethodBottomSheet from '../../components/tasks/ChequeMethodBottomSheet';
import { GreenTickIcon } from '../../components/common/Icons/GreenTickIcon';
import { TaskDetailsEventTypes } from '../../constants/Events';
import { useMixpanel } from '../../contexts/MixpanelContext';
import useLoanDetails from '../../hooks/useLoanData';
import { useAction } from '../../hooks/useAction';
import useCommon from '../../hooks/useCommon';
import { SimpleAlertDialog } from '../../components/common/Dialogs/SimplerAlertDialog';
import ClosedLoanErrorModal from '../../components/modals/ClosedLoanErrorModal';

const radioButtonColors = [Colors.common.green1, Colors.common.red2];

const HorizontalLineContainer = () => (
    <HorizontalLine
        type="dashed"
        style={{
            paddingHorizontal: 20,
            paddingVertical: 15
        }}
    />
);

export default function CreditTaskDetails({
    route,
    navigation
}: {
    route: any;
    navigation: any;
}) {
    const { visit_id, reminder_id } = route.params;
    const {
        authData,
        collectionModes,
        isFeedbackResponseNeeded,
        companyName,
        otpVerificationRequired,
        getCurrencyString,
        geoFencingRequired,
        geofencingDistance,
        isRecoveryAmountBifurcationEnabled,
        locationAccess,
        setMockLocationEnabled
    } = useAuth();
    const { logEvent } = useMixpanel();
    const { newAddressAdded } = useAction();
    const { isInternetAvailable } = useCommon();

    const { checkClockInNudge } = useClockIn();

    useEffect(() => {
        checkClockInNudge(ClockInNudgeInitPage.visit);
    }, []);

    const {
        selectedLoanData,
        getAddressData,
        setLoanDetailMap,
        loanDetailMap
    } = useLoanDetails();
    const VISIT_ID = visit_id ? visit_id : selectedLoanData.visit_id;
    const REMINDER_ID = selectedLoanData.reminder_id ?? reminder_id;
    const ALLOCATION_MONTH = selectedLoanData.allocation_month;
    let task_type;
    if (
        StringCompare(
            selectedLoanData.visit_purpose,
            VisitPurposeType.surprise_visit
        )
    ) {
        task_type = TaskTypes.visit;
    } else if (
        StringCompare(
            selectedLoanData.visit_purpose,
            VisitPurposeType.promise_to_pay
        )
    ) {
        task_type = TaskTypes.ptp;
    }
    const taskType = route?.params?.taskType ?? task_type;

    const {
        imageProvider,
        imageSetterProvider,
        setUpdateTaskDetails,
        updatedContactDetails,
        updatedAddressIndex,
        setVisitSubmitted
    } = useTaskAction();
    const paymentLinkBottomSheetRef = useRef<BottomSheet>(null);
    const chequeMethodBottomSheetRef = useRef<BottomSheet>(null);

    const [button, setButton] = useState(false);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [details, setDetails] = useState<LoanInternalDetailsType>();
    const [detailsLoading, setDetailsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [visit, isVisit] = useState(false);
    const [recovery, isRecovery] = useState(false);
    const [customer, isCustomer] = useState(false);
    const [paymentMode, setPaymentMode] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState(true);
    const [otpInput, setOtpInput] = useState(false);
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [resendOtpTime, setResendOtpTime] = useState(30);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [geoFencingErrors, setGeoFencingErrors] = useState(false);
    const [locationLoader, setLocationLoader] = useState(false);
    const [localLocation, setLocalLocation] = useState<LocationType>({
        latitude: 0,
        longitude: 0
    });
    const [reminderRequired, setReminderRequired] = useState(false);
    const [amountRequired, setAmountRequired] = useState(false);
    const [checkedStep, setCheckedStep] = useState('');
    const [dispositionDropdown, setDispositonDropdown] = useState<
        Array<DropDownType>
    >([]);
    const [subDispositionOneDropdown, setSubDispositionOneDropdown] = useState<
        Array<DropDownType>
    >([]);
    const [subDispositionTwoDropdown, setSubDispositionTwoDropdown] = useState<
        Array<DropDownType>
    >([]);
    const [selectedDisposition, setSelectedDisposition] =
        useState<DispositionType>();
    const [selectedDispositionOne, setSelectedDispositionOne] =
        useState<DispositionType>();
    const [selectedDispositionTwo, setSelectedDispositionTwo] =
        useState<DispositionType>();
    const [dispositon, setDisposition] = useState('');
    const [subDispositionOne, setSubDispostionOne] = useState('');
    const [subDispositionTwo, setSubDispostionTwo] = useState('');
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [committedAmount, setCommittedAmount] = useState('');
    const [transactionFormData, setTransactionFormData] = useState({});
    const [subDispositionOneReq, setSubDispositionOneReq] = useState(false);
    const [subDispositionTwoReq, setSubDispositionTwoReq] = useState(false);

    const [recVars, setRecVars] = useState({});
    const [recVarsFormData, setRecVarsFormData] = useState({});
    const [chequePaymentFormData, setChequePaymentFormData] = useState({});
    const [isBifurcatedCollection, setIsBifurcatedCollection] = useState(false);

    const bottomSheetData: TaskBottomSheetData = {
        visit_id: VISIT_ID,
        contact_number: details?.contact_number,
        email_address: details?.email_address
    };
    const proofs: Array<ImageInputType> = [
        {
            title: 'Proof of Visit',
            show: visit,
            imageTag: 'visit'
        },
        {
            title: 'Proof of Collection',
            show: recovery,
            imageTag: 'recovery'
        }
    ];

    const addressData = useMemo(() => {
        return getAddressData(ALLOCATION_MONTH, selectedLoanData.loan_id);
    }, [ALLOCATION_MONTH, selectedLoanData, loanDetailMap]);

    const convertedPrimaryAddress = getAddress(
        addressData?.applicant_type,
        details?.address?.primary
    );

    const [emailsArray, setEmailsArray] = useState<Array<string>>([]);
    const [mobilesArray, setMobilesArray] = useState<Array<string>>([]);
    const [callingHistory, setCallingHistory] = useState<any>();
    const [visitHistory, setVisitHistory] = useState([]);
    const [digitalNotice, setDigitalNotice] = useState([]);
    const [speedPost, setSpeedPost] = useState([]);
    const [isEditClicked, setIsEditClicked] = useState(true);
    const [tranasctionDetails, setTransactionDetails] = useState<
        Array<TransactionListType>
    >([]);
    const { requestLocation, allowLocationAccess } = useLocation();

    const onSetPaymentMode = (method: string) => {
        setPaymentMode(method);
        if (method === DepositTypes.online) {
            //Disable payment link bottom sheet for creditline
            // paymentLinkBottomSheetRef.current?.expand();
            chequeMethodBottomSheetRef.current?.close();
            ToastAndroid.show(
                `Use the online method for receiving money only in your company's account`,
                ToastAndroid.LONG
            );
            setIsBifurcatedCollection(false);
        } else if (method === DepositTypes.cheque) {
            isEditClicked
                ? chequeMethodBottomSheetRef.current?.snapToIndex(2)
                : chequeMethodBottomSheetRef.current?.snapToIndex(1);

            // paymentLinkBottomSheetRef.current?.close();
        } else {
            // paymentLinkBottomSheetRef.current?.close();
            chequeMethodBottomSheetRef.current?.close();
        }
    };

    const logVisitSubmissionEvent = (
        taskType: TaskTypes,
        taskData: TaskSubmitType,
        applicant_index: string,
        applicant_type: string,
        location: LocationType | any,
        address_location: LocationType | any
    ) => {
        const final_statuses = JSON.stringify({
            disposition: taskData.final_status.disposition,
            ...(taskData.final_status.sub_disposition_1.length > 0 && {
                sub_disposition_1: taskData.final_status.sub_disposition_1
            }),
            ...(taskData.final_status.sub_disposition_2.length > 0 && {
                sub_disposition_2: taskData.final_status.sub_disposition_2
            })
        });
        logEvent(TaskDetailsEventTypes.visit_submission, route.name, {
            success: false,
            value: {
                loan_id: taskData?.loan_id,
                visit_id: VISIT_ID,
                visit_purpose: taskType,
                is_visit_done: taskData.is_visit_done,
                is_recovery_done: taskData.is_recovery_done,
                is_customer_met: taskData.is_customer_met,
                amount_recovered: taskData.amount_recovered,
                payment_method: taskData.payment_method,
                agent_marked_status: final_statuses,
                marked_location: JSON.stringify(location),
                address_location: JSON.stringify(address_location),
                applicant_index: applicant_index,
                applicant_type: applicant_type,
                transactions_data: taskData.transanctions_data
            }
        });
    };

    function checkIfDateTimeValid(date: string, time: string) {
        try {
            if (
                reminderRequired &&
                reminderDate.length > 0 &&
                reminderTime.length > 0
            ) {
                const d = date.split('-');
                const t = time.split(':');
                const x = new Date(...d, ...t);
                x.setMonth(x.getMonth() - 1); // months are indexes
                return x > new Date();
            } else return true;
        } catch (e) {}
    }

    const generate_visit_otp = async () => {
        const emailBodyString = get_email_body(
            amount,
            moment(selectedLoanData.visit_date).format('DD-MM-YYYY, HH:MM:SS'),
            selectedLoanData.loan_id,
            companyName,
            authData?.name
        );
        const smsBodyString = get_sms_body(
            amount,
            moment(selectedLoanData.visit_date).format('DD-MM-YYYY, HH:MM:SS'),
            selectedLoanData.loan_id,
            companyName,
            authData?.name
        );

        if (!details?.email_address && !details?.contact_number) {
            ToastAndroid.show(
                'No Email Address and Mobile number found for OTP verification',
                ToastAndroid.LONG
            );
            return;
        }

        const VisitOtpData: VisitOtpDataType = {
            destination: VISIT_ID,
            otp_type: 'visit',
            other_fields: {
                email: emailsArray,
                mobile: mobilesArray,
                email_data: {
                    from_data: {
                        name: 'Visit Report',
                        email: 'info@credgenics.com'
                    },
                    subject: 'Field Verification OTP',
                    email_body: emailBodyString
                },
                sms_data: {
                    sms_body: smsBodyString,
                    content_template_id: SMS_CONTENT_TEMPLATE_ID,
                    principal_entity_id: SMS_PRINCIPAL_ENTITY_ID
                }
            }
        };
        try {
            const apiResponse = await generateVisitOtp(VisitOtpData);
            bottomSheetRef.current?.expand();
            setBottomSheetOpen(true);
            setOtpInput(true);
            setResendOtpTime(30);
            return apiResponse?.status;
        } catch (e) {
            if (e.response.status == 401)
                ToastAndroid.show(otp_max_try_error_string, ToastAndroid.LONG);
            else ToastAndroid.show(`Unable to send the OTP`, ToastAndroid.LONG);
            return e.response.status;
        }
    };

    const createFollowUp = (type: TaskTypes) => {
        navigation.replace('NewTaskScreen', {
            loanData: [selectedLoanData],
            taskType: type,
            ALLOCATION_MONTH
        });
    };

    function compare(a: TransactionListType, b: TransactionListType) {
        if (a.defaults.dpd > b.defaults.dpd) return -1;
        if (a.defaults.dpd < b.defaults.dpd) return 1;
        else {
            if (
                moment(a.client_loan_sanction_date) >
                moment(b.client_loan_sanction_date)
            )
                return -1;
        }
    }
    const enableSubmitButton = () => {
        if (
            (recovery && amount === '') ||
            (recovery && paymentMode === '') ||
            (recovery &&
                paymentMode === DepositTypes.cheque &&
                !(Object.keys(chequePaymentFormData)?.length > 0))
        ) {
            return true;
        }
        // check for status
        if (!recovery && Object.keys(validateDispositionForm())?.length != 0) {
            return true;
        }

        const visit_proof = checkProofAttached(visit, imageProvider('visit'));
        const recovery_proof = checkProofAttached(
            recovery,
            imageProvider('recovery')
        );
        if ((visit && !visit_proof) || (recovery && !recovery_proof)) {
            return true;
        }
        return false;
    };

    const [transactionsData, setTransactionsData] =
        useState<Array<TransactionListType>>();

    useEffect(() => {
        (async () => {
            if (!isRecoveryAmountBifurcationEnabled) return;
            try {
                const vars = await getRecVar(authData);
                const data = await getLoanDetailsFromId(
                    selectedLoanData.loan_id,
                    authData
                );

                const newObj: any = {};
                const newObjForm: any = {};

                vars.forEach((a: string) => {
                    if (data[a]) {
                        newObj[a] = data[a];
                        newObjForm[getRecoveredKey(a)] = '0';
                    }
                });

                setRecVars(newObj);
                setRecVarsFormData(newObjForm);
            } catch (e) {
                ToastAndroid.show(
                    'Error fetching recovery variables',
                    ToastAndroid.SHORT
                );
            }
        })();
    }, [isRecoveryAmountBifurcationEnabled]);

    useEffect(() => {
        if (!recovery) {
            setAmount('');
            onSetPaymentMode('');
            imageSetterProvider('recovery')('');
        }

        if (!visit) {
            imageSetterProvider('visit')('');
            if (!collectionModes.includes(DepositTypes.online)) {
                setAmount('');
                onSetPaymentMode('');
                isRecovery(false);
            }
        }
        const timer = setInterval(() => {
            const value = enableSubmitButton();
            setError(value);
        }, 500);
        return () => clearInterval(timer);
    }, [enableSubmitButton, recovery, visit, paymentMode]);
    useEffect(() => {
        const fetchTransactionData = async () => {
            try {
                const response = await getTransactionData(
                    selectedLoanData.loan_id,
                    ALLOCATION_MONTH,
                    authData
                );
                const transaction_data =
                    response?.data?.output[ALLOCATION_MONTH];
                const filteredTransactions = transaction_data?.filter(
                    (data: any) => {
                        return data.defaults.balance_claim_amount > 0;
                    }
                );
                filteredTransactions?.sort(compare);

                setTransactionsData(filteredTransactions?.sort(compare));
            } catch (e) {}
        };

        fetchTransactionData();
    }, []);

    const openConfirmModal = async () => {
        const isValid = checkIfDateTimeValid(reminderDate, reminderTime);
        if (!isValid) {
            ToastAndroid.show(
                'This time has passed, please select a future time.',
                ToastAndroid.LONG
            );
            return;
        }
        if (
            !recovery &&
            checkedStep.length > 0 &&
            (reminderDate.length == 0 || reminderTime.length == 0)
        ) {
            ToastAndroid.show(
                'Please select reminder date or time',
                ToastAndroid.SHORT
            );
            return;
        }
        if (!recovery && getDecimalCountInString(committedAmount) > 1) {
            ToastAndroid.show(
                'Please enter correct amount in Committed Amount',
                ToastAndroid.SHORT
            );
            return;
        }

        if (recovery && getDecimalCountInString(amount) > 1) {
            ToastAndroid.show(
                'Please enter correct amount in Collection Amount',
                ToastAndroid.SHORT
            );
            return;
        }

        let permission = PermissionType.DENIED;
        if (locationAccess != LocationAccessType.disable_all) {
            permission = await requestLocation();
        }

        if (permission == PermissionType.GRANTED) {
            setLocationLoader(true);
            try {
                const locationObject = await allowLocationAccess();
                if (locationObject?.isMocked) {
                    setMockLocationEnabled(true);
                    return;
                }
                const { isMocked, ...latestLocation } = locationObject.location;
                setLocalLocation(latestLocation);
                const address_location = {
                    latitude: convertedPrimaryAddress?.latitude ?? '',
                    longitude: convertedPrimaryAddress?.longitude ?? ''
                };
                const linearDistance = getStraightLineDistance(
                    address_location,
                    latestLocation
                );
                let localGeoFencingError;
                localGeoFencingError =
                    linearDistance > geofencingDistance ? true : false;
                setGeoFencingErrors(localGeoFencingError);
                if (geoFencingRequired && localGeoFencingError) {
                    setShowErrorModal(true);
                } else setShowConfirmModal(true);
            } catch (e) {
                ToastAndroid.show(
                    'Unable to fetch live location',
                    ToastAndroid.SHORT
                );
            }
            setLocationLoader(false);
        } else {
            if (locationAccess == LocationAccessType.enable_hard_prompt) {
                ToastAndroid.show(
                    'This functionality is supported only with location access',
                    ToastAndroid.LONG
                );
                return;
            } else setShowConfirmModal(true);
        }
    };

    //DISPOSITION STATUSES DROPDOWN CONFIG

    const validateDispositionForm = () => {
        let errors: DispositionFormErrorType = {};
        if (reminderDate.length == 0 && reminderRequired) {
            errors.reminder_date_required = 'Reminder date is required';
        }
        if (reminderTime.length == 0 && reminderRequired) {
            errors.reminder_time_required = 'Reminder time is required';
        }
        if (committedAmount.length == 0 && amountRequired) {
            errors.amount_required = 'Commmitted amount is required';
        }
        if (dispositon.length == 0) {
            errors.disposition = 'Disposition is required';
        }
        if (subDispositionOne.length == 0 && subDispositionOneReq) {
            errors.sub_disposition1 = 'Sub disposition 1 is required';
        }
        if (subDispositionTwo.length == 0 && subDispositionTwoReq) {
            errors.sub_disposition2 = 'Sub disposition 2 is required';
        }
        if (reminderDate.length > 0 && checkedStep.length == 0) {
            errors.checked_step = 'Checked step is required';
        }
        return errors;
    };

    const onTaskSubmitWrapper = async () => {
        if (StringCompare(ALLOCATION_MONTH, Overall)) {
            ToastAndroid.show(
                `Visit cannot be submitted at ‘Overall’ allocation month, please select an individual month.`,
                ToastAndroid.LONG
            );
            setShowConfirmModal(false);
            return;
        }
        if (!taskType) {
            ToastAndroid.show('Invalid field visit type', ToastAndroid.SHORT);
            return;
        }
        if (
            (paymentMode == DepositTypes.cash ||
                paymentMode == DepositTypes.cheque) &&
            otpVerificationRequired
        ) {
            await generate_visit_otp();
        } else {
            await onTaskSubmit();
        }
        setShowConfirmModal(false);
    };
    const convertTransaction = () => {
        let transactionDataArray: Array<TransactionFormType> = [];
        let closedStatusFlag = true;
        if (recovery && transactionFormData && transactionsData) {
            for (let i = 0; i < transactionsData?.length; i++) {
                Object.entries(transactionFormData).forEach((data) => {
                    if (
                        StringCompare(
                            transactionsData[i].transaction_id,
                            data[0]
                        ) &&
                        data[1] > 0
                    ) {
                        let status = '';
                        if (
                            parseInt(data[1]) >=
                            transactionsData[i].defaults.balance_claim_amount
                        ) {
                            status = LOAN_STATUS_TEXT[0];
                        } else {
                            status = LOAN_STATUS_TEXT[1];
                            closedStatusFlag = false;
                        }
                        let tempTransaction: TransactionFormType = {
                            transaction_id: data[0],
                            transaction_amount_recovered: data[1] ? data[1] : 0,
                            transaction_status: status
                        };

                        transactionDataArray.push(tempTransaction);
                    }
                });
            }
        }
        let final_status = closedStatusFlag
            ? LOAN_STATUS_TEXT[0]
            : LOAN_STATUS_TEXT[1];

        return [transactionDataArray, final_status];
    };

    const onTaskSubmit = async (): Promise<void> => {
        setLoading(true);
        setShowConfirmModal(false);
        let [transactionDataArray, final_status] = convertTransaction();
        const taskData: TaskSubmitType = {
            loan_id: selectedLoanData.loan_id ?? '',
            visit_id: VISIT_ID,
            is_visit_done: visit,
            is_recovery_done: recovery,
            is_customer_met: customer,
            reminder_id: REMINDER_ID ?? '',
            amount_recovered: getValidAmountString(amount),
            payment_method: paymentMode,
            visit_proof_file: '',
            payment_proof_file: '',
            final_status: {
                disposition: !recovery
                    ? selectedDisposition?.text ?? ''
                    : final_status,
                sub_disposition_1: !recovery
                    ? selectedDispositionOne?.text ?? ''
                    : '',
                sub_disposition_2: !recovery
                    ? selectedDispositionTwo?.text ?? ''
                    : ''
            },
            comment: comment.trim(),
            address_index: selectedLoanData.address_index ?? 0,
            committed_amount: getValidAmountString(committedAmount) ?? '',
            transanctions_data: transactionDataArray
        };

        const visit_proof = checkProofAttached(visit, imageProvider('visit'));
        const recovery_proof = checkProofAttached(
            recovery,
            imageProvider('recovery')
        );
        taskData.payment_proof_file =
            recovery_proof !== true ? recovery_proof : '';
        taskData.visit_proof_file = visit_proof !== true ? visit_proof : '';

        let address_location = {};
        if (details?.address?.primary) {
            if (
                convertedPrimaryAddress?.latitude &&
                convertedPrimaryAddress?.longitude
            ) {
                address_location = {
                    latitude: convertedPrimaryAddress?.latitude ?? '',
                    longitude: convertedPrimaryAddress?.longitude ?? ''
                };
            }
        }
        logVisitSubmissionEvent(
            taskType,
            taskData,
            String(selectedLoanData?.applicant_index),
            selectedLoanData?.applicant_type,
            localLocation,
            address_location
        );

        try {
            const apiResponse = await closeVisit(
                taskType,
                taskData,
                VISIT_ID,
                recVarsFormData,
                isBifurcatedCollection,
                addressData?.applicant_index ?? -1,
                addressData?.applicant_type,
                localLocation,
                address_location,
                ALLOCATION_MONTH,
                selectedLoanData?.applicant_name,
                convertedPrimaryAddress?.address_text,
                recovery,
                authData,
                chequePaymentFormData
            );
            if (apiResponse?.success) {
                const message = apiResponse?.message;
                logEvent(
                    TaskDetailsEventTypes.visit_submission_api,
                    route.name,
                    {
                        success: apiResponse?.success ?? '',
                        value: {
                            data: apiResponse?.data ?? {},
                            message
                        },
                        visit_id: VISIT_ID
                    }
                );

                setVisitSubmitted(true);
                if (
                    apiResponse?.data?.collection_receipt &&
                    !apiResponse?.data?.collection_receipt?.success
                ) {
                    ToastAndroid.show(
                        apiResponse?.data?.collection_receipt?.message,
                        ToastAndroid.SHORT
                    );
                }
                if (
                    apiResponse?.data?.mark_location &&
                    !apiResponse?.data?.mark_location?.success
                ) {
                    ToastAndroid.show(
                        apiResponse?.data?.mark_location?.message,
                        ToastAndroid.SHORT
                    );
                }

                const close = () => {
                    setMessage(message);
                    setButton(true);
                    setVisible(true);
                    setUpdateTaskDetails(selectedLoanData);
                };

                if (isFeedbackResponseNeeded) {
                    Alert.alert(
                        'Feedback Form',
                        'Please fill the survey form',
                        [
                            {
                                text: 'Fill Now',
                                onPress: () => {
                                    navigation.navigate('QuestionnaireScreen', {
                                        visitId: VISIT_ID,
                                        modal: true,
                                        modalDetails: {
                                            message,
                                            selectedLoanData
                                        },
                                        ALLOCATION_MONTH
                                    });
                                }
                            },
                            {
                                text: 'Fill Later',
                                style: 'cancel',
                                onPress: () => close()
                            }
                        ],
                        {
                            cancelable: false
                        }
                    );
                } else {
                    close();
                }
            }
        } catch (error) {
            logEvent(TaskDetailsEventTypes.visit_submission_api, route.name, {
                success: false,
                value: {
                    message: error ?? ''
                }
            });
        }

        if (reminderDate.length > 0) {
            let apiRemindertime = reminderTime;
            if (reminderTime.length == 0) apiRemindertime = '00:00:00';
            const newReminderBody = {
                reminder_status: selectedDisposition?.text ?? '',
                reminder_date: `${reminderDate} ${apiRemindertime}`,
                reminder_from: 'field_visit',
                next_step: checkedStep == 'Visit' ? 'field_visit' : 'call',
                source: 'fos_app',
                comment: comment.trim(),
                shoot_id: VISIT_ID
            };
            if (checkedStep === 'Call') {
                try {
                    const createNewReminderResponse = await createNewReminder(
                        newReminderBody,
                        selectedLoanData.loan_id,
                        ALLOCATION_MONTH,
                        authData
                    );
                    if (createNewReminderResponse?.data) {
                        ToastAndroid.show(
                            createNewReminderResponse.data?.output ??
                                'Reminder created successfully',
                            ToastAndroid.SHORT
                        );
                    }
                } catch (e) {
                    ToastAndroid.show(
                        'Some error occurred',
                        ToastAndroid.SHORT
                    );
                }
            } else if (checkedStep == 'Visit') {
                const isPTP = checkIfStatusIsPTP(
                    selectedDisposition,
                    selectedDispositionOne,
                    selectedDispositionTwo
                );
                if (isPTP) {
                    try {
                        const newReminderRes = await createNewReminder(
                            newReminderBody,
                            selectedLoanData.loan_id,
                            ALLOCATION_MONTH,
                            authData
                        );
                        ToastAndroid.show(
                            newReminderRes?.data?.output ??
                                'Reminder created successfully',
                            ToastAndroid.SHORT
                        );
                        if (newReminderRes?.data) {
                            try {
                                const newTaskResponse = await createTask(
                                    {
                                        loan_id: selectedLoanData.loan_id,
                                        visit_date: `${reminderDate} ${apiRemindertime}`,
                                        address_index:
                                            selectedLoanData.address_index,
                                        applicant_index:
                                            selectedLoanData.applicant_index,
                                        applicant_name:
                                            selectedLoanData.applicant_name,
                                        applicant_type:
                                            selectedLoanData.applicant_type,
                                        comment: comment.trim()
                                    } as VisitData,
                                    ALLOCATION_MONTH,
                                    TaskTypes.ptp,
                                    authData,
                                    false,
                                    ReminderFromType.field_visit,
                                    newReminderRes.data.reminder_id ?? ''
                                );
                                if (newTaskResponse?.success) {
                                    ToastAndroid.show(
                                        newTaskResponse?.message ??
                                            'Visit/PTP submitted successfully',
                                        ToastAndroid.SHORT
                                    );
                                }
                            } catch (e) {}
                        }
                    } catch (e) {}
                } else {
                    try {
                        const newReminderRes = await createNewReminder(
                            newReminderBody,
                            selectedLoanData.loan_id,
                            ALLOCATION_MONTH,
                            authData
                        );
                        if (newReminderRes?.data) {
                            if (!newReminderRes?.data) {
                                ToastAndroid.show(
                                    'Reminder Created successfully',
                                    ToastAndroid.SHORT
                                );
                                return;
                            }
                            try {
                                const newTaskResponse = await createTask(
                                    {
                                        loan_id: selectedLoanData.loan_id,
                                        visit_date: `${reminderDate} ${apiRemindertime}`,
                                        address_index:
                                            selectedLoanData.address_index,
                                        applicant_index:
                                            selectedLoanData.applicant_index,
                                        applicant_name:
                                            selectedLoanData.applicant_name,
                                        applicant_type:
                                            selectedLoanData.applicant_type,
                                        comment: comment.trim()
                                    } as VisitData,
                                    ALLOCATION_MONTH,
                                    TaskTypes.visit,
                                    authData,
                                    false,
                                    ReminderFromType.field_visit,
                                    newReminderRes.data.reminder_id ?? ''
                                );
                                if (newTaskResponse?.success) {
                                    ToastAndroid.show(
                                        newTaskResponse?.message ?? 'Success',
                                        ToastAndroid.SHORT
                                    );
                                }
                            } catch (e) {}
                        }
                    } catch (e: any) {
                        ToastAndroid.show(
                            e?.response?.message ?? 'Error',
                            ToastAndroid.SHORT
                        );
                    }
                }
            }
        }
        setLoading(false);
    };
    //RESET IMAGE FIELDS
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            imageSetterProvider('visit')('');
            imageSetterProvider('recovery')('');
            imageSetterProvider('deposit')('');
        });
        return unsubscribe;
    }, [navigation]);

    //LOAD STATUS LIST FOR TASK DETAIL

    useEffect(() => {
        setEmailsArray([...(details?.email_address?.split(',') ?? [''])]);
        setMobilesArray([...(details?.contact_number?.split(',') ?? [''])]);
    }, [details]);

    //LOAD TASK DETAILS
    useEffect(() => {
        if (updatedAddressIndex) {
            fetchTaskDetails();
        }
    }, [updatedAddressIndex, updatedContactDetails, selectedLoanData]);

    const fetchTaskDetails = async () => {
        setDetailsLoading(true);

        try {
            const [profileApiResponse, transactionApiResponse] =
                await Promise.all([
                    getLoanDetailsWithLoan(
                        [
                            {
                                loan_id: selectedLoanData.loan_id,
                                allocation_month: ALLOCATION_MONTH
                            }
                        ],
                        authData
                    ),
                    getTransactionList(
                        ALLOCATION_MONTH,
                        selectedLoanData.loan_id,
                        authData
                    )
                ]);
            let totalLoanAmount = 0;
            let totalClaimAmount = 0;
            let amountRecovered = 0;
            if (transactionApiResponse?.data) {
                let data =
                    transactionApiResponse?.data.output[ALLOCATION_MONTH];
                data.forEach((_item: TransactionListType) => {
                    totalLoanAmount += parseInt(_item?.total_loan_amount);
                    totalClaimAmount += parseInt(
                        _item?.defaults?.total_claim_amount
                    );
                    amountRecovered += parseInt(
                        _item?.defaults?.amount_recovered
                    );
                });
                setTransactionDetails(
                    transactionApiResponse?.data.output[ALLOCATION_MONTH]
                );
            }
            if (profileApiResponse) {
                const customer_details = await modifyReduxCustomerDetails(
                    profileApiResponse[selectedLoanData.loan_id],
                    selectedLoanData,
                    ALLOCATION_MONTH,
                    totalLoanAmount,
                    totalClaimAmount,
                    amountRecovered
                );
                setDetails(customer_details);
            }
        } catch (e) {
            ToastAndroid.show(
                e?.response?.data?.output ?? SOMETHING_WENT_WRONG,
                ToastAndroid.SHORT
            );
        }
        try {
            const [
                callingApiResponse,
                visitHistoryApiResponse,
                digitalNoticeApiResponse,
                speedPostApiResponse
            ] = await Promise.all([
                getCallingHistory(selectedLoanData.loan_id, authData),
                getFieldVisitHistory(selectedLoanData.loan_id, authData),
                getDigitalNotice(
                    selectedLoanData.loan_id,
                    ALLOCATION_MONTH,
                    authData
                ),
                getSpeedPost(
                    selectedLoanData.loan_id,
                    ALLOCATION_MONTH,
                    authData
                )
            ]);
            if (callingApiResponse?.success) {
                const tempHis = modifyCallingHistory(
                    callingApiResponse?.data ?? []
                );
                setCallingHistory(tempHis);
            }

            if (visitHistoryApiResponse?.data) {
                setVisitHistory(visitHistoryApiResponse?.data ?? []);
            }
            if (digitalNoticeApiResponse?.data) {
                setDigitalNotice(digitalNoticeApiResponse?.data?.output ?? []);
            }
            if (speedPostApiResponse?.data) {
                setSpeedPost(speedPostApiResponse?.data?.output ?? []);
            }
        } catch (e: any) {
            let msg = SOMETHING_WENT_WRONG;
            ToastAndroid.show(
                e?.response?.data?.output ?? e?.response?.data?.message ?? msg,
                ToastAndroid.SHORT
            );
        }
        setDetailsLoading(false);
    };

    const updateLoanDetails = async () => {
        try {
            const response = await getLoanDetailsWithLoan(
                [
                    {
                        loan_id: selectedLoanData.loan_id,
                        allocation_month: selectedLoanData.allocation_month
                    }
                ],
                authData
            );
            setLoanDetailMap({
                [selectedLoanData.loan_id]: response[selectedLoanData.loan_id]
            });
        } catch {}
    };

    useEffect(() => {
        if (isInternetAvailable) updateLoanDetails();
    }, [newAddressAdded]);

    useEffect(() => {
        fetchTaskDetails();
    }, [selectedLoanData, updatedContactDetails]);

    let modalExtraProps = null;
    if (button)
        modalExtraProps = (
            <View style={styles.followContainer}>
                <Typography
                    variant={TypographyVariants.body1}
                    style={styles.followUpText}
                >
                    Create follow up
                </Typography>
                <View style={styles.followUpButtonContainer}>
                    <TouchableOpacity
                        onPress={() => createFollowUp(TaskTypes.visit)}
                        activeOpacity={0.6}
                    >
                        <Typography
                            variant={TypographyVariants.body2}
                            style={styles.followUpButton}
                        >
                            Visit
                        </Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => createFollowUp(TaskTypes.ptp)}
                        activeOpacity={0.6}
                    >
                        <Typography
                            variant={TypographyVariants.body2}
                            style={styles.followUpButton}
                        >
                            PTP
                        </Typography>
                    </TouchableOpacity>
                </View>
            </View>
        );

    //BottomSheetConfig
    const bottomSheetRef = useRef<BottomSheet>(null);
    useEffect(() => {
        const backAction = () => {
            chequeMethodBottomSheetRef.current?.close();
            if (bottomSheetOpen) {
                bottomSheetRef.current?.close();
                setBottomSheetOpen(false);
                setOtpInput(false);
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [bottomSheetRef, bottomSheetOpen, chequeMethodBottomSheetRef]);

    const CustomHeaderString =
        'Are you sure you want to submit the Visit Form?';
    const CustomHeaderComponent = () => (
        <View>
            {parseInt(getValidAmountString(amount)) > 0 ? (
                <Typography
                    style={[
                        styles.headerText,
                        {
                            marginBottom: RFPercentage(1),
                            fontSize: RFPercentage(2.1)
                        }
                    ]}
                >{`Amount Collected: ${getCurrencyString(
                    getValidAmountString(amount)
                )}`}</Typography>
            ) : null}
            <Typography style={styles.headerText}>
                {CustomHeaderString}
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
            buttonFunction: onTaskSubmitWrapper
        }
    ];

    const checkVisitType = (modalExtraProps: any) => {
        if (
            (reminderDate.length == 0 && reminderTime.length == 0) ||
            checkedStep == 'Call'
        ) {
            return modalExtraProps;
        }
        return null;
    };

    const CustomErrorHeaderModal = () => {
        return (
            <View>
                <Typography
                    style={[styles.headerText, { lineHeight: RFPercentage(3) }]}
                >
                    {`Not allowed to close the visit outside the allowed distance from the customer.`}
                </Typography>
            </View>
        );
    };
    const CustomModalErrorData: Array<ModalButtonType> = [
        {
            buttonText: 'Okay',
            buttonFunction: () => {
                setShowErrorModal(false);
            },
            buttonTextStyle: styles.buttonTwoText,
            buttonStyle: styles.buttonTwoContainer
        }
    ];

    let extraStyles = {};
    if (recovery && paymentMode == DepositTypes.online) {
        extraStyles = { paddingBottom: '10%' };
    }
    const setIsBifurcatedCollectionWrapper = (updatedIsBifColl: boolean) => {
        if (updatedIsBifColl) {
            let total = 0;
            Object.values(recVarsFormData).forEach(
                (data) => (total += parseInt(data as string))
            );
            setAmount(String(total));
        }
        setIsBifurcatedCollection(updatedIsBifColl);
    };
    const filteredCollectionModes = useMemo(() => {
        return visit
            ? collectionModes
            : collectionModes.filter((mode) => mode === DepositTypes.online);
    }, [collectionModes, visit]);

    const showBifurcation = useMemo(() => {
        let _showBifurcation =
            paymentMode != DepositTypes.online &&
            isRecoveryAmountBifurcationEnabled;

        if (
            _showBifurcation &&
            filteredCollectionModes.length == 1 &&
            filteredCollectionModes[0] == DepositTypes.online
        ) {
            _showBifurcation = false;
        }
        return _showBifurcation;
    }, [
        paymentMode,
        filteredCollectionModes,
        isRecoveryAmountBifurcationEnabled
    ]);

    return (
        <>
            <ClosedLoanErrorModal
                visible={StringCompare(
                    details?.loan_details[0]?.final_status,
                    LoanStatusType.closed
                )}
                navigation={navigation}
            />

            <CustomAppBar
                title={selectedLoanData.applicant_name}
                subtitle={`Customer Id: ${selectedLoanData.loan_id}`}
                headerImage={details?.applicant_photo_link || 'default'}
                filter={false}
                sort={false}
                search={false}
                backButton={true}
                add={false}
                calendar={false}
                notifications={false}
                options={false}
                talkingPoints={details?.loan_details[0]?.talking_point}
            />

            {detailsLoading && (
                <View style={styles.loaderStyle}>
                    <CustomActivityIndicator />
                </View>
            )}
            {locationLoader && (
                <ProgressDialog
                    title="Fetching your location"
                    visible={locationLoader}
                />
            )}
            {!detailsLoading && (
                <>
                    <CustomModal
                        visible={showConfirmModal}
                        dismissable={false}
                        HeaderComponent={CustomHeaderComponent}
                        data={CustomModaldata}
                    />
                    <CustomModal
                        visible={showErrorModal}
                        dismissable={false}
                        HeaderComponent={CustomErrorHeaderModal}
                        data={CustomModalErrorData}
                    />
                    <ResultModal
                        visible={visible}
                        message={message}
                        buttonText={button ? 'DONE' : 'CLOSE'}
                        positive={button}
                        extra={checkVisitType(modalExtraProps)}
                        onDone={() => {
                            setVisible(false);
                            if (navigation.canGoBack()) navigation.goBack();
                        }}
                    />
                    <ProgressDialog title="Submitting..." visible={loading} />
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <ScrollView
                            contentContainerStyle={[
                                styles.contentStyle,
                                extraStyles
                            ]}
                        >
                            <View style={{ flex: 1 }}>
                                <DetailsHeader
                                    loanData={selectedLoanData}
                                    tabDetails={details}
                                    callingHistory={callingHistory}
                                    transactionDetails={tranasctionDetails}
                                    digitalNoticeHistory={digitalNotice}
                                    speedPostHistory={speedPost}
                                    visitHistory={visitHistory}
                                    allocation_month={ALLOCATION_MONTH}
                                    addressData={addressData}
                                />
                                <View
                                    style={{
                                        paddingHorizontal: RFPercentage(1)
                                    }}
                                >
                                    <View style={styles.checkboxContainer}>
                                        <CustomRadioButton
                                            checked={visit}
                                            buttons={[true, false]}
                                            optionColors={radioButtonColors}
                                            setChecked={isVisit}
                                            label="Visit Done"
                                        />
                                        <CustomRadioButton
                                            checked={customer && visit}
                                            buttons={[true, false]}
                                            optionColors={radioButtonColors}
                                            setChecked={isCustomer}
                                            label="Customer Met"
                                        />
                                        <CustomRadioButton
                                            checked={recovery}
                                            buttons={[true, false]}
                                            optionColors={radioButtonColors}
                                            setChecked={isRecovery}
                                            label="Amount Collected"
                                        />
                                    </View>

                                    <View>
                                        <HorizontalLineContainer />
                                        {!recovery ? (
                                            <>
                                                <Typography
                                                    variant={
                                                        TypographyVariants.title1
                                                    }
                                                    style={{
                                                        paddingLeft:
                                                            RFPercentage(3),
                                                        marginBottom:
                                                            RFPercentage(1)
                                                    }}
                                                >
                                                    Status
                                                </Typography>
                                                <DispositionDropdown
                                                    setSelectedDisposition={
                                                        setSelectedDisposition
                                                    }
                                                    setSelectedDispositionOne={
                                                        setSelectedDispositionOne
                                                    }
                                                    setSelectedDispositionTwo={
                                                        setSelectedDispositionTwo
                                                    }
                                                    selectedDispositionOne={
                                                        selectedDispositionOne
                                                    }
                                                    selectedDispositionTwo={
                                                        selectedDispositionTwo
                                                    }
                                                    disposition={dispositon}
                                                    subDispositionOne={
                                                        subDispositionOne
                                                    }
                                                    subDispositionTwo={
                                                        subDispositionTwo
                                                    }
                                                    dispositionDropdown={
                                                        dispositionDropdown
                                                    }
                                                    subDispositionOneDropdown={
                                                        subDispositionOneDropdown
                                                    }
                                                    subDispositionTwoDropdown={
                                                        subDispositionTwoDropdown
                                                    }
                                                    setReminderDate={
                                                        setReminderDate
                                                    }
                                                    setReminderTime={
                                                        setReminderTime
                                                    }
                                                    reminderRequired={
                                                        reminderRequired
                                                    }
                                                    amountRequired={
                                                        amountRequired
                                                    }
                                                    amount={committedAmount}
                                                    setAmountRequired={
                                                        setAmountRequired
                                                    }
                                                    setReminderRequired={
                                                        setReminderRequired
                                                    }
                                                    setSubDispositionOneDropdown={
                                                        setSubDispositionOneDropdown
                                                    }
                                                    setSubDispositionTwoDropdown={
                                                        setSubDispositionTwoDropdown
                                                    }
                                                    setDispositonDropdown={
                                                        setDispositonDropdown
                                                    }
                                                    setDisposition={
                                                        setDisposition
                                                    }
                                                    setSubDispostionOne={
                                                        setSubDispostionOne
                                                    }
                                                    setSubDispostionTwo={
                                                        setSubDispostionTwo
                                                    }
                                                    setAmount={
                                                        setCommittedAmount
                                                    }
                                                    checkedStep={checkedStep}
                                                    setCheckedStep={
                                                        setCheckedStep
                                                    }
                                                    setSubDispositionOneReq={
                                                        setSubDispositionOneReq
                                                    }
                                                    setSubDispositionTwoReq={
                                                        setSubDispositionTwoReq
                                                    }
                                                />
                                            </>
                                        ) : null}
                                    </View>

                                    {recovery && (
                                        <>
                                            <CollectionAmountHeading
                                                showBifurcation={
                                                    showBifurcation
                                                }
                                                isBifurcatedCollection={
                                                    isBifurcatedCollection
                                                }
                                                setIsBifurcatedCollection={
                                                    setIsBifurcatedCollectionWrapper
                                                }
                                            />
                                            <CollectionAmountInput
                                                disabled={
                                                    isBifurcatedCollection &&
                                                    showBifurcation
                                                }
                                                loading={loading}
                                                amount={amount}
                                                setAmount={setAmount}
                                            />

                                            <>
                                                <TransactionTable
                                                    transactionData={
                                                        transactionsData
                                                    }
                                                    setTransactionData={
                                                        setTransactionsData
                                                    }
                                                    amount={parseInt(amount)}
                                                    transactionFormData={
                                                        transactionFormData
                                                    }
                                                    setTransactionFormData={
                                                        setTransactionFormData
                                                    }
                                                />
                                                <HorizontalLineContainer />
                                            </>
                                        </>
                                    )}
                                    {recovery && (
                                        <>
                                            <CustomRadioButton
                                                checked={paymentMode}
                                                buttons={
                                                    filteredCollectionModes
                                                }
                                                setChecked={onSetPaymentMode}
                                            />
                                            {Object.keys(chequePaymentFormData)
                                                .length > 0 ? (
                                                <View
                                                    style={
                                                        styles.captionWrapper
                                                    }
                                                >
                                                    <GreenTickIcon />
                                                    <Typography
                                                        variant={
                                                            TypographyVariants.caption
                                                        }
                                                        style={
                                                            styles.captionText
                                                        }
                                                    >
                                                        Added cheque details
                                                        successfully.
                                                    </Typography>
                                                    <TouchableOpacity
                                                        activeOpacity={0.7}
                                                        onPress={() =>
                                                            onSetPaymentMode(
                                                                DepositTypes.cheque
                                                            )
                                                        }
                                                    >
                                                        <Typography
                                                            variant={
                                                                TypographyVariants.caption
                                                            }
                                                            style={
                                                                styles.captionViewText
                                                            }
                                                        >
                                                            View
                                                        </Typography>
                                                    </TouchableOpacity>
                                                </View>
                                            ) : null}
                                        </>
                                    )}

                                    {(visit || recovery) && (
                                        <ProofSelectorContainer
                                            proofs={proofs}
                                        />
                                    )}
                                    <InputWithLabel
                                        containerStyle={{
                                            marginTop: RFPercentage(2)
                                        }}
                                        label="Add Comment..."
                                        value={comment}
                                        setText={setComment}
                                        multiline={true}
                                        numberOfLines={3}
                                    />
                                </View>
                                <View style={styles.buttonWrapper}>
                                    <CustomButton
                                        title="Submit"
                                        onPress={openConfirmModal}
                                        disabled={error}
                                    />
                                    {/* <View style={{ marginRight: 10 }}>
                                        <CustomButton
                                            title="Done"
                                            onPress={onTaskSubmit}
                                            disabled={error}
                                        />
                                    </View> */}
                                    {/* TODO: Add Skip functionality */}
                                    {/* <CustomButton
                                        title="Skip"
                                        onPress={onTaskSubmit}
                                        type="transparent"
                                    /> */}
                                </View>
                            </View>
                        </ScrollView>
                        <PaymentLinkBottomSheet
                            emailIds={emailsArray}
                            mobileNumbers={mobilesArray}
                            allocationMonth={ALLOCATION_MONTH}
                            loanData={selectedLoanData}
                            ref={paymentLinkBottomSheetRef}
                            setMobileArray={setMobilesArray}
                            setEmailArray={setEmailsArray}
                            loanDetails={details}
                            collectionAmount={amount ?? ''}
                            visit_id={VISIT_ID}
                        />
                        <ChequeMethodBottomSheet
                            ref={chequeMethodBottomSheetRef}
                            chequePaymentFormData={chequePaymentFormData}
                            setChequePaymentFormData={setChequePaymentFormData}
                            isEditClicked={isEditClicked}
                            setIsEditClicked={setIsEditClicked}
                        />
                    </View>
                </>
            )}
            <TaskBottomSheet
                otpInput={otpInput}
                ref={bottomSheetRef}
                data={bottomSheetData}
                resendOtp={generate_visit_otp}
                taskSubmit={onTaskSubmit}
                resendTime={resendOtpTime}
                setResendTime={setResendOtpTime}
                type={OtpVerifyTypes.visit}
            />
        </>
    );
}

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
    buttonTitle: {
        fontFamily: 'poppins',
        fontSize: 24
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
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: RFPercentage(2)
    },
    captionText: {
        color: Colors.light.text,
        fontSize: 13,
        marginLeft: 5
    },
    captionViewText: {
        color: BLUE_3,
        fontSize: 13,
        marginLeft: 5,
        textDecorationLine: 'underline'
    },
    captionWrapper: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginHorizontal: RFPercentage(2)
    },
    commentBox: {
        backgroundColor: Colors.table.grey,
        borderColor: Colors.common.blue,
        borderRadius: 8,
        borderWidth: 1,
        fontFamily: TypographyFontFamily.medium,
        margin: 0,
        marginVertical: RFPercentage(1.5),
        minWidth: RFPercentage(20),
        paddingHorizontal: RFPercentage(4)
    },
    container: {
        // flex: 1,
        paddingVertical: RFPercentage(2),
        paddingHorizontal: RFPercentage(0.5)
        // backgroundColor: '#f6f8fb'
    },
    contentStyle: {
        backgroundColor: 'white',
        flexGrow: 1
    },
    datePickerContainer: {
        marginVertical: 0,
        minHeight: 45,
        paddingHorizontal: RFPercentage(3),
        padding: 0
    },
    doneButton: {
        alignSelf: 'center',
        backgroundColor: BLUE_DARK,
        borderRadius: 4,
        marginVertical: RFPercentage(2),
        width: RFPercentage(20)
    },
    dropDownContainer: {
        borderColor: '#043E90',
        marginHorizontal: 0
    },
    dropdownStyle: {
        flexDirection: 'column',
        padding: 5
    },
    error: {
        color: 'red',
        marginTop: RFPercentage(0.2)
    },
    followContainer: {
        alignItems: 'center',
        marginVertical: RFPercentage(2),
        paddingBottom: RFPercentage(3),
        width: '80%'
    },
    followUpButton: {
        backgroundColor: BLUE_DARK,
        borderRadius: RFPercentage(1),
        color: 'white',
        paddingHorizontal: RFPercentage(4),
        paddingVertical: RFPercentage(1)
    },
    followUpButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    followUpText: {
        marginBottom: 16
    },
    formLabel: {
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(2)
    },
    formLabelContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start'
    },
    formRowContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal: RFPercentage(3)
    },
    geoFenceError: {
        color: 'red',
        fontSize: RFPercentage(1.7),
        marginBottom: RFPercentage(0.6),
        textAlign: 'center'
    },
    headerText: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2.1),
        lineHeight: RFPercentage(3.5),
        textAlign: 'center'
    },
    inputBox: {
        flexDirection: 'row',
        flex: 1
    },
    inputContainer: {
        backgroundColor: Colors.table.grey,
        borderColor: Colors.common.blue,
        borderRadius: 8,
        borderWidth: 1,
        fontFamily: TypographyFontFamily.medium,
        height: 40,
        margin: 0,
        marginVertical: RFPercentage(1.5),
        minWidth: RFPercentage(19),
        paddingHorizontal: RFPercentage(1)
    },
    loader: {
        backgroundColor: '#F6F8FB',
        flex: 1,
        justifyContent: 'center'
    },
    loaderStyle: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center'
    }
});
