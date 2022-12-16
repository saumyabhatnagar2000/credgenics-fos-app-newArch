import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    ImageBackground,
    StyleSheet,
    ToastAndroid,
    View
} from 'react-native';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetBackgroundProps,
    BottomSheetFlatList,
    BottomSheetScrollView,
    BottomSheetTextInput
} from '@gorhom/bottom-sheet';
import PaymentsInfoAsset from '../../../assets/payments/PaymentsInfo';
import PaymentsLinkSentAsset from '../../../assets/payments/PaymentsLinkSent';
import PaymentsLinkErrorAsset from '../../../assets/payments/PaymentsLinkError';
import {
    BankTransferType,
    DepositBranchType,
    ImageInputType,
    OnlineTabsType,
    TaskType
} from '../../../../types';
import ProofSelectorContainer from '../../common/ProofSelector/ProofSelector';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../../ui/Typography';
import { useAuth } from '../../../hooks/useAuth';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { CustomRadioButton } from '../../ui/CustomRadioButton';
import CustomButton from '../../ui/CustomButton';
import Colors, {
    BLUE_2,
    BLUE_DARK,
    CANCEL_RED,
    GREEN,
    GREY_3
} from '../../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { sendPaymentLink } from '../../../services/communicationService';
import {
    checkProofAttached,
    showToast,
    StringCompare
} from '../../../services/utils';
import { useTaskAction } from '../../../hooks/useTaskAction';
import { ChevronLeft } from '../../common/Icons/ChevronLeft';
import Animated, {
    interpolateColor,
    useAnimatedStyle
} from 'react-native-reanimated';
import { CheckBox } from '@rneui/base';
import PaymentSheetHandle from './PaymentSheetHandle';
import QRCode from 'react-native-qrcode-svg';
import { CrossIcon } from '../../common/Icons/CrossIcon';
import { SOMETHING_WENT_WRONG } from '../../../constants/constants';
import { Tab } from '../../ui/Tab';
import { AddContactNumberComponent } from '../../common/AddContactNumber';
import { LinearGradientHOC } from '../../ui/LinearGradientHOC';
import { getBranchDetails } from '../../../services/depositService';
import {
    BankBranchType,
    CollectionModeTypes,
    ExpandableCardTypes,
    PAYMENT_TYPES,
    ToastTypes
} from '../../../../enums';
import ExpandableCardHelpSection from '../../common/ExpandableCard/ExpandableCardHelpSection';
import { BankBranchIcon } from '../../common/Icons/BankBranchIcon';
import { useNavigation } from '@react-navigation/native';
import DateTimeInputBox from '../../common/DateTimePicker';
import Disabled from '../../common/Disabled';
import CustomBottomSheetTextInput from '../../common/CustomBottomSheetTextInput';

enum PAYMENT_SHEET_STATES {
    info = 'info',
    success = 'success',
    error = 'error'
}

const GREY = '#8899A8CC';

const MIN_ALLOWED_DATE = '2000-01-01';

const PaymentSheetStates = {
    sendLink: 0,
    linkSent: 1,
    error: 2
};

function getAsset(state: PAYMENT_SHEET_STATES) {
    switch (state) {
        case PAYMENT_SHEET_STATES.info:
            return <PaymentsInfoAsset />;
        case PAYMENT_SHEET_STATES.success:
            return <PaymentsLinkSentAsset />;
        case PAYMENT_SHEET_STATES.error:
            return <PaymentsLinkErrorAsset />;
        default:
            return <PaymentsLinkErrorAsset />;
    }
}

const proofs: Array<ImageInputType> = [
    {
        title: 'Proof of Collection',
        show: true,
        imageTag: 'recovery'
    }
];

const BLUR_QR = require('../../../assets/payments/qr_blur.jpg');

const OTP_TYPES_KEYS = {
    sms: 'sms',
    email: 'email'
};

const OTP_TYPES = {
    sms: 'SMS',
    email: 'E-mail'
};

