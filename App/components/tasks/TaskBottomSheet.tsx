import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, ToastAndroid, View } from 'react-native';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView
} from '@gorhom/bottom-sheet';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BLUE_DARK, BLUE_LIGHT, RED } from '../../constants/Colors';
import { ProgressDialog } from '../common/Dialogs/ProgessDialog';
import { Button } from '@rneui/base';
import { verifyVisitOtp } from '../../services/taskService';
import { OTPSuccessImage } from '../common/Icons/OtpSuccessImage';
import {
    SOMETHING_WENT_WRONG,
    otp_max_try_error_string
} from '../../constants/constants';
import { OtpVerifyTypes } from '../../../enums';

export const TaskBottomSheet = React.forwardRef((props: any, ref) => {
    const { data, resendOtp, taskSubmit, type, otp, setOtp } = props;

    const snapPoints = useMemo(() => ['65%', '75%'], []);
    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            Keyboard.dismiss();
            props.onClose && props?.onClose?.();
        }
        if (index === 0) {
            setOtp('');
            setShowOtpScreen(true);
        }
    }, []);
    const renderBackdrop = useCallback(
        (props) => <BottomSheetBackdrop disappearsOnIndex={-1} {...props} />,
        []
    );
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [showOtpScreen, setShowOtpScreen] = useState(true);
    const [showError, setShowError] = useState<string | undefined>('');
    const resend = async () => {
        ToastAndroid.show('Resending OTP..', ToastAndroid.LONG);
        if ((await resendOtp()) != 200) onError(otp_max_try_error_string, 6000);
        props.setResendTime(30);
    };

    useEffect(() => {
        const timer = setInterval(
            () => props.setResendTime((prev: number) => prev - 1),
            1000
        );
        return () => clearInterval(timer);
    }, [props.resendTime]);

    const checkEnteredOTP = async () => {
        onError(undefined);
        if (otp.length != 5) {
            onError('Invalid OTP');
            return;
        }
        const verifyOTPdata = {
            destination:
                type == OtpVerifyTypes.visit ? data.visit_id : data.unique_id,
            otp_type: type,
            otp: otp ?? ''
        };
        setVerifyLoading(true);
        if (type == OtpVerifyTypes.deposit) {
            const apiResponse = await taskSubmit();
            if (apiResponse) {
                ref?.current?.close?.();
            } else {
                onError('Please provide correct OTP');
            }
        } else {
            try {
                const apiResponse = await verifyVisitOtp(verifyOTPdata);
                if (apiResponse) {
                    if (apiResponse.status == 200) {
                        setShowOtpScreen(false);
                        setTimeout(() => {
                            ref?.current?.close?.();
                            taskSubmit();
                        }, 2000);
                    }
                }
            } catch (e) {
                setOtp('');
                if (e.response.status == 500) {
                    onError(SOMETHING_WENT_WRONG);
                } else onError('Invalid OTP');
            }
        }
        setVerifyLoading(false);
    };

    const onError = (text: string | undefined, time = 3000) => {
        setShowError(text);
        if (text && text.length)
            setTimeout(() => setShowError(undefined), time);
    };

    let otpContainerBaseStyles = styles.underlineStyleBase;
    if (showError) {
        otpContainerBaseStyles = {
            ...otpContainerBaseStyles,
            borderColor: RED
        };
    }

    function SuccessBottomSheet() {
        return (
            <BottomSheetScrollView>
                <View style={styles.bottomSheetConatiner}>
                    <OTPSuccessImage />
                    <Typography
                        style={{
                            color: '#06C270',
                            marginTop: RFPercentage(1.5)
                        }}
                        variant={TypographyVariants.heading2}
                    >
                        Great!!
                    </Typography>
                    <Typography
                        style={{ marginTop: RFPercentage(1.3) }}
                        variant={TypographyVariants.body2}
                    >
                        {`${
                            type == OtpVerifyTypes.visit
                                ? 'Collection'
                                : 'Deposit'
                        } Done Successfully`}
                    </Typography>
                </View>
            </BottomSheetScrollView>
        );
    }

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            keyboardBehavior="interactive"
        >
            <ProgressDialog title="Verifying OTP" visible={verifyLoading} />
            {showOtpScreen ? (
                <>
                    <>
                        <Typography
                            variant={TypographyVariants.heading2}
                            style={styles.header}
                        >
                            Verification Code
                        </Typography>
                        <Typography
                            variant={TypographyVariants.caption}
                            style={styles.enterOtpText}
                        >
                            Please enter the 5-digit OTP sent to
                        </Typography>
                        <Typography
                            variant={TypographyVariants.caption}
                            style={styles.numberText}
                        >
                            {data?.contact_number}
                        </Typography>
                        {data?.email_address ? (
                            <Typography
                                variant={TypographyVariants.caption}
                                style={styles.numberText}
                            >
                                and {data?.email_address}
                            </Typography>
                        ) : null}

                        {props.otpInput && (
                            <OTPInputView
                                pinCount={5}
                                style={styles.otpContainer}
                                code={otp}
                                onCodeChanged={(text) => setOtp(text)}
                                codeInputFieldStyle={otpContainerBaseStyles}
                                codeInputHighlightStyle={
                                    styles.underlineStyleHighLighted
                                }
                            />
                        )}

                        {!!showError && showError.length > 0 && (
                            <Typography
                                variant={TypographyVariants.body3}
                                style={styles.errorText}
                            >
                                {showError}
                            </Typography>
                        )}

                        <Button
                            onPress={() => {
                                checkEnteredOTP();
                            }}
                            title="Submit"
                            titleStyle={styles.buttonTitle}
                            buttonStyle={styles.buttonContainer}
                        />
                    </>
                    <>
                        {props.resendTime > 0 && (
                            <>
                                <View style={{ marginTop: 20 }}>
                                    <Typography
                                        variant={TypographyVariants.caption}
                                        style={styles.resendText}
                                    >
                                        Resend in {props.resendTime} seconds
                                    </Typography>
                                </View>
                            </>
                        )}
                        {props.resendTime <= 0 && (
                            <View style={styles.resendContainer}>
                                <Typography
                                    style={{ marginRight: 5 }}
                                    variant={TypographyVariants.body2}
                                >
                                    Didn't receive the OTP?
                                </Typography>

                                <Typography
                                    style={{ textDecorationLine: 'underline' }}
                                    onPress={resend}
                                    variant={TypographyVariants.title1}
                                >
                                    Resend
                                </Typography>
                            </View>
                        )}
                    </>
                </>
            ) : (
                <SuccessBottomSheet />
            )}
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    bottomSheetConatiner: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    buttonContainer: {
        alignSelf: 'center',
        backgroundColor: '#043E90',
        marginTop: RFPercentage(11),
        paddingVertical: RFPercentage(1.2),
        width: '50%'
    },
    buttonTitle: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2.5)
    },
    enterOtpText: {
        marginTop: 10,
        textAlign: 'center'
    },
    errorText: {
        color: RED,
        marginTop: 15,
        paddingHorizontal: 40,
        textAlign: 'center'
    },
    header: {
        marginTop: RFPercentage(4),
        textAlign: 'center'
    },
    numberText: {
        marginTop: 5,
        textAlign: 'center'
    },
    otpContainer: {
        alignSelf: 'center',
        height: RFPercentage(8),
        marginTop: RFPercentage(6),
        width: '90%'
    },
    resendContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: RFPercentage(4)
    },
    resendText: {
        alignSelf: 'center',
        color: BLUE_LIGHT,
        marginTop: RFPercentage(1)
    },
    underlineStyleBase: {
        borderBottomWidth: 1,
        borderRadius: RFPercentage(1),
        borderWidth: 1,
        color: BLUE_DARK,
        height: RFPercentage(7),
        width: RFPercentage(6)
    },
    underlineStyleHighLighted: {
        borderColor: BLUE_DARK
    }
});
