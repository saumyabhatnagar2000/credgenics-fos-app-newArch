import {useNavigation} from '@react-navigation/core';
import React, {createRef, useState} from 'react';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import {Button} from '@rneui/base';
import {ResetUserData} from '../../../types';
import {BLUE, BLUE_DARK} from '../../constants/Colors';
import {useAuth} from '../../hooks/useAuth';
import {resetPassword} from '../../services/authService';
import {Loading} from '../common/Loading';
import Typography, {
  TypographyFontFamily,
  TypographyVariants,
} from '../ui/Typography';
import PasswordInput from './PasswordInput';

export default function NewPassword({style, requestID, forgotUserName}) {
  const navigation = useNavigation();
  const {userName} = useAuth();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const passwordRef = createRef();

  const onSubmit = async () => {
    if (newPassword != confirmPassword) {
      ToastAndroid.show('Password mismatch!', ToastAndroid.LONG);
      return;
    }
    const resetPasswordData: ResetUserData = {
      username: forgotUserName ?? 'Username',
      new_password: newPassword,
      request_id: requestID,
    };

    setLoading(true);
    try {
      const apiResponse = await resetPassword(resetPasswordData);
      const statusCode = apiResponse?.status;
      if (statusCode === 200) {
        const message = apiResponse?.data?.message ?? '';
        ToastAndroid.show(message, ToastAndroid.LONG);
        setTimeout(() => navigation.navigate('LoginScreen'), 100);
      }
    } catch (error: any) {
      if (error) {
        const statusCode = error.response?.status;
        if (statusCode == 400) {
          const message = error.response?.data.message;
          ToastAndroid.show(JSON.stringify(message), ToastAndroid.SHORT);
          if (
            message === 'OTP Authentication Failed' &&
            navigation.canGoBack()
          ) {
            navigation.goBack();
          }
        }
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
      <Typography variant={TypographyVariants.subHeading} style={styles.header}>
        Reset Password
      </Typography>
      <PasswordInput
        placeholder="New Password"
        setText={setNewPassword}
        compRef={passwordRef}
        error={false}
        loading={loading}
      />
      <PasswordInput
        placeholder="Confirm Password"
        setText={setConfirmPassword}
        compRef={passwordRef}
        error={false}
        loading={loading}
      />
      <Button
        title="Submit"
        type="solid"
        iconPosition="right"
        loading={loading}
        disabled={loading}
        titleStyle={{
          fontSize: 25,
          fontFamily: TypographyFontFamily.medium,
        }}
        buttonStyle={{
          margin: 20,
          paddingVertical: 10,
          width: '45%',
          backgroundColor: BLUE,
          borderRadius: 6,
          alignSelf: 'center',
        }}
        onPress={() => onSubmit()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    color: BLUE_DARK,
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
});
