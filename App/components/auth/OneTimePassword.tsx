import React, { useEffect, useState } from 'react';
import { Button } from '@rneui/base';
import { Text, View } from '../Themed';
import { StyleSheet, ToastAndroid } from 'react-native';
import {
    checkOtp,
    generateLoginOtp,
    getUserDetails
} from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { OTPDataType } from '../../../types';
import useColorScheme from '../../hooks/useColorScheme';
import { BLUE, BLUE_DARK, BLUE_LIGHT, RED } from '../../constants/Colors';
import { ProgressDialog } from '../common/Dialogs/ProgessDialog';
import { TouchableOpacity } from 'react-native-gesture-handler';
import OTPScreenAsset from '../../assets/OTPScreenAsset';
import { RFPercentage } from 'react-native-responsive-fontsize';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import { LoginCodes } from '../../../enums';
import { useMixpanel } from '../../contexts/MixpanelContext';
import { useClockIn } from '../../hooks/useClockIn';

export default function OneTimePassword({
    style,
    otpType,
    password,
    username
}) {
    const navigation = useNavigation();
    const { verification, signIn } = useAuth();
    const { identify } = useMixpanel();
    const { autoClockOut } = useClockIn();
    const [loginOTP, setLoginOTP] = useState('');
    const [loading, setLoading] = useState(false);
    const [failureCounter, setFailureCounter] = useState(0);
    const [showError, setShowError] = useState<string | undefined>('');
    const [resendCount, setResendCount] = useState(60);
    const [resending, setResending] = useState(false);

    const theme = useColorScheme();
    const verifyOtp = async () => {
        onError(undefined);
        if (loginOTP.length != 5) {
            onError('Invalid OTP');
            return;
        }

        const loginOTPData: OTPDataType = {
            destination: username,
            otp_type: otpType,
            otp: loginOTP
        };
        try {
            setLoading(true);
            const apiResponse = await checkOtp(loginOTPData);
            if (apiResponse) {
                if (otpType == 'login') {
                    const data = apiResponse?.data;
                    const output = data?.data;
                    const request_id = output?.request_id;
                    try {
                        const response = await getUserDetails(
                            output?.authentication_token
                        );

                        if (response) {
                            const outputData =
                                response?.data?.data?.user_details;
                            let userData = {
                                authenticationtoken:
                                    output?.authentication_token,
                                userId: outputData?.user_id,
                                company_id: outputData.assigned_companies,
                                name: outputData?.name,
                                role: outputData?.role,
                                mobile: outputData?.mobile ?? '',
                                agent_id: username
                            };
                            ToastAndroid.show(
                                'Login successful',
                                ToastAndroid.SHORT
                            );

                            if (outputData?.user_id) identify(outputData);

                            await verification(userData);
                            await signIn(username, LoginCodes.email, '');
                            await autoClockOut(userData);
                        }
                    } catch (e) {
                        ToastAndroid.show(
                            'Some Error Ocurred',
                            ToastAndroid.LONG
                        );
                    }
                } else if (otpType == 'forgot') {
                    const requestId = apiResponse?.data?.data?.request_id;
                    ToastAndroid.show(
                        apiResponse?.data?.message,
                        ToastAndroid.SHORT
                    );
                    setTimeout(
                        () =>
                            navigation.navigate('NewPasswordScreen', {
                                request_id: requestId,
                                forgot_username: username
                            }),
                        300
                    );
                }
            }
        } catch (error) {
            onError(undefined);
            setLoginOTP('');
            if (error.response) {
                let output = error.response?.data?.message;
                if (failureCounter < 3) {
                    setFailureCounter(failureCounter + 1);
                    ToastAndroid.show(
                        `${2 - failureCounter} chance remaining.`,
                        ToastAndroid.SHORT
                    );
                }
                if (failureCounter === 2) {
                    if (navigation.canGoBack()) {
                        setFailureCounter(0);
                        navigation.goBack();
                    }
                }
                onError(output);
            }
        } finally {
            setLoading(false);
        }
    };

    const onError = (text: string | undefined) => {
        setShowError(text);
        if (text && text.length)
            setTimeout(() => setShowError(undefined), 3000);
    };

    const onResendOTPClicked = async () => {
        const generateOTPData: OTPDataType = {
            destination: username,
            otp_type: otpType
        };

        try {
            setResending(true);
            const apiResponse = await generateLoginOtp(generateOTPData);
            setResending(false);
            const requestID = apiResponse?.data?.data?.request_id ?? '';
            const message = apiResponse?.data?.message ?? '';
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } catch (error: AxiosError) {
            if (error?.response) {
                const message =
                    error?.response?.data?.output ??
                    error?.response?.data?.message;
                ToastAndroid.show(message, ToastAndroid.SHORT);
            }
        } finally {
            setResendCount(60);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => setResendCount(resendCount - 1), 1000);
        return () => clearInterval(timer);
    }, [resendCount]);

    let otpContainerBaseStyles = styles.underlineStyleBase;
    if (showError) {
        otpContainerBaseStyles = {
            ...otpContainerBaseStyles,
            borderColor: RED
        };
    }

    return (
        <View style={style}>
            <View style={styles.assetContainer}>
                <OTPScreenAsset />
            </View>
            <Typography
                variant={TypographyVariants.heading1}
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
                style={styles.userNameText}
            >
                {username}
            </Typography>
            <OTPInputView
                style={{
                    marginTop: RFPercentage(6),
                    height: RFPercentage(8),
                    width: '80%',
                    alignSelf: 'center'
                }}
                pinCount={5}
                code={loginOTP}
                onCodeChanged={(text) => setLoginOTP(text)}
                autoFocusOnLoad
                codeInputFieldStyle={otpContainerBaseStyles}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
            />
            {!!showError && showError.length > 0 && (
                <Text style={styles.errorText}>{showError}</Text>
            )}
            {resendCount > 0 && (
                <Typography
                    variant={TypographyVariants.caption}
                    style={styles.resendText}
                >
                    Resend in {resendCount} seconds
                </Typography>
            )}
            <ProgressDialog title="Verifying" visible={loading} />
            <ProgressDialog title="Resending" visible={resending} />
            <Button
                title="Submit"
                type="solid"
                loading={loading}
                titleStyle={styles.buttonTitleStyle}
                buttonStyle={styles.submitButton}
                onPress={verifyOtp}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                {resendCount <= 0 && (
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={onResendOTPClicked}
                    >
                        <Typography variant={TypographyVariants.caption}>
                            Didn't receive OTP?
                        </Typography>
                        <Typography
                            variant={TypographyVariants.caption}
                            style={styles.resendTextStyles}
                        >
                            Resend
                        </Typography>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    header: {
        textAlign: 'center'
    },
    //
    borderStyleHighLighted: {
        borderColor: BLUE_LIGHT
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
        borderColor: BLUE_LIGHT
    },
    resendTextStyles: {
        marginLeft: 4,
        textDecorationLine: 'underline'
    },
    userNameText: {
        textAlign: 'center'
    },
    enterOtpText: {
        marginTop: 20,
        textAlign: 'center'
    },
    errorText: {
        color: RED,
        flexWrap: 'wrap',
        paddingHorizontal: 40,
        textAlign: 'center'
    },
    resendText: {
        alignSelf: 'center',
        color: BLUE_LIGHT,
        marginTop: RFPercentage(1)
    },
    buttonTitleStyle: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2.3)
    },
    submitButton: {
        alignSelf: 'center',
        backgroundColor: BLUE,
        borderRadius: 6,
        marginVertical: RFPercentage(3),
        paddingVertical: RFPercentage(1.6),
        width: '45%'
    },
    assetContainer: {
        alignItems: 'center',
        marginBottom: RFPercentage(4)
    }
});
