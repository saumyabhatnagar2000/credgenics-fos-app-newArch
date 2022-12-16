import React, { useEffect, useState } from 'react';
import {
    BackHandler,
    StyleSheet,
    TextInput,
    ToastAndroid,
    View
} from 'react-native';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors, { BLUE_DARK } from '../../constants/Colors';
import { CustomRadioButton } from '../ui/CustomRadioButton';
import { Button } from '@rneui/base';
import DateTimeInputBox from '../common/DateTimePicker';
import { useAuth } from '../../hooks/useAuth';
import {
    createNewReminder,
    getDispositionStatus,
    submitDisposition
} from '../../services/callingService';
import {
    DispositionFormErrorType,
    DispositionType,
    DropDownType
} from '../../../types';
import { CustomDropDown } from '../common/DropDown';
import {
    CompanyType,
    DispositionServiceType,
    LoanStatusType,
    ReminderFromType,
    TaskTypes
} from '../../../enums';
import { useNavigation } from '@react-navigation/native';
import { CustomActivityIndicator } from '../placeholders/CustomActivityIndicator';
import { ScrollView } from 'react-native-gesture-handler';
import { VisitData } from '../../../types';
import useLoanDetails from '../../hooks/useLoanData';
import {
    createTask,
    getCustomerProfile,
    getLoanProfile
} from '../../services/portfolioService';
import {
    checkIfStatusIsPTP,
    getTommorowDateTime,
    getValidAmountString,
    StringCompare
} from '../../services/utils';
import {
    modifyCustomerDetails,
    modifyLoanDetails
} from '../../constants/ModifyData';
import { SimpleAlertDialog } from '../common/Dialogs/SimplerAlertDialog';
import {
    LOAN_IS_CLOSED,
    SOMETHING_WENT_WRONG
} from '../../constants/constants';
import ClosedLoanErrorModal from '../modals/ClosedLoanErrorModal';

const tommorrowDate = getTommorowDateTime();

