import React, {
    createRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, ToastAndroid } from 'react-native';
import ProofSelectorContainer from '../common/ProofSelector/ProofSelector';
import { View } from 'react-native';
import { Button } from '@rneui/base';
import {
    BranchRepresentativeType,
    DepositBranchType,
    DepositSubmitIdType,
    DepositSubmitType,
    DropDownType,
    ImageInputType,
    MakeDepositType,
    PendingDepositType,
    TaskBottomSheetData,
    VisitOtpDataType
} from '../../../types';
import {
    getBranchDetails,
    getBranchRepresentatives,
    makeDepsoit,
    updateDepositId
} from '../../services/depositService';
import { useAuth } from '../../hooks/useAuth';
import LoanAccountsView from './LoanAccounts';
import { useTaskAction } from '../../hooks/useTaskAction';
import {
    StringCompare,
    capitalizeFirstLetter,
    checkProofAttached,
    generateArrayfromString,
    leadingDebounce,
    showToast
} from '../../services/utils';
import { ProgressDialog } from '../common/Dialogs/ProgessDialog';
import ResultModal from '../modals/ResultModal';
import { useNavigation } from '@react-navigation/core';
import { RFPercentage } from 'react-native-responsive-fontsize';
import DashedLine from 'react-native-dashed-line';
import InputWithLabel from '../common/InputWithLabel';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import Colors, { BLUE_DARK, GREY_2 } from '../../constants/Colors';
import CurrencyTypography from '../ui/CurrencyTypography';
import {
    DEPOSIT_SMS_TEMPLATE_ID,
    LOAN_STATUS_TEXT,
    Overall,
    SMS_PRINCIPAL_ENTITY_ID,
    SOMETHING_WENT_WRONG,
    get_deposit_otp_body,
    otp_max_try_error_string
} from '../../constants/constants';
import {
    BankBranchType,
    DepositTypes,
    ExpandableCardTypes,
    OtpVerifyTypes,
    ToastTypes
} from '../../../enums';
import { TaskBottomSheet } from '../tasks/TaskBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import moment from 'moment';
import { generateVisitOtp } from '../../services/taskService';
import { v4 as uuid } from 'uuid';
import { CustomDropDown } from '../common/DropDown';
import { useFocusEffect } from '@react-navigation/native';
import { BankBranchIcon } from '../common/Icons/BankBranchIcon';
import { CompanyBranchIcon } from '../common/Icons/CompanyBranchIcon';
import ExpandableCardHelpSection from '../common/ExpandableCard/ExpandableCardHelpSection';
import { AirtelBranchIcon } from '../common/Icons/AirtelBranchIcon';

const getBranchRepresentativeObject = (
    value: string,
    list: Array<BranchRepresentativeType>
): BranchRepresentativeType => {
    let dummyObject: any;
    list.forEach((_item) => {
        if (StringCompare(_item?.client_employee_id, value)) {
            dummyObject = _item;
        }
    });
    return dummyObject;
};