const bankBranchDetails = {
    title: BankBranchType.bank,
    icon: <BankBranchIcon />
};

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
    style,
    animatedIndex
}) => {
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            animatedIndex.value,
            [0, 1],
            ['#043E9055', '#fff']
        )
    }));
    const containerStyle = useMemo(
        () => [
            style,
            containerAnimatedStyle,
            { borderTopLeftRadius: 10, borderTopRightRadius: 10 }
        ],
        [style, containerAnimatedStyle]
    );

    return <Animated.View pointerEvents="none" style={containerStyle} />;
};
const ContactRow = ({ detail, checked, onCheckboxClicked }: any) => {
    return (
        <TouchableOpacity
            onPress={onCheckboxClicked}
            activeOpacity={0.7}
            style={styles.contactRow}
        >
            <View style={{}}>
                <CheckBox
                    uncheckedColor={Colors.common.uncheckedCheckBox}
                    checkedColor={BLUE_2}
                    size={RFPercentage(2.5)}
                    iconType="material"
                    checkedIcon="check-box"
                    uncheckedIcon="check-box-outline-blank"
                    checked={checked}
                    containerStyle={{ padding: 0 }}
                />
            </View>
            <View style={{}}>
                <Typography
                    variant={TypographyVariants.body2}
                    style={{
                        color: '#043E90',
                        fontSize: RFPercentage(1.8)
                    }}
                >
                    {detail}
                </Typography>
            </View>
        </TouchableOpacity>
    );
};

const BankTransferScreen = ({
    isExpanded,
    setIsExpanded,
    extraData,
    paymentDate,
    setPaymentDate,
    utrNumber,
    setUtrNumber,
    onBankTransferClicked,
    depositBranch,
    showBankTransferError
}: any) => {
    return (
        <View style={styles.bankTransferView}>
            <View style={styles.dropdownStyle}>
                <ExpandableCardHelpSection
                    dataList={bankBranchDetails}
                    type={ExpandableCardTypes.bankTransfer}
                    isOpened={isExpanded}
                    setIsOpened={setIsExpanded}
                    extraData={extraData}
                />
            </View>
            <Disabled isDisable={!depositBranch}>
                <Typography
                    variant={TypographyVariants.caption3}
                    style={styles.labelContainer}
                >
                    *Payment Date
                </Typography>
                <DateTimeInputBox
                    placeholder={!!paymentDate ? paymentDate : 'YYYY-MM-DD'}
                    type={'date'}
                    textStyle={{
                        fontSize: RFPercentage(1.8),
                        fontFamily: TypographyFontFamily.medium
                    }}
                    setText={setPaymentDate}
                    containerStyle={styles.datePickerContainer}
                    wrapper={{ marginHorizontal: RFPercentage(0.8) }}
                    inputTextColor={BLUE_DARK}
                    minimumDate={new Date(MIN_ALLOWED_DATE)}
                    maximumDate={new Date()}
                    showError={showBankTransferError?.showPaymentDateError}
                    errorMsg={'Payment date is required'}
                />

                <Typography
                    variant={TypographyVariants.caption3}
                    style={styles.labelContainer}
                >
                    *UTR Number
                </Typography>
                <CustomBottomSheetTextInput
                    containerStyle={styles.inputContainer}
                    placeholder={'for eg. 34567890'}
                    onChangeText={setUtrNumber}
                    defaultValue={!!utrNumber && utrNumber}
                    showError={showBankTransferError?.showUtrNumberError}
                    errorMsg={'UTR number is required'}
                />
                <CustomButton
                    style={styles.buttonStyleBankTransfer}
                    variant={TypographyVariants.body3}
                    title="Next"
                    onPress={onBankTransferClicked}
                />
            </Disabled>
        </View>
    );
};