export const DispostionForm = ({
    shootId,
    phoneNumber
}: {
    shootId: string;
    phoneNumber: string;
}) => {
    const [dispositionOpen, setDispositionOpen] = useState(false);
    const [subDispositionOneOpen, setSubDispositionOneOpen] = useState(false);
    const [subDispositionTwoOpen, setSubDispositionTwoOpen] = useState(false);
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [amount, setAmount] = useState('');
    const [comment, setComment] = useState('');
    const [dispositon, setDisposoition] = useState('');

    const { selectedLoanData } = useLoanDetails();
    const { authData, companyType } = useAuth();
    const RadioButtonArray = ['Visit', 'Call'];
    const [checkedStep, setCheckedStep] = useState('');
    const [dispositionID, setDispositionID] = useState('');
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
    const [dispositionList, setDispositionList] = useState<
        Array<DispositionType>
    >([]);
    const [subDispositionOneList, setSubDipositionOneList] = useState<
        Array<DispositionType>
    >([]);
    const [subDispositionTwoList, setSubDipositionTwoList] = useState<
        Array<DispositionType>
    >([]);
    const [subDispositionOneReq, setSubDispositionOneReq] = useState(false);
    const [subDispositionTwoReq, setSubDispositionTwoReq] = useState(false);
    const [subDispositionOne, setSubDispostionOne] = useState('');
    const [subDispositionTwo, setSubDispostionTwo] = useState('');
    const [reminderRequired, setReminderRequired] = useState(false);
    const [amountRequired, setAmountRequired] = useState(false);
    const [remarkRequired, setRemarkRequired] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlertDialog, setShowAlertDialog] = useState(false);

    const navigation = useNavigation();
    const [errorObject, setErrorsObject] = useState<DispositionFormErrorType>(
        {}
    );
    const loanData = selectedLoanData;

    const allocationMonth = loanData?.allocation_month;
    const loanId = loanData?.loan_id;
    const addressIndex = loanData?.address_index;
    const applicantIndex = loanData?.applicant_index;
    const applicantName = loanData?.applicant_name;
    const applicantType = loanData?.applicant_type;

    const navigateToHome = () => {
        navigation.reset({
            index: 0,
            routes: [
                {
                    name: 'Drawer'
                }
            ]
        });
    };

    const validateForm = () => {
        let errors: DispositionFormErrorType = {};
        if (reminderDate.length == 0 && reminderRequired) {
            errors.reminder_date_required = 'Reminder date is required';
        }
        if (reminderTime.length == 0 && reminderRequired) {
            errors.reminder_time_required = 'Reminder time is required';
        }
        if (amount.length == 0 && amountRequired) {
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
        if (comment.length == 0 && remarkRequired)
            errors.remark_required = 'Remark/Comment is required';
        return errors;
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

    const getDipositionObject = (id: string, list: Array<DispositionType>) => {
        let dummmyObject;
        list.map((status) => {
            if (status.id == id) {
                dummmyObject = status;
            }
        });
        return dummmyObject;
    };

    const handleDispositionChange = async (id: string) => {
        const tempSelected: DispositionType = getDipositionObject(
            id,
            dispositionList
        );
        setErrorsObject({});
        setSelectedDisposition(tempSelected);
        setDispositionID(id);
        setAmountRequired(tempSelected.committed_amount_required);
        setReminderRequired(tempSelected.reminder_required);
        setSubDispositionOneReq(tempSelected.sub_disposition_required);
        setRemarkRequired(tempSelected.remark_required);
        if (selectedDispositionTwo) setSelectedDispositionTwo({});
        if (selectedDispositionOne) setSelectedDispositionOne({});

        try {
            const apiResponse = await getDispositionStatus(
                DispositionServiceType.calling,
                false,
                authData,
                id
            );
            if (apiResponse) {
                if (apiResponse?.data?.subdispositions.length > 0) {
                    setSubDipositionOneList(apiResponse.data?.subdispositions);
                    let dummySubDispositon: Array<DropDownType> = [];
                    apiResponse.data.subdispositions.map(
                        (item: DispositionType) => {
                            dummySubDispositon.push({
                                label: item.text,
                                value: item.id
                            });
                        }
                    );
                    setSubDispositionOneDropdown(dummySubDispositon);
                } else {
                    setSubDispositionOneDropdown([]);
                    setSubDispositionTwoDropdown([]);
                }
            }
        } catch (e) {
            ToastAndroid.show('Error fetching status', ToastAndroid.SHORT);
        }
    };

    const handleSubDispositionOneChange = async (id: string) => {
        setErrorsObject({});
        setSelectedDispositionOne(
            getDipositionObject(id, subDispositionOneList)
        );
        const tempSelected: DispositionType = getDipositionObject(
            id,
            subDispositionOneList
        );

        if (!amountRequired)
            setAmountRequired(tempSelected.committed_amount_required);
        if (!reminderRequired)
            setReminderRequired(tempSelected.reminder_required);
        if (!remarkRequired) setRemarkRequired(tempSelected.remark_required);

        setSubDispositionTwoReq(tempSelected.sub_disposition_required);
        if (selectedDispositionTwo) setSelectedDispositionTwo({});
        try {
            const apiResponse = await getDispositionStatus(
                DispositionServiceType.calling,
                false,
                authData,
                id
            );
            if (apiResponse) {
                if (apiResponse.data?.subdispositions.length > 0) {
                    setSubDipositionTwoList(apiResponse.data?.subdispositions);
                    let dummyDisposition: Array<DropDownType> = [];
                    apiResponse.data?.subdispositions.map(
                        (item: DispositionType) => {
                            dummyDisposition.push({
                                label: item.text,
                                value: item.id
                            });
                        }
                    );
                    setSubDispositionTwoDropdown(dummyDisposition);
                } else setSubDispositionTwoDropdown([]);
            }
        } catch (e) {
            ToastAndroid.show('Error fetching status', ToastAndroid.SHORT);
        }
    };

    const handleSubdispositionTwoChange = (id: string) => {
        setErrorsObject({});
        setSelectedDispositionTwo(
            getDipositionObject(id, subDispositionTwoList)
        );
        const tempSelected: DispositionType = getDipositionObject(
            id,
            subDispositionTwoList
        );
        if (!amountRequired)
            setAmountRequired(tempSelected.committed_amount_required);
        if (!reminderRequired)
            setReminderRequired(tempSelected.reminder_required);
        if (!remarkRequired) setRemarkRequired(tempSelected.remark_required);
    };

    useEffect(() => {
        getLoanData();
        getDispositionStatuses();
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => true
        );
        return () => backHandler.remove();
    }, []);

    const getLoanData = async () => {
        try {
            if (companyType == CompanyType.loan) {
                const apiResponse = await getLoanProfile(
                    selectedLoanData.loan_id,
                    allocationMonth,
                    authData
                );
                if (apiResponse?.data) {
                    const data = await modifyLoanDetails(
                        selectedLoanData,
                        apiResponse?.data?.output?.question_dict,
                        allocationMonth,
                        undefined,
                        false,
                        authData
                    );
                    if (
                        StringCompare(
                            data.loan_details[0].final_status,
                            LoanStatusType.closed
                        )
                    ) {
                        setShowAlertDialog(true);
                    }
                }
            } else {
                const apiResponse = await getCustomerProfile(
                    selectedLoanData.loan_id,
                    allocationMonth,
                    authData
                );
                if (apiResponse?.data) {
                    const data = await modifyCustomerDetails(
                        selectedLoanData,
                        apiResponse?.data?.output,
                        allocationMonth,
                        undefined,
                        undefined,
                        undefined,
                        authData
                    );
                    if (
                        StringCompare(
                            data.loan_details[0].final_status,
                            LoanStatusType.closed
                        )
                    ) {
                        setShowAlertDialog(true);
                    }
                }
            }
        } catch (error: any) {
            let message = SOMETHING_WENT_WRONG;
            if (error.response) {
                message =
                    error?.response?.data.output ??
                    error?.response?.data.message;
            }
            ToastAndroid.show(message, ToastAndroid.LONG);
        }
    };

    const getDispositionStatuses = async () => {
        try {
            const apiRepsonse = await getDispositionStatus(
                DispositionServiceType.calling,
                false,
                authData
            );
            if (apiRepsonse) {
                if (dispositionID.length == 0) {
                    setDispositionList(apiRepsonse.data?.dispositions);
                    let dummyDisposition: Array<DropDownType> = [];
                    apiRepsonse.data?.dispositions.map(
                        (item: DispositionType) => {
                            dummyDisposition.push({
                                label: item.text,
                                value: item.id
                            });
                        }
                    );
                    setDispositonDropdown(dummyDisposition);
                }
            }
        } catch (e) {
            ToastAndroid.show('Error fetching status', ToastAndroid.SHORT);
        }
    };

    const onSubmit = async () => {
        const isValid = checkIfDateTimeValid(reminderDate, reminderTime);
        if (!isValid) {
            ToastAndroid.show(
                'This time has passed, please select a future time.',
                ToastAndroid.LONG
            );
            return;
        }
        if (
            checkedStep.length != 0 &&
            (reminderDate.length == 0 || reminderTime.length == 0)
        ) {
            ToastAndroid.show(
                'Please select reminder date or time',
                ToastAndroid.SHORT
            );
            return;
        }
        let tempErrorObject = validateForm();
        setErrorsObject(tempErrorObject);
        if (Object.keys(tempErrorObject).length != 0) {
            ToastAndroid.show(
                'Please fill the required details',
                ToastAndroid.SHORT
            );
            return;
        }
        const formSubmit = {
            status: selectedDisposition?.text ?? '',
            shoot_id: shootId,
            allocation_month: allocationMonth,
            call_response: comment,
            committed_amount: getValidAmountString(amount),
            agent_name: authData?.name,
            loan_id: loanId,
            sub_disposition_1: selectedDispositionOne?.text ?? '',
            sub_disposition_2: selectedDispositionTwo?.text ?? '',
            company_id: authData?.company_id
        };
        if (reminderDate.length > 0) {
            let apiRemindertime = reminderTime;
            if (reminderTime.length == 0) apiRemindertime = '00:00:00';
            if (checkedStep.length == 0) {
                ToastAndroid.show('Please enter next step', ToastAndroid.SHORT);
                return;
            }
            const newReminderBody = {
                reminder_status: selectedDisposition?.text ?? '',
                reminder_date: `${reminderDate} ${apiRemindertime}`,
                reminder_from: 'call',
                shoot_id: shootId,
                next_step: checkedStep == 'Visit' ? 'field_visit' : 'call',
                source: 'fos_app',
                comment: comment
            };
            setLoading(true);
            if (checkedStep === 'Call') {
                try {
                    const [createNewReminderResponse, submitFormApiResponse] =
                        await Promise.all([
                            createNewReminder(
                                newReminderBody,
                                loanId,
                                allocationMonth,
                                authData
                            ),
                            submitDisposition(formSubmit, authData)
                        ]);
                    if (
                        createNewReminderResponse?.data ||
                        submitFormApiResponse?.success
                    ) {
                        if (submitFormApiResponse?.success)
                            ToastAndroid.show(
                                'Form created successfully',
                                ToastAndroid.SHORT
                            );
                    }
                } catch (e) {
                    ToastAndroid.show(
                        'Some error occurred',
                        ToastAndroid.SHORT
                    );
                }
                navigateToHome();
            } else if (checkedStep == 'Visit') {
                const isPTP = checkIfStatusIsPTP(
                    selectedDisposition,
                    selectedDispositionOne,
                    selectedDispositionTwo
                );
                if (isPTP) {
                    try {
                        const [newReminderRes, submitDispositionRes] =
                            await Promise.all([
                                createNewReminder(
                                    newReminderBody,
                                    loanId,
                                    allocationMonth,
                                    authData
                                ),
                                await submitDisposition(formSubmit, authData)
                            ]);
                        if (
                            newReminderRes?.data ||
                            submitDispositionRes?.success
                        ) {
                            if (submitDispositionRes?.success) {
                                ToastAndroid.show(
                                    submitDispositionRes?.message ??
                                        'Form submitted successfully',
                                    ToastAndroid.SHORT
                                );
                            }
                            try {
                                const newTaskResponse = await createTask(
                                    {
                                        loan_id: loanId,
                                        visit_date: `${reminderDate} ${apiRemindertime}`,
                                        address_index: addressIndex,
                                        applicant_index: applicantIndex,
                                        applicant_name: applicantName,
                                        applicant_type: applicantType,
                                        comment: comment.trim()
                                    } as VisitData,
                                    allocationMonth,
                                    TaskTypes.ptp,
                                    authData,
                                    false,
                                    ReminderFromType.call,
                                    newReminderRes?.data.reminder_id ?? ''
                                );
                                if (newTaskResponse?.success) {
                                    ToastAndroid.show(
                                        newTaskResponse?.message ??
                                            'Visit/PTP created',
                                        ToastAndroid.SHORT
                                    );
                                }
                            } catch (e: any) {}
                        }
                    } catch (e: any) {
                        ToastAndroid.show(
                            e.response?.data?.output ??
                                e.response?.data?.message ??
                                'Error',
                            ToastAndroid.SHORT
                        );
                    }
                    navigateToHome();
                } else {
                    try {
                        const [newReminderRes, submitDispositionRes] =
                            await Promise.all([
                                createNewReminder(
                                    newReminderBody,
                                    loanId,
                                    allocationMonth,
                                    authData
                                ),
                                await submitDisposition(formSubmit, authData)
                            ]);
                        if (
                            newReminderRes?.data ||
                            submitDispositionRes?.success
                        ) {
                            if (submitDispositionRes?.success) {
                                ToastAndroid.show(
                                    submitDispositionRes?.message ??
                                        'Form submitted successfully',
                                    ToastAndroid.SHORT
                                );
                            }

                            try {
                                const newTaskResponse = await createTask(
                                    {
                                        loan_id: loanId,
                                        visit_date: `${reminderDate} ${apiRemindertime}`,
                                        address_index: addressIndex,
                                        applicant_index: applicantIndex,
                                        applicant_name: applicantName,
                                        applicant_type: applicantType,
                                        comment: comment.trim()
                                    } as VisitData,
                                    allocationMonth,
                                    TaskTypes.visit,
                                    authData,
                                    false,
                                    ReminderFromType.call,
                                    newReminderRes?.data.reminder_id ?? ''
                                );
                                if (newTaskResponse?.success) {
                                    ToastAndroid.show(
                                        newTaskResponse?.message ??
                                            'Visit/PTP created',
                                        ToastAndroid.SHORT
                                    );
                                }
                            } catch (e) {}
                        }
                    } catch (e: any) {
                        ToastAndroid.show(
                            e.response?.data?.message ?? 'Error',
                            ToastAndroid.SHORT
                        );
                    }
                    navigateToHome();
                }
            }
        } else {
            try {
                const submitDispositionRes = await submitDisposition(
                    formSubmit,
                    authData
                );
                if (submitDispositionRes?.success) {
                    ToastAndroid.show(
                        'Form submitted successfully',
                        ToastAndroid.SHORT
                    );
                }
            } catch (e) {
                ToastAndroid.show('Error submitting form', ToastAndroid.SHORT);
            }
            navigateToHome();
        }
        setLoading(false);
    };
    if (loading)
        return (
            <View style={styles.loader}>
                <CustomActivityIndicator />
            </View>
        );

    return (
        <>
            <ClosedLoanErrorModal
                visible={showAlertDialog}
                navigation={navigation}
            />

            <ScrollView style={styles.container}>
                <Typography
                    variant={TypographyVariants.body2}
                    style={{ color: '#043E90', textAlign: 'center' }}
                >
                    {`${applicantName ?? ''},${
                        companyType == CompanyType.loan
                            ? 'Loan Id: '
                            : 'Customer Id: '
                    } ${loanId}`}
                </Typography>
                <View style={{ flexDirection: 'column' }}>
                    <View style={styles.formRowContainer}>
                        <View style={styles.formLabelContainer}>
                            <Typography style={styles.formLabel}>
                                Contact Number:
                            </Typography>
                        </View>
                        <View style={styles.inputBox}>
                            <TextInput
                                value={phoneNumber ?? ''}
                                editable={false}
                                style={[
                                    styles.inputContainer,
                                    { color: '#043E90' }
                                ]}
                                textAlign="left"
                            />
                        </View>
                    </View>
                    <View style={[styles.formRowContainer]}>
                        <View style={styles.formLabelContainer}>
                            <Typography style={styles.formLabel}>
                                Disposition*:
                            </Typography>
                        </View>
                        <View style={[styles.inputBox]}>
                            <View style={{ width: RFPercentage(17) }}>
                                <CustomDropDown
                                    listMode="SCROLLVIEW"
                                    open={dispositionOpen}
                                    setOpen={setDispositionOpen}
                                    items={dispositionDropdown}
                                    setItems={setDispositonDropdown}
                                    values={dispositon}
                                    setValues={setDisposoition}
                                    onChangeValue={(value: string) => {
                                        if (value.length > 0)
                                            handleDispositionChange(value);
                                    }}
                                    containerStyle={{
                                        paddingHorizontal: 0
                                    }}
                                    dropDownContainerStyle={
                                        styles.dropDownContainer
                                    }
                                    listItemContainerStyle={{
                                        paddingVertical: RFPercentage(0.8)
                                    }}
                                    onOpen={() => {
                                        setSubDispositionOneOpen(false);
                                        setSubDispositionTwoOpen(false);
                                    }}
                                    zIndex={3000}
                                    zIndexInverse={1000}
                                />
                                {errorObject?.disposition?.length > 0 ? (
                                    <Typography
                                        style={styles.error}
                                        variant={TypographyVariants.caption2}
                                    >
                                        {errorObject?.disposition}
                                    </Typography>
                                ) : null}
                            </View>
                        </View>
                    </View>
                    {subDispositionOneDropdown.length > 0 ? (
                        <View
                            style={[
                                styles.formRowContainer,
                                {
                                    marginTop: RFPercentage(1.5)
                                }
                            ]}
                        >
                            <View style={styles.formLabelContainer}>
                                <Typography style={styles.formLabel}>
                                    {`Sub Disposition 1${
                                        subDispositionOneReq ? '*' : ''
                                    }:`}
                                </Typography>
                            </View>
                            <View style={[styles.inputBox]}>
                                <View style={{ width: RFPercentage(17) }}>
                                    <CustomDropDown
                                        listMode="SCROLLVIEW"
                                        open={subDispositionOneOpen}
                                        setOpen={setSubDispositionOneOpen}
                                        items={subDispositionOneDropdown}
                                        setItems={setDispositonDropdown}
                                        values={subDispositionOne}
                                        setValues={setSubDispostionOne}
                                        onChangeValue={(value: string) => {
                                            if (value.length > 0)
                                                handleSubDispositionOneChange(
                                                    value
                                                );
                                        }}
                                        containerStyle={{
                                            paddingHorizontal: 0
                                        }}
                                        dropDownContainerStyle={
                                            styles.dropDownContainer
                                        }
                                        listItemContainerStyle={{
                                            paddingVertical: RFPercentage(0.8)
                                        }}
                                        onOpen={() => {
                                            setDispositionOpen(false);
                                            setSubDispositionTwoOpen(false);
                                        }}
                                        zIndex={2000}
                                        zIndexInverse={2000}
                                    />
                                    {errorObject?.sub_disposition1?.length >
                                    0 ? (
                                        <Typography
                                            style={styles.error}
                                            variant={
                                                TypographyVariants.caption2
                                            }
                                        >
                                            {errorObject?.sub_disposition1}
                                        </Typography>
                                    ) : null}
                                </View>
                            </View>
                        </View>
                    ) : null}
                    {subDispositionTwoDropdown.length > 0 ? (
                        <View
                            style={[
                                styles.formRowContainer,
                                {
                                    marginTop: RFPercentage(1.5),
                                    marginBottom: RFPercentage(1)
                                }
                            ]}
                        >
                            <View style={styles.formLabelContainer}>
                                <Typography style={styles.formLabel}>
                                    {` Sub Disposition 2${
                                        subDispositionTwoReq ? '*' : ''
                                    }:`}
                                </Typography>
                            </View>
                            <View style={[styles.inputBox]}>
                                <View style={{ width: RFPercentage(17) }}>
                                    <CustomDropDown
                                        listMode="SCROLLVIEW"
                                        open={subDispositionTwoOpen}
                                        setOpen={setSubDispositionTwoOpen}
                                        items={subDispositionTwoDropdown}
                                        setItems={setSubDispositionTwoDropdown}
                                        values={subDispositionTwo}
                                        setValues={setSubDispostionTwo}
                                        onChangeValue={(value: string) => {
                                            handleSubdispositionTwoChange(
                                                value
                                            );
                                        }}
                                        dropDownContainerStyle={
                                            styles.dropDownContainer
                                        }
                                        containerStyle={{
                                            paddingHorizontal: 0
                                        }}
                                        listItemContainerStyle={{
                                            paddingVertical: RFPercentage(0.8)
                                        }}
                                        onOpen={() => {
                                            setSubDispositionOneOpen(false);
                                            setDispositionOpen(false);
                                        }}
                                        zIndex={1000}
                                        zIndexInverse={3000}
                                    />
                                    {errorObject?.sub_disposition2?.length >
                                    0 ? (
                                        <Typography
                                            style={styles.error}
                                            variant={
                                                TypographyVariants.caption2
                                            }
                                        >
                                            {errorObject?.sub_disposition2}
                                        </Typography>
                                    ) : null}
                                </View>
                            </View>
                        </View>
                    ) : null}
                    <View style={styles.formRowContainer}>
                        <View style={styles.formLabelContainer}>
                            <Typography style={styles.formLabel}>
                                {`Committed Amount${amountRequired ? '*' : ''}`}
                                :
                            </Typography>
                        </View>
                        <View
                            style={[
                                styles.inputBox,
                                { marginTop: RFPercentage(1) }
                            ]}
                        >
                            <View>
                                <TextInput
                                    textAlign="left"
                                    keyboardType="numeric"
                                    style={[
                                        styles.inputContainer,
                                        { marginVertical: 0 }
                                    ]}
                                    value={amount}
                                    onChangeText={setAmount}
                                />
                                {errorObject?.amount_required ? (
                                    <Typography
                                        style={styles.error}
                                        variant={TypographyVariants.caption2}
                                    >
                                        {errorObject?.amount_required}
                                    </Typography>
                                ) : null}
                            </View>
                        </View>
                    </View>

                    <View style={[styles.formRowContainer]}>
                        <View style={styles.formLabelContainer}>
                            <Typography style={styles.formLabel}>
                                {`Reminder Date${reminderRequired ? '*' : ''}`}:
                            </Typography>
                        </View>
                        <View style={[styles.inputBox, { marginVertical: 10 }]}>
                            <View>
                                <DateTimeInputBox
                                    placeholder={'dd/mm/yy'}
                                    type={'date'}
                                    setText={setReminderDate}
                                    containerStyle={styles.datePickerContainer}
                                    wrapper={{ marginHorizontal: 0 }}
                                    minimumDate={tommorrowDate}
                                    selectedDate={tommorrowDate}
                                />
                                {errorObject?.reminder_date_required ? (
                                    <Typography
                                        style={styles.error}
                                        variant={TypographyVariants.caption2}
                                    >
                                        {errorObject?.reminder_date_required}
                                    </Typography>
                                ) : null}
                            </View>
                        </View>
                    </View>
                    <View style={styles.formRowContainer}>
                        <View style={styles.formLabelContainer}>
                            <Typography style={styles.formLabel}>
                                {`Reminder Time${reminderRequired ? '*' : ''}`}:
                            </Typography>
                        </View>
                        <View style={styles.inputBox}>
                            <View>
                                <DateTimeInputBox
                                    placeholder={'00:00'}
                                    type={'time'}
                                    setText={setReminderTime}
                                    containerStyle={styles.datePickerContainer}
                                    wrapper={{ marginHorizontal: 0 }}
                                />
                                {errorObject?.reminder_time_required ? (
                                    <Typography
                                        style={styles.error}
                                        variant={TypographyVariants.caption2}
                                    >
                                        {errorObject?.reminder_time_required}
                                    </Typography>
                                ) : null}
                            </View>
                        </View>
                    </View>
                    <View style={styles.formRowContainer}>
                        <View style={styles.formLabelContainer}>
                            <Typography style={styles.formLabel}>
                                {` Comment${remarkRequired ? '*' : ''}:`}
                            </Typography>
                        </View>
                        <View style={styles.inputBox}>
                            <View>
                                <TextInput
                                    style={styles.commentBox}
                                    multiline
                                    numberOfLines={3}
                                    textAlign="left"
                                    value={comment}
                                    onChangeText={setComment}
                                />
                                {errorObject?.remark_required ? (
                                    <Typography
                                        style={styles.error}
                                        variant={TypographyVariants.caption2}
                                    >
                                        {errorObject?.remark_required}
                                    </Typography>
                                ) : null}
                            </View>
                        </View>
                    </View>

                    <CustomRadioButton
                        buttons={RadioButtonArray}
                        checked={checkedStep}
                        setChecked={setCheckedStep}
                        containerStyle={{
                            marginVertical: RFPercentage(2),
                            paddingRight: RFPercentage(7)
                        }}
                        label="Next Step:"
                    />

                    <Button
                        title={'Done'}
                        titleStyle={{
                            fontFamily: TypographyFontFamily.medium,
                            color: '#fff'
                        }}
                        buttonStyle={styles.doneButton}
                        onPress={() => onSubmit()}
                    />
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
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
        backgroundColor: '#f6f8fb',
        flex: 1,
        paddingHorizontal: RFPercentage(0.5),
        paddingVertical: RFPercentage(2)
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
    error: {
        color: 'red',
        marginTop: RFPercentage(0.2)
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
    }
});