export default function DepositSubmit(depositConfigData: DepositSubmitType) {
    const {
        authData,
        allocationMonth,
        depositBranch,
        setDepositBranch,
        depositModes,
        depositBranchLocation,
        showCompanyBranchRepresentatives,
        depositOtpVerificationMethod
    } = useAuth();
    const { imageProvider, imageSetterProvider } = useTaskAction();
    const navigation = useNavigation();
    const [expanded, setExpanded] = React.useState<boolean>(true);
    const [depositMethod, setDepositMethod] = React.useState<string>('');
    const [depositLoanData, setDepositLoanData] = React.useState<
        Array<PendingDepositType>
    >(depositConfigData.loan_ids);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [receipt, setReceipt] = React.useState<string>('');
    const [comment, setComment] = React.useState<string>('');
    const [button, setButton] = React.useState<boolean>(false);
    const [depositLocation] = React.useState<string>('Select Deposit Location');
    const [visible, setVisible] = React.useState<boolean>(false);
    const [error, setError] = useState<boolean>(true);
    const [visitIds, setVisitIds] = useState<Array<DepositSubmitIdType>>([]);
    const [wasStatusAvailable, setWasStatusAvailable] = useState({});
    const [isBranchDetailsPresent, setIsBranchDetailsPresent] = useState({
        company: false,
        bank: false
    });
    const otpBottomSheetRef = useRef<BottomSheet>(null);
    const [otpInput, setOtpInput] = useState(false);
    const [resendOtpTime, setResendOtpTime] = useState(30);
    const [emailsArray, setEmailsArray] = useState<Array<string>>([]);
    const [mobilesArray, setMobilesArray] = useState<Array<string>>([]);
    const [bankBranch, setBankBranch] = useState<Array<DepositBranchType>>([]);
    const [companyBranch, setCompanyBranch] = useState<
        Array<DepositBranchType>
    >([]);
    const [branchRepDropDownOpen, setBranchRepDropDownOpen] = useState(false);
    const [depositMethodDropDownOpen, setDepositMethodDropDownOpen] =
        useState(false);
    const [branchRepresentativesDropdown, setBranchRepresentativesDropDown] =
        useState<Array<DropDownType>>([]);
    const [depositMethodsDropdown, setDepositMethodsDropDown] = useState<
        Array<DropDownType>
    >([]);
    const [branchRepresentativeId, setBranchRepresentativeId] = useState('');
    const [branchRepresentatives, setBranchRepresentatives] = useState<
        Array<BranchRepresentativeType>
    >([]);
    const [selectedBranchRepresentative, setSelectedBranchRepresentative] =
        useState<BranchRepresentativeType>();
    const [verificationOTP, setVerificationOTP] = useState('');

    const getUniqueId = useMemo(() => uuid().split('-')[0], []);

    const [depositLocationList, setDepositLocationList] = useState([]);

    useEffect(() => {
        let tempArr: any = [];
        depositBranchLocation?.split(',').map(function (value) {
            if (value.trim() === BankBranchType.bank) {
                tempArr.push({
                    title: value.trim(),
                    icon: <BankBranchIcon />
                });
            } else if (value.trim() === BankBranchType.company) {
                tempArr.push({
                    title: value.trim(),
                    icon: <CompanyBranchIcon />
                });
            } else if (value.trim() === BankBranchType.airtel) {
                tempArr.push({
                    title: value.trim(),
                    icon: <AirtelBranchIcon />
                });
            }
        });
        setDepositLocationList(tempArr);
    }, [depositBranchLocation]);

    const handleBranchRepresentativeChange = (value: string) => {
        const tempSelectedBranchRepresentative: BranchRepresentativeType =
            getBranchRepresentativeObject(value, branchRepresentatives);
        setSelectedBranchRepresentative(tempSelectedBranchRepresentative);
        if (tempSelectedBranchRepresentative) {
            setEmailsArray(
                generateArrayfromString(
                    tempSelectedBranchRepresentative?.email ?? ''
                )
            );
            setMobilesArray(
                generateArrayfromString(
                    tempSelectedBranchRepresentative?.mobile ?? ''
                )
            );
        }
    };

    const bottomSheetData: TaskBottomSheetData = {
        contact_number: mobilesArray?.toString(),
        email_address: emailsArray?.toString(),
        unique_id: getUniqueId
    };

    useEffect(() => {
        (async () => {
            let tempBankBranch: Array<DepositBranchType> = [];
            let tempCompanyBranch: Array<DepositBranchType> = [];
            let tempDepositBranchDetails: Array<DepositBranchType> = [];
            try {
                const apiResponse = await getBranchDetails(authData);
                tempDepositBranchDetails = apiResponse?.data?.data ?? [];
            } catch {}
            tempDepositBranchDetails?.map((item) => {
                if (item?.branch_type == BankBranchType.bank) {
                    tempBankBranch.push(item);
                } else if (item?.branch_type == BankBranchType.company) {
                    tempCompanyBranch.push(item);
                }
            });
            if (tempCompanyBranch?.length) {
                setIsBranchDetailsPresent((_prev) => ({
                    ..._prev,
                    ['company']: true
                }));
            }

            if (tempBankBranch?.length) {
                setIsBranchDetailsPresent((_prev) => ({
                    ..._prev,
                    ['bank']: true
                }));
            }

            setBankBranch([...tempBankBranch]);
            setCompanyBranch([...tempCompanyBranch]);
        })();
    }, []);

    useEffect(() => {
        let obj: any = {};
        depositConfigData.loan_ids.map((loan) => {
            obj[loan.visit_id] = loan.agent_marked_status ?? null;
        });
        setWasStatusAvailable(obj);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setBranchRepDropDownOpen(false);
                setDepositMethodDropDownOpen(false);
            };
        }, [navigation])
    );

    useEffect(() => {
        let dummyDepositMethodData: Array<DropDownType> = [];
        depositModes?.forEach((item: DepositTypes) => {
            dummyDepositMethodData.push({
                label: item,
                value: item
            });
        });
        setDepositMethodsDropDown(dummyDepositMethodData);
    }, [depositModes]);

    useEffect(() => {
        (async () => {
            setBranchRepresentativeId('');
            setEmailsArray([]);
            setMobilesArray([]);
            if (
                depositBranch?.branch_type == BankBranchType.company &&
                showCompanyBranchRepresentatives
            ) {
                try {
                    const apiResponse = await getBranchRepresentatives(
                        depositBranch?.branch_details?.branch_code,
                        authData
                    );
                    if (apiResponse) {
                        let dummyBranchRepData: Array<DropDownType> = [];
                        setBranchRepresentatives(apiResponse?.data ?? []);
                        apiResponse?.data.forEach(
                            (item: BranchRepresentativeType) => {
                                dummyBranchRepData.push({
                                    label: `${item.name} (${item.client_employee_id})`,
                                    value: item.client_employee_id
                                });
                            }
                        );
                        setBranchRepresentativesDropDown(dummyBranchRepData);
                    }
                } catch (e) {}
            }
        })();
    }, [depositBranch, showCompanyBranchRepresentatives]);

    const proofs: Array<ImageInputType> = [
        {
            title: 'Proof of Deposit',
            show: true,
            imageTag: 'deposit'
        }
    ];

    const onDepositSubmitInternal = async () => {
        if (StringCompare(allocationMonth, Overall)) {
            ToastAndroid.show(
                `Deposit cannot be submittded at ‘Overall’ allocation month, please select an individual month.`,
                ToastAndroid.LONG
            );
            return;
        }
        if (loading) return;
        setLoading(true);
        const depositData: MakeDepositType = {
            total_amount: depositConfigData.amount,
            recovery_method: depositConfigData.recovery_method,
            deposit_method: depositMethod,
            deposit_receipt_no: receipt,
            loan_data: depositLoanData,
            branch_details: depositBranch,
            comment: comment.trim(),
            otp_data: {
                destination: getUniqueId,
                otp_type: 'deposit',
                otp: verificationOTP
            },
            branch_manager_details: {
                branch_code: selectedBranchRepresentative?.branch_code ?? '',
                client_employee_id:
                    selectedBranchRepresentative?.client_employee_id ?? '',
                name: selectedBranchRepresentative?.name ?? '',
                email: selectedBranchRepresentative?.email ?? '',
                mobile: selectedBranchRepresentative?.mobile ?? '',
                department: selectedBranchRepresentative?.department ?? '',
                manager_id: selectedBranchRepresentative?.manager_id ?? ''
            }
        };
        if (depositBranch?.branch_type != BankBranchType.airtel) {
            const fileData = checkProofAttached(true, imageProvider('deposit'));
            const fileType = imageProvider('deposit')?.type;

            if (fileType === 'link')
                depositData.deposit_proof_link = (fileData as string) ?? '';
            else depositData.deposit_proof_file = fileData;
        }

        let linked_deposit_id;
        if (depositConfigData.redeposit) {
            linked_deposit_id = depositConfigData.data?.deposit_id;
        }

        try {
            const apiResponse = await makeDepsoit(
                allocationMonth,
                depositData,
                authData,
                linked_deposit_id,
                depositOtpVerificationMethod
            );
            if (apiResponse) {
                const output = apiResponse?.message ?? '';
                if (depositBranch?.branch_type == BankBranchType.airtel) {
                    navigation.navigate('DepositTimerScreen', {
                        depositAmount: depositConfigData.amount,
                        depositData: depositConfigData.loan_ids,
                        depositId: apiResponse?.data?.deposit_id
                    });
                    return;
                }
                updateDepositId(
                    visitIds,
                    apiResponse?.data?.deposit_id,
                    authData
                )
                    .then((response) => {
                        setComment(output);
                        setVisible(true);
                        setButton(true);
                    })
                    .catch((error) => {
                        let message = SOMETHING_WENT_WRONG;
                        if (error?.response) {
                            message = error?.response?.data?.message;
                        }
                        ToastAndroid.show(message, ToastAndroid.LONG);
                    });
            }
            return apiResponse;
        } catch (e) {
            return error;
        } finally {
            setLoading(false);
        }
    };

    //Deposit OTP changes
    const generateDepositOtp = async () => {
        const otpBodyString = get_deposit_otp_body(
            depositConfigData.amount,
            moment().format('DD-MM-YYYY, HH:MM:SS'),
            authData?.name
        );
        if (
            emailsArray.length == 0 &&
            mobilesArray.length == 0 &&
            !!depositOtpVerificationMethod
        ) {
            ToastAndroid.show(
                'No Email Address and Mobile number found for OTP verification',
                ToastAndroid.LONG
            );
            return;
        }

        const VisitOtpData: VisitOtpDataType = {
            destination: getUniqueId,
            otp_type: 'deposit',
            other_fields: {
                email: emailsArray,
                mobile: mobilesArray,
                email_data: {
                    from_data: {
                        name: 'Deposit Report',
                        email: 'info@credgenics.com'
                    },
                    subject: 'Deposit Verification OTP',
                    email_body: otpBodyString
                },
                sms_data: {
                    sms_body: otpBodyString,
                    content_template_id: DEPOSIT_SMS_TEMPLATE_ID,
                    principal_entity_id: SMS_PRINCIPAL_ENTITY_ID
                }
            }
        };
        try {
            const apiResponse = await generateVisitOtp(VisitOtpData);
            otpBottomSheetRef.current?.expand();
            setOtpInput(true);
            setResendOtpTime(30);
            return apiResponse?.status;
        } catch (e) {
            if (e?.response?.status == 401)
                ToastAndroid.show(otp_max_try_error_string, ToastAndroid.LONG);
            else ToastAndroid.show(`Unable to send the OTP`, ToastAndroid.LONG);
            return e.response.status;
        }
    };

    const onDepositSubmit = useCallback(
        leadingDebounce(async function () {
            const checkDepositOtpMethod = depositOtpVerificationMethod
                .toLowerCase()
                .includes(depositMethod.toLowerCase());
            if (
                !!depositOtpVerificationMethod &&
                checkDepositOtpMethod &&
                depositBranch?.branch_type == BankBranchType.company
            ) {
                generateDepositOtp();
            } else onDepositSubmitInternal();
        }, 2000),
        [generateDepositOtp, onDepositSubmitInternal]
    );
    const enableSubmitButton = useCallback(() => {
        let loanDataStatus = true;
        depositLoanData.forEach((item) => {
            let loanStatusMatch = false;
            LOAN_STATUS_TEXT.forEach((status) => {
                if (
                    status === item.agent_marked_status ||
                    status === item.agent_marked_status
                ) {
                    loanStatusMatch = true;
                    return;
                }
            });
            if (!loanStatusMatch) {
                loanDataStatus = false;
                return;
            }
        });
        const branchRepresentativeCheck = () => {
            if (depositBranch?.branch_type == BankBranchType.company)
                return (
                    !depositOtpVerificationMethod ||
                    branchRepresentativeId.length > 0
                );
            return true;
        };

        const proofCheck = () => {
            if (depositBranch?.branch_type == BankBranchType.airtel)
                return true;
            else return checkProofAttached(true, imageProvider('deposit'));
        };

        return !(
            depositBranch &&
            depositMethod !== '' &&
            loanDataStatus &&
            branchRepresentativeCheck() &&
            proofCheck()
        );
    }, [
        branchRepresentativeId,
        depositBranch,
        depositLoanData,
        depositMethod,
        depositOtpVerificationMethod,
        imageProvider
    ]);

    const showBranchRepDropdown = useMemo(() => {
        return (
            depositBranch?.branch_type == BankBranchType.company &&
            showCompanyBranchRepresentatives
        );
    }, [depositBranch, showCompanyBranchRepresentatives]);

    // MANDATORY FIELD EVALUATOR
    useEffect(() => {
        const timer = setInterval(() => {
            const value = enableSubmitButton();
            setError(value);
        }, 800);
        return () => clearInterval(timer);
    }, [enableSubmitButton]);

    //RESET DATA
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            setDepositBranch(undefined);
            imageSetterProvider('deposit')('');
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        let ids: Array<DepositSubmitIdType> = [];
        depositConfigData.loan_ids.map((loan) => {
            ids.push({
                visit_id: loan.visit_id,
                loan_id: loan.loan_id,
                allocation_month: loan.allocation_month
            });
        });
        setVisitIds([...ids]);

        if (depositConfigData.redeposit) {
            if (depositConfigData.data?.deposit_method) {
                setDepositMethod(
                    capitalizeFirstLetter(
                        depositConfigData.data?.deposit_method
                    )
                );
            }
            imageSetterProvider('deposit')({
                uri: depositConfigData.data?.deposit_proof_url,
                type: 'link'
            });
            setReceipt(depositConfigData.data?.deposit_receipt_no ?? '');
            setComment(depositConfigData.data?.comment ?? '');
            setDepositBranch({
                branch_details: depositConfigData.data?.branch_details,
                branch_id: depositConfigData.data?.branch_id!,
                branch_type: depositConfigData.data?.branch_type
            });
        } else {
            setDepositMethod(depositConfigData.recovery_method);
        }
    }, [depositConfigData]);

    const handleBranchClick = (branchType: string) => {
        if (
            !isBranchDetailsPresent.company &&
            branchType == BankBranchType.company
        ) {
            showToast(
                'Contact your supervisor to add at least one Company details',
                ToastTypes.long
            );
            return;
        }
        if (!isBranchDetailsPresent.bank && branchType == BankBranchType.bank) {
            showToast(
                'Contact your supervisor to add at least one Bank details',
                ToastTypes.long
            );
            return;
        }
        navigation.navigate('DepositBranchScreen', {
            branchType: branchType,
            companyBranch,
            bankBranch
        });
    };

    const handleDepositLocationPress = (title: string) => {
        if (title === BankBranchType.airtel) {
            setDepositBranch({ ['branch_type']: BankBranchType.airtel });
        } else {
            handleBranchClick(title);
        }
    };

    const extraData = {
        handlePress: handleDepositLocationPress
    };

    return (
        <>
            <ResultModal
                visible={visible}
                message={comment}
                buttonText={button ? 'DONE' : 'CLOSE'}
                positive={button}
                onDone={() => {
                    setVisible(false);
                    if (navigation.canGoBack()) navigation.goBack();
                }}
            />
            <ProgressDialog title="Submitting..." visible={loading} />
            <ScrollView contentContainerStyle={styles.container}>
                <View>
                    <View style={styles.containerLoan}>
                        <CurrencyTypography
                            amount={depositConfigData.amount}
                            style={styles.content}
                            variant={TypographyVariants.subHeading}
                        />
                        <Typography
                            variant={TypographyVariants.title1}
                            style={styles.header}
                        >
                            Total Deposit Amount
                        </Typography>
                    </View>
                    <DashedLine
                        dashColor={Colors.common.blue}
                        dashGap={2}
                        dashThickness={1.5}
                    />
                    <LoanAccountsView
                        statusList={LOAN_STATUS_TEXT}
                        loanAccounts={depositLoanData}
                        wasStatusAvailable={wasStatusAvailable}
                        setLoanAccounts={setDepositLoanData}
                    />
                    <View style={styles.dropdownStyle}>
                        <View>
                            <Typography
                                variant={TypographyVariants.title1}
                                style={styles.dropdownHeading}
                            >
                                {depositLocation}
                            </Typography>
                        </View>
                        {!!depositLocationList?.length &&
                            depositLocationList?.map(
                                (branchList: object, index: number) => {
                                    return (
                                        <ExpandableCardHelpSection
                                            dataList={branchList}
                                            key={index}
                                            type={
                                                ExpandableCardTypes.depositLocation
                                            }
                                            isOpened={false}
                                            extraData={extraData}
                                        />
                                    );
                                }
                            )}
                    </View>
                    {showBranchRepDropdown && (
                        <View style={styles.depositMethodContainer}>
                            <Typography style={styles.labelStyle}>
                                Select Branch Representative
                            </Typography>
                            <CustomDropDown
                                listMode="SCROLLVIEW"
                                open={branchRepDropDownOpen}
                                setOpen={setBranchRepDropDownOpen}
                                items={branchRepresentativesDropdown}
                                setItems={setBranchRepresentativesDropDown}
                                values={branchRepresentativeId}
                                setValues={setBranchRepresentativeId}
                                onChangeValue={(value: string) => {
                                    if (value.length > 0)
                                        handleBranchRepresentativeChange(value);
                                }}
                                containerStyle={{
                                    paddingHorizontal: 0
                                }}
                                dropDownContainerStyle={
                                    styles.dropDownContainer
                                }
                                listItemContainerStyle={{
                                    paddingVertical: RFPercentage(0.4)
                                }}
                                placeholderStyle={styles.placeHolderStyle}
                                placeholder="Branch Representative"
                                zIndex={3000}
                                zIndexInverse={1000}
                                onOpen={() => {
                                    setDepositMethodDropDownOpen(false);
                                }}
                            />
                        </View>
                    )}
                    <View style={styles.depositMethodContainer}>
                        <Typography style={styles.labelStyle}>
                            Deposit Mode
                        </Typography>
                        <CustomDropDown
                            listMode="SCROLLVIEW"
                            open={depositMethodDropDownOpen}
                            setOpen={setDepositMethodDropDownOpen}
                            items={depositMethodsDropdown}
                            setItems={setDepositMethodsDropDown}
                            values={depositMethod}
                            setValues={setDepositMethod}
                            containerStyle={{
                                paddingHorizontal: 0
                            }}
                            dropDownContainerStyle={styles.dropDownContainer}
                            listItemContainerStyle={{
                                paddingVertical: RFPercentage(0.4)
                            }}
                            placeholderStyle={styles.placeHolderStyleDeposit}
                            placeholder={depositMethod}
                            zIndex={2000}
                            zIndexInverse={2000}
                            onOpen={() => {
                                setBranchRepDropDownOpen(false);
                            }}
                        />
                    </View>

                    <View style={styles.receiptNumberContainer}>
                        <InputWithLabel
                            label="Deposit Receipt Number"
                            value={receipt}
                            setText={setReceipt}
                            compRef={createRef()}
                            loading={loading}
                            error={false}
                            placeholder="Eg. 088213443123"
                        />
                        <InputWithLabel
                            label="Add Comment..."
                            value={comment}
                            setText={setComment}
                            placeholder="Type Here..."
                            multiline={true}
                            numberOfLines={3}
                        />
                    </View>
                    {depositBranch?.branch_type != BankBranchType.airtel && (
                        <ProofSelectorContainer proofs={proofs} />
                    )}
                    <Button
                        title="Submit"
                        type="solid"
                        disabled={error}
                        loading={loading}
                        onPress={onDepositSubmit}
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.buttonText}
                        disabledStyle={{
                            backgroundColor: '#E3E6E8'
                        }}
                    />
                </View>
            </ScrollView>
            <TaskBottomSheet
                otpInput={otpInput}
                ref={otpBottomSheetRef}
                resendTime={resendOtpTime}
                data={bottomSheetData}
                setResendTime={setResendOtpTime}
                taskSubmit={onDepositSubmitInternal}
                type={OtpVerifyTypes.deposit}
                resendOtp={generateDepositOtp}
                otp={verificationOTP}
                setOtp={setVerificationOTP}
            />
        </>
    );
}

