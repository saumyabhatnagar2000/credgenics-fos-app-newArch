import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Button } from '@rneui/base';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { OTPDataType } from '../../../types';
import IconInputBox from '../../components/common/IconInputBox';
import { BLUE, BLUE_DARK, BLUE_LIGHT } from '../../constants/Colors';
import { SOMETHING_WENT_WRONG } from '../../constants/constants';
import { generateLoginOtp } from '../../services/authService';
import { Loading } from '../common/Loading';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';

export default function ResetPassword({ style }) {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState<string>('');

    const onSendOTP = async () => {
        if (!userName || !userName.length) {
            ToastAndroid.show('Enter email address!', ToastAndroid.SHORT);
            return;
        }
        const generateBETAOTPData: OTPDataType = {
            destination: userName,
            otp_type: 'forgot'
        };
        setLoading(true);
        try {
            const apiResponse = await generateLoginOtp(generateBETAOTPData);
            if (apiResponse) {
                navigation.navigate('OTPScreen', {
                    otpType: 'forgot',
                    username: userName
                });
            }
        } catch (error: AxiosError) {
            if (error?.response) {
                const message =
                    error?.response?.data?.message ?? SOMETHING_WENT_WRONG;
                ToastAndroid.show(message, ToastAndroid.SHORT);
            }
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <Loading />;
    }
    return (
        <View style={style}>
            <Typography
                variant={TypographyVariants.heading1}
                style={styles.header}
            >
                Email Verification
            </Typography>
            <IconInputBox
                placeholder="Email"
                style={{
                    color: BLUE_LIGHT,
                    fontSize: RFPercentage(2.2)
                }}
                icon={{
                    iconName: 'email',
                    iconColor: BLUE_DARK,
                    iconType: 'material-community'
                }}
                value={userName}
                setText={setUserName}
                loading={loading}
                keyboardType="email-address"
            />
            <Button
                title="Send OTP"
                type="solid"
                iconPosition="right"
                iconRight={true}
                loading={loading}
                disabled={loading}
                titleStyle={{
                    fontSize: RFPercentage(2.3),
                    fontFamily: TypographyFontFamily.medium
                }}
                buttonStyle={{
                    marginVertical: RFPercentage(3),
                    paddingVertical: RFPercentage(1.6),
                    backgroundColor: BLUE,
                    borderRadius: 6,
                    width: '45%',
                    alignSelf: 'center'
                }}
                onPress={() => onSendOTP()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        marginBottom: RFPercentage(12),
        textAlign: 'center'
    },
    loadingStyle: {
        padding: 35
    }
});
