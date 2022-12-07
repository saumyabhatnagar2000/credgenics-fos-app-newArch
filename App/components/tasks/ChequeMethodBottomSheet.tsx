import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetBackgroundProps,
    BottomSheetScrollView,
    BottomSheetTextInput
} from '@gorhom/bottom-sheet';
import Animated, {
    interpolateColor,
    useAnimatedStyle
} from 'react-native-reanimated';
import PaymentSheetHandle from './PaymentBottomSheet/PaymentSheetHandle';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BLUE_3, BLUE_DARK, BLUE_LIGHT, GREY_2 } from '../../constants/Colors';
import DateTimeInputBox from '../common/DateTimePicker';
import CustomButton from '../ui/CustomButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { EditIcon } from '../common/Icons/EditIcon';
import { ChequeDetailsErrorType } from '../../../types';
import { maskDetails } from '../../services/utils';

const MIN_ALLOWED_DATE = '2000-01-01';

const ChequeMethodBottomSheet = React.forwardRef((props: any, ref) => {
    const {
        setChequePaymentFormData,
        chequePaymentFormData,
        isEditClicked,
        setIsEditClicked
    } = props;
    const [chequeNumber, setChequeNumber] = useState('');
    const [chequeNumberMasked, setChequeNumberMasked] = useState('');
    const [chequeDate, setChequeDate] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountNumberMasked, setAccountNumberMasked] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [bankName, setBankName] = useState('');
    const [branchName, setBranchName] = useState('');
    const [errorObject, setErrorsObject] = useState<ChequeDetailsErrorType>({});

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) props.onClose?.();
    }, []);

    const snapPoints = useMemo(() => {
        return ['4%', '56%', '65%'];
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

    useEffect(() => {
        if (isEditClicked) {
            ref?.current?.snapToIndex(2);
        } else {
            ref?.current?.snapToIndex(1);
        }
    }, [isEditClicked]);

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

    const validateChequeData = () => {
        let errors: ChequeDetailsErrorType = {};
        if (chequeNumber.length == 0) {
            errors.cheque_number = 'Cheque number is required';
        }
        if (chequeDate.length == 0) {
            errors.cheque_date = 'Cheque date is required';
        }
        if (accountNumber.length == 0) {
            errors.account_number = 'Account number is required';
        }
        if (ifscCode.length == 0) {
            errors.ifsc_code = 'IFSC code is required';
        }
        if (bankName.length == 0) {
            errors.bank_name = 'Bank name is required';
        }
        if (branchName.length == 0) {
            errors.branch_name = 'Branch name is required';
        }
        return errors;
    };

    const onSaveClicked = () => {
        let tempErrorObject = validateChequeData();
        setErrorsObject(tempErrorObject);
        if (Object.keys(tempErrorObject).length != 0) {
            ToastAndroid.show(
                'Please fill the required details',
                ToastAndroid.SHORT
            );
            return;
        }
        if (Object.keys(validateChequeData())?.length == 0) {
            setChequePaymentFormData({
                cheque_number: chequeNumber,
                cheque_date: chequeDate,
                account_number: accountNumber,
                ifsc_code: ifscCode,
                bank_name: bankName,
                branch_name: branchName
            });

            setChequeNumberMasked(maskDetails(chequeNumber, 2));
            setAccountNumberMasked(maskDetails(accountNumber, 4));
            setIsEditClicked(false);
            ref?.current?.snapToIndex(1);
        }
    };

    const onCancelClicked = () => {
        ref?.current?.snapToIndex(0);
    };

    const getContent = () => {
        return (
            <View style={styles.container}>
                {Object.keys(chequePaymentFormData)?.length > 0 ? (
                    <View style={styles.editContainer}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.editText}
                            onPress={() => setIsEditClicked(!isEditClicked)}
                        >
                            <Typography
                                variant={TypographyVariants.caption}
                                style={{
                                    ...(isEditClicked
                                        ? styles.editIconGrey
                                        : styles.editIconBlue),
                                    ...styles.editIcon
                                }}
                            >
                                Edit
                            </Typography>
                            <EditIcon color={isEditClicked ? GREY_2 : BLUE_3} />
                        </TouchableOpacity>
                    </View>
                ) : null}

                <View style={styles.dataWrapper}>
                    <Typography
                        variant={TypographyVariants.title1}
                        style={styles.titleContainer}
                    >
                        Cheque No.
                    </Typography>
                    {isEditClicked ? (
                        <BottomSheetTextInput
                            style={[styles.inputContainer]}
                            placeholder={`xxxxxx`}
                            placeholderTextColor={GREY_2}
                            value={chequeNumber}
                            onChangeText={setChequeNumber}
                            keyboardType={'numeric'}
                        />
                    ) : (
                        <View style={styles.textContainer}>
                            <Typography variant={TypographyVariants.body2}>
                                {chequeNumberMasked}
                            </Typography>
                        </View>
                    )}
                </View>
                <View style={styles.dataWrapper}>
                    <Typography
                        variant={TypographyVariants.title1}
                        style={styles.titleContainer}
                    >
                        Cheque Date
                    </Typography>
                    {isEditClicked ? (
                        <View style={styles.dateContainer}>
                            <DateTimeInputBox
                                placeholder={
                                    chequePaymentFormData?.cheque_date ??
                                    'YYYY-MM-DD'
                                }
                                type={'date'}
                                textStyle={{
                                    fontSize: RFPercentage(1.8),
                                    fontFamily: TypographyFontFamily.medium
                                }}
                                setText={setChequeDate}
                                containerStyle={styles.datePickerContainer}
                                wrapper={{
                                    marginLeft: RFPercentage(-1.7),
                                    marginVertical: RFPercentage(-1.2)
                                }}
                                inputTextColor={BLUE_DARK}
                                minimumDate={new Date(MIN_ALLOWED_DATE)}
                            />
                        </View>
                    ) : (
                        <View style={styles.textContainer}>
                            <Typography variant={TypographyVariants.body1}>
                                {chequeDate}
                            </Typography>
                        </View>
                    )}
                </View>
                <View style={styles.dataWrapper}>
                    <Typography
                        variant={TypographyVariants.title1}
                        style={styles.titleContainer}
                    >
                        Account Number
                    </Typography>
                    {isEditClicked ? (
                        <BottomSheetTextInput
                            style={[styles.inputContainer]}
                            placeholder={`xxxx xxxxxx xxx xxx`}
                            placeholderTextColor={GREY_2}
                            value={accountNumber}
                            onChangeText={setAccountNumber}
                            keyboardType={'numeric'}
                        />
                    ) : (
                        <View style={styles.textContainer}>
                            <Typography variant={TypographyVariants.body1}>
                                {accountNumberMasked}
                            </Typography>
                        </View>
                    )}
                </View>
                <View style={styles.dataWrapper}>
                    <Typography
                        variant={TypographyVariants.title1}
                        style={styles.titleContainer}
                    >
                        IFSC Code
                    </Typography>
                    {isEditClicked ? (
                        <BottomSheetTextInput
                            style={[styles.inputContainer]}
                            placeholder={`xxxx xxxxxxx`}
                            placeholderTextColor={GREY_2}
                            value={ifscCode}
                            onChangeText={setIfscCode}
                        />
                    ) : (
                        <View style={styles.textContainer}>
                            <Typography variant={TypographyVariants.body1}>
                                {ifscCode}
                            </Typography>
                        </View>
                    )}
                </View>
                <View style={styles.dataWrapper}>
                    <Typography
                        variant={TypographyVariants.title1}
                        style={styles.titleContainer}
                    >
                        Bank Name
                    </Typography>
                    {isEditClicked ? (
                        <BottomSheetTextInput
                            style={[styles.inputContainer]}
                            placeholder={`For eg. HDFC`}
                            placeholderTextColor={GREY_2}
                            value={bankName}
                            onChangeText={setBankName}
                        />
                    ) : (
                        <View style={styles.textContainer}>
                            <Typography variant={TypographyVariants.body1}>
                                {bankName}
                            </Typography>
                        </View>
                    )}
                </View>
                <View style={styles.dataWrapper}>
                    <Typography
                        variant={TypographyVariants.title1}
                        style={styles.titleContainer}
                    >
                        Branch Name
                    </Typography>
                    {isEditClicked ? (
                        <BottomSheetTextInput
                            style={[styles.inputContainer]}
                            placeholder={`For eg. Sector 12`}
                            placeholderTextColor={GREY_2}
                            value={branchName}
                            onChangeText={setBranchName}
                        />
                    ) : (
                        <View style={styles.textContainer}>
                            <Typography variant={TypographyVariants.body1}>
                                {branchName}
                            </Typography>
                        </View>
                    )}
                </View>
                {isEditClicked ? (
                    <View style={styles.buttonContainer}>
                        <View style={{ marginRight: 5 }}>
                            <CustomButton
                                style={styles.buttonStyle}
                                variant={TypographyVariants.body3}
                                title="Save"
                                onPress={onSaveClicked}
                            />
                        </View>
                        <View style={{ marginLeft: 5 }}>
                            <CustomButton
                                style={styles.buttonStyle}
                                variant={TypographyVariants.body3}
                                title="Cancel"
                                type="transparent"
                                onPress={onCancelClicked}
                            />
                        </View>
                    </View>
                ) : null}
            </View>
        );
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
            <BottomSheetScrollView>{getContent()}</BottomSheetScrollView>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttonStyle: {
        marginTop: RFPercentage(3),
        paddingHorizontal: 17,
        width: '100%'
    },
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '10%',
        paddingHorizontal: '4%'
    },
    dataWrapper: {
        flexDirection: 'row',
        marginTop: RFPercentage(2)
    },

    dateContainer: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    datePickerContainer: {
        backgroundColor: '#fff',
        borderColor: BLUE_LIGHT,
        borderRadius: 5,
        borderWidth: 0.5,
        color: BLUE_LIGHT,
        fontFamily: TypographyFontFamily.normal,
        marginVertical: RFPercentage(1.4),
        minHeight: RFPercentage(5),
        paddingHorizontal: RFPercentage(1.5),
        padding: 0
    },
    editContainer: {
        alignSelf: 'flex-end',
        justifyContent: 'center',
        padding: 2
    },
    editIcon: {
        fontSize: RFPercentage(2),
        marginRight: 5,
        textDecorationLine: 'underline'
    },
    editIconBlue: {
        color: BLUE_3
    },
    editIconGrey: {
        color: GREY_2
    },
    editText: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderColor: BLUE_DARK,
        borderRadius: 5,
        borderWidth: 0.5,
        color: BLUE_DARK,
        flex: 1,
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.8),
        height: RFPercentage(5.5),
        lineHeight: 19,
        paddingHorizontal: RFPercentage(1.5)
    },
    textContainer: {
        borderColor: BLUE_LIGHT,
        flex: 1,
        marginLeft: RFPercentage(1),
        marginVertical: RFPercentage(1.4),
        paddingHorizontal: RFPercentage(1.5)
    },
    titleContainer: {
        alignSelf: 'center',
        flex: 1,
        fontSize: RFPercentage(2.1),
        lineHeight: 21
    }
});

export default ChequeMethodBottomSheet;