const PaymentLinkBottomSheet = React.forwardRef((props: any, ref) => {
    const { authData, depositBranch, onlineCollectionMode } = useAuth();
    const { imageProvider, onlineTabChangeIdx, setOnlineTabChangeIdx } =
        useTaskAction();
    const { navigate } = useNavigation();

    const {
        loanData,
        allocationMonth,
        emailIds,
        mobileNumbers,
        setEmailArray,
        setMobileArray,
        loanDetails,
        collectionAmount,
        visit_id,
        onlinePaymentLink,
        isPaymentTemplatePresent,
        bankTransferFormData,
        setBankTransferFormData,
        paymentType,
        setPaymentType,
        paymentDate,
        setPaymentDate,
        utrNumber,
        setUtrNumber
    } = props;

    const {
        loan_id = '',
        applicant_type = 'applicant',
        applicant_index = 0,
        applicant_name = ''
    } = loanData as TaskType;

    const [otpType, setOtpType] = useState(OTP_TYPES.sms);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(PaymentSheetStates.sendLink);
    const [selected, setSelected] = useState({});
    const [newContactDetail, setnewContactDetail] = useState('');
    const [showQrCode, setShowQrCode] = useState(false);
    const [isBranchDetailsPresent, setIsBranchDetailsPresent] = useState({
        company: false,
        bank: false
    });
    const [bankBranch, setBankBranch] = useState<Array<DepositBranchType>>([]);
    const [companyBranch, setCompanyBranch] = useState<
        Array<DepositBranchType>
    >([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [tabs, setTabs] = useState<Array<OnlineTabsType>>([]);
    const [showBankTransferError, setShowBankTransferError] = useState({
        showPaymentDateError: false,
        showUtrNumberError: false
    });

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) props.onClose?.();
    }, []);

    const handleDepositLocationPress = (title: string) => {
        handleBranchClick(title);
    };

    const extraData = {
        handlePress: handleDepositLocationPress
    };

    useEffect(() => {
        let collection_modes = onlineCollectionMode.split(',');
        let tempCollectionArr = [];
        if (collection_modes.includes(CollectionModeTypes.payment_link_qr)) {
            tempCollectionArr.push(
                PAYMENT_TYPES.qrLink,
                PAYMENT_TYPES.paymentLink
            );
        }
        if (collection_modes.includes(CollectionModeTypes.bank_transfer)) {
            tempCollectionArr.push(PAYMENT_TYPES.bankTransfer);
        }
        let tempTabs: any = [];
        tempCollectionArr.map((mode, idx) => {
            if (StringCompare(mode, PAYMENT_TYPES.qrLink)) {
                tempTabs.push({
                    active: idx === onlineTabChangeIdx,
                    label: PAYMENT_TYPES.qrLink,
                    screen: <GenerateQRScreen />
                });
            } else if (StringCompare(mode, PAYMENT_TYPES.paymentLink)) {
                tempTabs.push({
                    active: idx === onlineTabChangeIdx,
                    label: PAYMENT_TYPES.paymentLink,
                    screen: <SendPaymentLinkScreen />
                });
            } else if (StringCompare(mode, PAYMENT_TYPES.bankTransfer)) {
                tempTabs.push({
                    active: idx === onlineTabChangeIdx,
                    label: PAYMENT_TYPES.bankTransfer,
                    screen: (
                        <BankTransferScreen
                            isExpanded={isExpanded}
                            setIsExpanded={setIsExpanded}
                            extraData={extraData}
                            paymentDate={paymentDate}
                            setPaymentDate={setPaymentDate}
                            utrNumber={utrNumber}
                            setUtrNumber={setUtrNumber}
                            onBankTransferClicked={onBankTransferClicked}
                            depositBranch={depositBranch}
                            showBankTransferError={showBankTransferError}
                        />
                    )
                });
            }
        });
        setTabs(tempTabs);
    }, [
        onlineCollectionMode,
        isBranchDetailsPresent,
        bankBranch,
        depositBranch,
        paymentDate,
        utrNumber,
        showQrCode,
        otpType,
        newContactDetail,
        emailIds,
        mobileNumbers,
        selected,
        showBankTransferError
    ]);

    useEffect(() => {
        setSelected({});
        setnewContactDetail('');
    }, [otpType]);

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

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                disappearsOnIndex={0}
                appearsOnIndex={1}
                pressBehavior={0}
                {...props}
            />
        ),
        []
    );

    const snapPoints = useMemo(() => {
        if (step === PaymentSheetStates.linkSent) return ['6%', '75%'];
        return ['6%', '65%', '100%'];
    }, [step]);

    const onResendClick = () => setStep(PaymentSheetStates.sendLink);
    const onCrossClick = () => {
        ref?.current?.close();
    };

    const onTryOtherModeClick = () => {
        ref?.current?.close();
    };

    const onNextClicked = () => {
        ref?.current?.snapToIndex(0);
        setStep(PaymentSheetStates.sendLink);
        setShowQrCode(false);
    };

    const onClickGenerateCode = () => {
        if (onlinePaymentLink.length > 0) {
            setShowQrCode(true);
            setPaymentType(PAYMENT_TYPES.qrLink);
            setOnlineTabChangeIdx(0);
        } else {
            showToast('No Payment link found! Please check with your admin');
        }
    };

    const validateBankTransferData = () => {
        if (paymentDate.length === 0) {
            setShowBankTransferError((prev) => ({
                ...prev,
                showPaymentDateError: true
            }));
        } else
            setShowBankTransferError((prev) => ({
                ...prev,
                showPaymentDateError: false
            }));
        if (utrNumber.length === 0) {
            setShowBankTransferError((prev) => ({
                ...prev,
                showUtrNumberError: true
            }));
        } else
            setShowBankTransferError((prev) => ({
                ...prev,
                showUtrNumberError: false
            }));
        if (paymentDate.length === 0 || utrNumber.length === 0) return false;
        return true;
    };

    const onBankTransferClicked = () => {
        if (onlineCollectionMode.split(',').length == 1)
            setOnlineTabChangeIdx(0);
        else setOnlineTabChangeIdx(2);
        if (validateBankTransferData()) {
            setBankTransferFormData({
                payment_date: paymentDate,
                utr_number: utrNumber,
                branch_id: depositBranch?.branch_id,
                mode: 'bank_transfer'
            });
            ref?.current?.snapToIndex(1);
            setStep(PaymentSheetStates.linkSent);
            setPaymentType(PAYMENT_TYPES.bankTransfer);
        }
    };

    const onSendClicked = async () => {
        if (
            (!isPaymentTemplatePresent.email && otpType == OTP_TYPES.email) ||
            (!isPaymentTemplatePresent.sms && otpType == OTP_TYPES.sms)
        ) {
            setStep(PaymentSheetStates.error);
            setPaymentType(PAYMENT_TYPES.paymentLink);
            return;
        }
        if (!loan_id) {
            ToastAndroid.show('Loan ID not found', ToastAndroid.LONG);
            return;
        }
        setLoading(true);
        try {
            const otpValue =
                otpType == OTP_TYPES.email
                    ? OTP_TYPES_KEYS.email
                    : OTP_TYPES_KEYS.sms;

            const sendPaymentResponse = await sendPaymentLink(
                loan_id,
                otpValue,
                allocationMonth,
                applicant_type,
                applicant_index,
                applicant_name,
                collectionAmount,
                Object.keys(selected).length != 0
                    ? Object.keys(selected).length
                    : otpType == OTP_TYPES.email
                    ? emailIds.length
                    : mobileNumbers.length,
                Object.keys(selected).toString(),
                visit_id,
                authData
            );
            if (sendPaymentResponse?.data?.output) {
                setStep(PaymentSheetStates.linkSent);
                setPaymentType(PAYMENT_TYPES.paymentLink);
            }
        } catch (e) {
            ToastAndroid.show('Some error occurred.', ToastAndroid.SHORT);
            setStep(PaymentSheetStates.error);
            setPaymentType(PAYMENT_TYPES.paymentLink);
        } finally {
            setLoading(false);
        }
    };

    const getContent = (stepNumber: number) => {
        switch (stepNumber) {
            case PaymentSheetStates.sendLink:
                return (
                    <View>
                        <Tab
                            tabs={tabs}
                            handleTabChange={handleTabChange}
                            containerStyle={styles.tabContainer}
                            tabStyle={{
                                height: RFPercentage(3.5),
                                borderWidth: 0,
                                borderBottomWidth: 2,
                                borderRadius: 0
                            }}
                            tabLabelStyle={TypographyVariants.caption3}
                        />
                        <View>
                            {tabs &&
                                tabs?.map((tab) =>
                                    tab.active ? tab.screen : null
                                )}
                        </View>
                    </View>
                );

            case PaymentSheetStates.linkSent:
                let commAddresses: any;
                if (Object.keys(selected).length == 0) {
                    commAddresses =
                        otpType == OTP_TYPES.email ? emailIds : mobileNumbers;
                } else commAddresses = Object.keys(selected);
                const commAddressesList = commAddresses.join(', ');
                const isImageAvailable = checkProofAttached(
                    true,
                    imageProvider('recovery')
                );

                return (
                    <BottomSheetScrollView>
                        <View style={styles.container}>
                            <View style={styles.assetContainer}>
                                {getAsset(PAYMENT_SHEET_STATES.success)}
                            </View>
                            <View style={styles.linkSentContainer}>
                                <AntDesign
                                    name="check"
                                    color={GREEN}
                                    size={20}
                                />
                                <Typography
                                    style={styles.linkSentText}
                                    variant={TypographyVariants.body3}
                                >
                                    {paymentType === PAYMENT_TYPES.paymentLink
                                        ? `Payment Link Sent Successfully\n to ${commAddressesList}`
                                        : paymentType ===
                                          PAYMENT_TYPES.bankTransfer
                                        ? 'Bank transfer details added successfully'
                                        : 'Payment attempted through QR Code Scanner'}
                                </Typography>
                            </View>

                            <ProofSelectorContainer proofs={proofs} />
                            <CustomButton
                                disabled={!isImageAvailable}
                                style={styles.buttonStyle}
                                title="Next"
                                onPress={onNextClicked}
                            />
                        </View>
                    </BottomSheetScrollView>
                );

            case PaymentSheetStates.error:
                return (
                    <View style={styles.container}>
                        <View style={styles.assetContainer}>
                            {getAsset(PAYMENT_SHEET_STATES.error)}
                        </View>

                        {loading ? (
                            <ActivityIndicator size="small" color={BLUE_DARK} />
                        ) : (
                            <>
                                <View style={styles.linkSentContainer}>
                                    <AntDesign
                                        name="close"
                                        color={CANCEL_RED}
                                        size={20}
                                    />
                                    <Typography
                                        style={[
                                            styles.linkSentText,
                                            styles.errorText
                                        ]}
                                        variant={TypographyVariants.body3}
                                    >
                                        {!isPaymentTemplatePresent.sms ||
                                        !isPaymentTemplatePresent.email
                                            ? 'No template found! Please use the QR scanner method.'
                                            : paymentType ===
                                              PAYMENT_TYPES.paymentLink
                                            ? 'Payment Link Sharing Failed'
                                            : 'QR display failed!'}
                                    </Typography>
                                </View>
                                {paymentType == PAYMENT_TYPES.paymentLink &&
                                (!isPaymentTemplatePresent.sms ||
                                    !isPaymentTemplatePresent.email) ? (
                                    <></>
                                ) : (
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            marginTop: RFPercentage(4)
                                        }}
                                    >
                                        <Typography
                                            style={[
                                                styles.greyText,
                                                {
                                                    marginBottom:
                                                        RFPercentage(0.5)
                                                }
                                            ]}
                                            variant={TypographyVariants.body3}
                                        >
                                            {SOMETHING_WENT_WRONG}
                                        </Typography>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Typography
                                                style={styles.greyText}
                                                variant={
                                                    TypographyVariants.body3
                                                }
                                            >
                                                Please
                                            </Typography>
                                            <TouchableOpacity
                                                onPress={onResendClick}
                                            >
                                                <Typography
                                                    style={styles.clickableText}
                                                    variant={
                                                        TypographyVariants.body3
                                                    }
                                                >
                                                    {paymentType ===
                                                    PAYMENT_TYPES.paymentLink
                                                        ? 'Resend'
                                                        : 'Retry'}
                                                </Typography>
                                            </TouchableOpacity>
                                            <Typography
                                                variant={
                                                    TypographyVariants.body3
                                                }
                                            >
                                                or
                                            </Typography>
                                            <TouchableOpacity
                                                onPress={onTryOtherModeClick}
                                            >
                                                <Typography
                                                    style={styles.clickableText}
                                                    variant={
                                                        TypographyVariants.body3
                                                    }
                                                >
                                                    Try other mode.
                                                </Typography>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                );

            default:
                return null;
        }
    };

    const getBackButton = (stepNumber: number) => {
        if (stepNumber == PaymentSheetStates.sendLink) return null;

        return (
            <TouchableOpacity
                style={{
                    paddingHorizontal: RFPercentage(1.6),
                    alignSelf: 'flex-start'
                }}
                onPress={onResendClick}
            >
                <ChevronLeft color={BLUE_DARK} size={18} />
            </TouchableOpacity>
        );
    };
    const getCrossButton = () => {
        return (
            <TouchableOpacity
                style={{
                    paddingHorizontal: RFPercentage(1.6),
                    alignSelf: 'flex-end'
                }}
                onPress={onCrossClick}
            >
                <CrossIcon />
            </TouchableOpacity>
        );
    };

    const handleBranchClick = (branchType: string) => {
        if (!isBranchDetailsPresent.bank && branchType == BankBranchType.bank) {
            showToast(
                'Contact your supervisor to add at least one Bank details',
                ToastTypes.long
            );
            return;
        }
        navigate('DepositBranchScreen', {
            branchType: branchType,
            companyBranch,
            bankBranch
        });
    };

    const GenerateQRScreen = () => {
        return !showQrCode ? (
            <View
                style={{
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: '20%'
                }}
            >
                <ImageBackground
                    source={BLUR_QR}
                    style={{ width: 250, height: 250 }}
                />
                <LinearGradientHOC
                    colors={!onlinePaymentLink ? [GREY_3, GREY_3] : null}
                    style={styles.generateButton}
                >
                    <TouchableOpacity onPress={onClickGenerateCode}>
                        <Typography
                            variant={TypographyVariants.body2}
                            style={{ color: '#fff' }}
                        >
                            {' Generate QR'}
                        </Typography>
                    </TouchableOpacity>
                </LinearGradientHOC>
            </View>
        ) : (
            <View
                style={{
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: '20%'
                }}
            >
                <QRCode value={onlinePaymentLink} size={250} />
                <Typography
                    variant={TypographyVariants.caption1}
                    style={{
                        color: 'black',
                        textAlign: 'center',
                        marginVertical: RFPercentage(3)
                    }}
                >
                    {`Scan using the phone camera and get the \nlink to your payment gateway`}
                </Typography>
                <CustomButton
                    style={styles.buttonStyle}
                    title="Next"
                    onPress={() => setStep(PaymentSheetStates.linkSent)}
                />
            </View>
        );
    };

    const SendPaymentLinkScreen = React.useCallback(() => {
        const onRadioClicked = (checked: string) => {
            setOnlineTabChangeIdx(1);
            setOtpType(checked);
        };
        return (
            <View style={styles.container}>
                <View style={styles.selectMethodText}>
                    <Typography variant={TypographyVariants.body3}>
                        Select to send the payment link
                    </Typography>
                </View>
                <CustomRadioButton
                    checked={otpType}
                    buttons={Object.values(OTP_TYPES)}
                    setChecked={(checked: string) => onRadioClicked(checked)}
                    textStyle={styles.radioButtonText}
                    containerStyle={styles.radioButtonContainer}
                />
                <AddContactNumberComponent
                    emailIds={emailIds}
                    mobileNumbers={mobileNumbers}
                    otpType={otpType}
                    setMobileArray={setMobileArray}
                    setEmailArray={setEmailArray}
                    loanDetails={loanDetails}
                    loanData={loanData}
                />
                <View
                    style={{
                        flexDirection: 'row'
                    }}
                >
                    <BottomSheetFlatList
                        data={
                            otpType == OTP_TYPES.email
                                ? emailIds
                                : mobileNumbers
                        }
                        keyExtractor={(_data) => _data?.index?.toString()}
                        renderItem={(details) => {
                            let present: any = selected[details.item];
                            const onCheckboxClicked = () => {
                                setOnlineTabChangeIdx(1);
                                if (!present) {
                                    setSelected({
                                        ...selected,
                                        [details.item]: !present
                                    });
                                } else {
                                    delete selected[details.item];
                                    setSelected({ ...selected });
                                }
                            };
                            return (
                                <ContactRow
                                    checked={!!present}
                                    detail={details.item}
                                    onCheckboxClicked={onCheckboxClicked}
                                />
                            );
                        }}
                    />
                </View>

                {loading ? (
                    <ActivityIndicator size="small" color={BLUE_DARK} />
                ) : (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <View style={{ marginLeft: 10 }}>
                            <CustomButton
                                style={[
                                    styles.buttonStyle,
                                    { marginTop: RFPercentage(3) }
                                ]}
                                variant={TypographyVariants.body3}
                                title="Send Payment Link"
                                onPress={onSendClicked}
                            />
                        </View>
                    </View>
                )}
            </View>
        );
    }, [tabs, otpType, newContactDetail, emailIds, mobileNumbers, selected]);

    const handleTabChange = (label: string) => {
        let tabDummy = tabs;
        tabDummy.map((tab, idx) => {
            if (
                tab.label === PAYMENT_TYPES.qrLink ||
                onlineCollectionMode.split(',').length == 1
            ) {
                setOnlineTabChangeIdx(0);
            } else if (tab.label === PAYMENT_TYPES.paymentLink) {
                setOnlineTabChangeIdx(1);
            } else if (tab.label === PAYMENT_TYPES.bankTransfer) {
                setOnlineTabChangeIdx(2);
            }
            tab.active = false;
            if (tab.label === label) {
                if (tab.label == tabs[0].label)
                    setPaymentType(PAYMENT_TYPES.qrLink);
                else if (tab.label == tabs[1].label)
                    setPaymentType(PAYMENT_TYPES.paymentLink);
                else setPaymentType(PAYMENT_TYPES.bankTransfer);
                tab.active = true;
            }
        });
        setTabs([...tabDummy]);
    };

    return (
        <BottomSheet
            onChange={handleSheetChanges}
            snapPoints={snapPoints}
            ref={ref}
            index={-1}
            backdropComponent={renderBackdrop}
            backgroundComponent={CustomBackground}
            handleComponent={PaymentSheetHandle}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
        >
            {getCrossButton()}
            {getBackButton(step)}
            {getContent(step)}
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    assetContainer: {
        alignItems: 'center'
    },
    buttonStyle: {
        paddingHorizontal: 17,
        width: '100%'
    },
    buttonStyleBankTransfer: {
        width: '30%',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: RFPercentage(6),
        padding: RFPercentage(2.5)
    },
    checkboxContainer: {
        backgroundColor: '#fff',
        borderWidth: 0
    },
    checkboxText: {
        color: '#043E90',
        fontSize: RFPercentage(1.4),
        fontWeight: 'normal'
    },
    clickableText: {
        marginHorizontal: 4,
        textDecorationColor: BLUE_DARK,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid'
    },
    contactContainer: {
        backgroundColor: '#C4C4C44D',
        borderRadius: 8,
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.5),
        height: RFPercentage(5),
        marginHorizontal: RFPercentage(2),
        opacity: 0.8,
        paddingHorizontal: RFPercentage(1)
    },
    contactRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: RFPercentage(0.6)
    },
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '10%',
        paddingHorizontal: '8%',
        paddingVertical: '2%'
    },
    countryCodeContainer: {
        backgroundColor: '#C4C4C44D',
        borderRadius: 8,
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.5),
        height: RFPercentage(5),
        opacity: 0.8,
        paddingHorizontal: RFPercentage(1),
        textAlign: 'center',
        width: '15%'
    },
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: RFPercentage(0.5)
    },
    errorText: {
        color: CANCEL_RED
    },
    generateButton: {
        borderRadius: 5,
        marginVertical: RFPercentage(8),
        paddingHorizontal: RFPercentage(2.5),
        paddingVertical: RFPercentage(1)
    },
    greyText: {
        color: GREY
    },
    linkSentContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: RFPercentage(1),
        width: '90%'
    },
    linkSentText: {
        color: GREEN,
        lineHeight: RFPercentage(2.2),
        marginLeft: RFPercentage(1.2)
    },
    nameView: {
        marginBottom: RFPercentage(8),
        marginTop: RFPercentage(2),
        textTransform: 'capitalize'
    },
    qrCodeTypo: {
        color: '#555770',
        lineHeight: 20,
        marginTop: RFPercentage(2),
        textAlign: 'center'
    },
    qrContainer: {
        alignItems: 'center',
        borderColor: BLUE_DARK,
        borderRadius: 100,
        borderWidth: 1,
        justifyContent: 'center',
        padding: 5
    },
    radioButtonContainer: {
        marginVertical: RFPercentage(1.6),
        width: '80%'
    },
    radioButtonText: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2)
    },
    refContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    selectMethodText: {
        alignItems: 'center',
        marginTop: RFPercentage(2.6)
    },
    tabBarOptions: {
        alignSelf: 'center',
        backgroundColor: '#F6F8FB',
        elevation: 0,
        width: '50%'
    },
    tabContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 0,
        paddingVertical: RFPercentage(0)
    },
    tabLabel: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(1.5),
        textAlign: 'justify'
    },
    bankTransferView: {
        margin: RFPercentage(1.5)
    },
    dropdownStyle: {
        backgroundColor: '#fff',
        borderRadius: 4,
        elevation: 2,
        marginVertical: RFPercentage(1.2),
        paddingVertical: 2,
        marginHorizontal: RFPercentage(0.5)
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderColor: BLUE_DARK,
        borderRadius: 5,
        borderWidth: 0.8,
        color: BLUE_DARK,
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.8),
        height: RFPercentage(5.5),
        marginTop: RFPercentage(0.7),
        paddingHorizontal: RFPercentage(1.5),
        marginHorizontal: RFPercentage(0.7)
    },
    datePickerContainer: {
        backgroundColor: '#fff',
        borderColor: BLUE_DARK,
        borderRadius: 5,
        borderWidth: 0.7,
        color: BLUE_DARK,
        fontFamily: TypographyFontFamily.normal,
        marginTop: RFPercentage(0.7),
        minHeight: RFPercentage(5),
        paddingHorizontal: RFPercentage(1.5),
        padding: 0
    },
    labelStyle: {
        color: BLUE_DARK,
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(1.6),
        fontWeight: 'normal',
        marginBottom: RFPercentage(0.4),
        marginTop: RFPercentage(0.5)
    },
    inputStyle: {
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.8)
    },
    labelContainer: {
        marginLeft: RFPercentage(1.4),
        marginTop: RFPercentage(1)
    }
});

export default PaymentLinkBottomSheet;