const styles = StyleSheet.create({
    borderStyle: {
        backgroundColor: 'white',
        borderColor: '#e0e0e0',
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 20,
        padding: 5
    },
    buttonStyle: {
        backgroundColor: Colors.common.blue,
        borderRadius: 10,
        marginBottom: RFPercentage(2)
    },
    buttonText: {
        color: Colors.light.background,
        fontFamily: 'AvenirLTProMedium',
        fontSize: RFPercentage(2.5)
    },
    changeText: {
        color: '#055DE2'
    },
    checkboxContainer: {
        backgroundColor: 'white',
        borderColor: 'white',
        margin: 0,
        padding: 0,
        width: 160
    },
    container: {
        backgroundColor: Colors.table.grey,
        flexGrow: 1,
        paddingHorizontal: 20
    },
    containerLoan: {
        backgroundColor: Colors.table.grey,
        marginVertical: RFPercentage(1.2),
        padding: 2
    },
    content: {
        textAlign: 'center'
    },
    depositBranchText: {
        color: BLUE_DARK,
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(2),
        textTransform: 'capitalize'
    },
    depositBranchTextGrey: {
        color: GREY_2,
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(2),
        textTransform: 'capitalize'
    },
    depositMethodContainer: {
        marginVertical: RFPercentage(2)
    },
    dropDownContainer: {
        elevation: 10,
        marginHorizontal: 0
    },
    dropdownHeading: {
        padding: RFPercentage(1)
    },
    dropdownStyle: {
        backgroundColor: '#fff',
        borderRadius: 4,
        elevation: 2,
        marginVertical: RFPercentage(1.2),
        paddingVertical: 2
    },
    header: {
        color: '#909195',
        textAlign: 'center'
    },
    innerDropdownStyle: {
        backgroundColor: '#fff',
        margin: 0,
        padding: 0
    },
    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 0
    },
    key: {
        color: 'black',
        flex: 7,
        fontFamily: 'poppins'
    },
    labelStyle: {
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(1.6),
        marginHorizontal: RFPercentage(0.5),
        marginVertical: RFPercentage(0.5)
    },
    paymentContainer: {
        alignItems: 'center',
        backgroundColor: Colors.table.grey,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20
    },
    paymentText: {
        color: '#393F44',
        marginRight: 5
    },
    placeHolderStyle: {
        color: '#8899A8',
        fontFamily: TypographyFontFamily.medium
    },
    placeHolderStyleDeposit: {
        color: BLUE_DARK,
        fontFamily: TypographyFontFamily.medium
    },
    receiptNumberContainer: {
        marginHorizontal: -10,
        marginTop: RFPercentage(2)
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    value: {
        flex: 5,
        fontFamily: 'poppins'
    }
});
