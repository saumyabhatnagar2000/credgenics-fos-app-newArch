import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import {getUserDetails, loginUser} from '../../services/authService';
import IconInputBox from '../common/IconInputBox';
import {Button} from '@rneui/base';
import PasswordInput from './PasswordInput';
import {useAuth} from '../../hooks/useAuth';
import {useNavigation} from '@react-navigation/core';
import {BLUE, BLUE_DARK, BLUE_LIGHT} from '../../constants/Colors';
import {ProgressDialog} from '../common/Dialogs/ProgessDialog';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Typography, {
  TypographyFontFamily,
  TypographyVariants,
} from '../ui/Typography';
import {CustomDropDown} from '../common/DropDown';
import {
  CountryCodes,
  CountryTypes,
  LoginCodes,
  LoginTypes,
} from '../../../enums';
import {UserCredentials} from '../../../types';
import {getDeviceId, getDeviceName} from 'react-native-device-info';
import {isEmailValid, isPhoneNumberValid} from '../../utils/validators';
import {getStorageData} from '../../utils/Storage';
import {
  COMPANY_STORAGE_KEY,
  LOGIN_TYPE_STORAGE_KEY,
  USERNAME_STORAGE_KEY,
} from '../../constants/Storage';
import {SOMETHING_WENT_WRONG} from '../../constants/constants';
import {useMixpanel} from '../../contexts/MixpanelContext';
import {EventAction, EventScreens, Events} from '../../constants/Events';
import {useClockIn} from '../../hooks/useClockIn';

const BUILDING_ICON = {
  iconName: 'building',
  iconColor: BLUE_DARK,
  iconType: 'font-awesome-5',
};

export default function Login() {
  const navigation = useNavigation();
  const {country, setCountry, initCountry, verification, signIn} = useAuth();

  console.log(country, 'country');

  const {identify, logEvent} = useMixpanel();
  const {autoClockOut} = useClockIn();

  const [loading, setLoading] = useState<boolean>(false);
  const [loginEnabled, setLoginEnabled] = useState<boolean>(false);
  const [showError, setShowError] = useState<string>();
  const [username, setUsername] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const [isLoginTypeDropDownOpen, setIsLoginTypeDropDownOpen] =
    useState<boolean>(false);

  const [loginType, setLoginType] = useState<string>(LoginCodes.email);

  const [loginItems, setLoginItems] = useState([
    {
      label: LoginTypes.emp,
      value: LoginCodes.emp,
      icon: null,
    },
    {
      label: LoginTypes.phone,
      value: LoginCodes.phone,
      icon: null,
    },
    {
      label: LoginTypes.email,
      value: LoginCodes.email,
      icon: null,
    },
  ]);

  const [items, setItems] = useState([
    {label: CountryTypes.india, value: CountryCodes.india, icon: null},
    {
      label: CountryTypes.indonesia,
      value: CountryCodes.indonesia,
      icon: null,
    },
  ]);

  const filteredLoginItems = useMemo(() => {
    return loginItems.filter(item => item.value != loginType);
  }, [loginType]);

  const isEmployeeCodeLogin = loginType == LoginCodes.emp;
  useEffect(() => {
    // initCountry();
    (async () => {
      const _username = await getStorageData(USERNAME_STORAGE_KEY);
      const _loginType = await getStorageData(LOGIN_TYPE_STORAGE_KEY);
      const _companyName = await getStorageData(COMPANY_STORAGE_KEY);
      setUsername(_username ?? '');
      setLoginType((_loginType as LoginCodes) ?? LoginCodes.email);
      setCompanyName(_companyName ?? '');
    })();
  }, []);

  const enableSubmitButton = () => {
    let enabled = true;
    if (username.length == 0 || password.length == 0) enabled = false;
    if (isEmployeeCodeLogin && companyName.length == 0) enabled = false;
    return enabled;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const value = enableSubmitButton();
      setLoginEnabled(value);
    }, 500);
    return () => clearInterval(timer);
  }, [enableSubmitButton]);

  const onContinue = async (): Promise<void> => {
    setShowError(undefined);

    if (username.length == 0 || password.length == 0) {
      ToastAndroid.show('Please fill the required details', ToastAndroid.LONG);
      return;
    }

    if (loginType == LoginCodes.phone && !isPhoneNumberValid(username)) {
      ToastAndroid.show('Please enter valid phone number', ToastAndroid.LONG);
      return;
    }

    if (loginType == LoginCodes.email && !isEmailValid(username)) {
      ToastAndroid.show('Please enter valid email id', ToastAndroid.LONG);
      return;
    }

    if (isEmployeeCodeLogin && companyName.length == 0) {
      ToastAndroid.show('Please fill the company name', ToastAndroid.LONG);
      return;
    }

    try {
      logEvent(Events.login, EventScreens.login_page, {
        value: username,
        action: EventAction.click,
      });

      setLoading(true);
      const _deviceName = await getDeviceName();
      const _deviceId = getDeviceId();

      let loginData: UserCredentials = {
        username,
        password,
        device_id: _deviceId,
        device_name: _deviceName,
        source: 'fos_app',
      };

      if (isEmployeeCodeLogin) {
        loginData = {
          ...loginData,
          trademark: companyName,
        };
      }
      const apiResponse = await loginUser(loginData);

      if (apiResponse) {
        const {data, message} = apiResponse?.data;

        if (apiResponse?.status == 401) {
          ToastAndroid.show(data?.message, ToastAndroid.LONG);
        }

        if (data?.request_id) {
          setTimeout(() => {
            navigation.navigate('OTPScreen', {
              otpType: 'login',
              password: password,
              username: username,
            });
          }, 200);
        } else if (data?.authentication_token) {
          try {
            const response = await getUserDetails(data?.authentication_token);

            if (response) {
              await signIn(username, loginType, companyName);

              const outputData = response?.data?.data?.user_details;

              let userData = {
                authenticationtoken: data?.authentication_token,
                userId: outputData?.user_id,
                company_id: outputData.assigned_companies,
                name: outputData?.name,
                role: outputData?.role,
                mobile: outputData?.mobile ?? '',
                agent_id: username,
              };

              if (outputData?.user_id) identify(outputData);

              ToastAndroid.show('Login successful', ToastAndroid.SHORT);
              await verification(userData);
              await autoClockOut(userData);
            }
          } catch (e) {
            ToastAndroid.show('Some Error Ocurred', ToastAndroid.LONG);
          }
        }
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response?.status == 401 || error.response?.status == 400) {
          ToastAndroid.show(error.response?.data.message, ToastAndroid.LONG);
        } else {
          ToastAndroid.show(SOMETHING_WENT_WRONG, ToastAndroid.LONG);
        }
        const data = error.response?.data;
        const output = data?.output;
        setShowError(JSON.stringify(output));
      } else {
        ToastAndroid.show(SOMETHING_WENT_WRONG, ToastAndroid.SHORT);
      }
    } finally {
      setLoading(false);
    }
  };

  // Email / Phone no.
  const getInputText = () => {
    switch (loginType) {
      case LoginCodes.emp:
        return '566735';
      case LoginCodes.email:
        return 'ashish@gmail.com';
      default:
        return '9898989898';
    }
  };

  const getLoginTypePlaceholder = () => {
    switch (loginType) {
      case LoginCodes.emp:
        return LoginTypes.emp;
      case LoginCodes.email:
        return LoginTypes.email;
      case LoginCodes.phone:
        return LoginTypes.phone;
      default:
        'Select an item';
    }
  };

  return (
    <View style={styles.container}>
      <CustomDropDown
        containerStyle={styles.countrySelectorContainerStyle}
        backgroundStyle={styles.countrySelectorBackgroundStyle}
        labelStyle={styles.countrySelectorLabelStyle}
        open={isDropDownOpen}
        setOpen={setIsDropDownOpen}
        items={items}
        values={country}
        setItems={setItems}
        setValues={setCountry}
        zIndex={2}
        zIndexInverse={1}
        onOpen={() => setIsLoginTypeDropDownOpen(false)}
      />
      <View style={styles.inputWrapper}>
        <IconInputBox
          placeholder={getInputText()}
          icon={{component: null}}
          containerStyle={companyNameInputStyles.containerStyle}
          style={companyNameInputStyles.style}
          inputContainerStyle={companyNameInputStyles.inputContainerStyle}
          value={username}
          setText={setUsername}
          error={false}
          loading={loading}
          keyboardType="email-address"
        />
        <CustomDropDown
          placeholder={getLoginTypePlaceholder()}
          containerStyle={loginTypeDropdownStyles.containerStyle}
          labelStyle={loginTypeDropdownStyles.labelStyle}
          backgroundStyle={loginTypeDropdownStyles.backgroundStyle}
          dropDownContainerStyle={
            loginTypeDropdownStyles.dropDownContainerStyle
          }
          open={isLoginTypeDropDownOpen}
          setOpen={setIsLoginTypeDropDownOpen}
          items={filteredLoginItems}
          values={loginType}
          setItems={setLoginItems}
          setValues={setLoginType}
          zIndex={1}
          onOpen={() => setIsDropDownOpen(false)}
          zIndexInverse={2}
        />
      </View>
      {isEmployeeCodeLogin && (
        <IconInputBox
          placeholder="Company Name"
          icon={BUILDING_ICON}
          style={styles.empCodeInputStyles}
          value={companyName}
          setText={setCompanyName}
          error={false}
          loading={loading}
        />
      )}
      <PasswordInput
        placeholder="Password"
        setText={setPassword}
        error={false}
        loading={loading}
      />
      <Typography
        variant={TypographyVariants.caption}
        style={styles.forgotPasswordStyle}
        onPress={() => navigation.navigate('ResetPasswordScreen')}>
        Forgot password?
      </Typography>

      {showError && (
        <Typography
          variant={TypographyVariants.caption}
          style={styles.errorText}>
          {showError}
        </Typography>
      )}

      <ProgressDialog visible={loading} title="Logging in" />
      <Button
        disabled={!loginEnabled}
        title="Login"
        type="solid"
        iconPosition="right"
        loading={loading}
        titleStyle={styles.loginButtonTitle}
        buttonStyle={styles.loginButton}
        onPress={() => onContinue()}
      />
    </View>
  );
}

const companyNameInputStyles = StyleSheet.create({
  containerStyle: {
    margin: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: '65%',
  },
  inputContainerStyle: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    margin: 0,
    padding: 0,
  },
  style: {
    color: BLUE_LIGHT,
    fontSize: RFPercentage(2.2),
  },
});

const loginTypeDropdownStyles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#043E9031',
    borderBottomRightRadius: 0,
    borderColor: BLUE_LIGHT,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    marginHorizontal: 0,
  },
  containerStyle: {
    margin: 0,
    marginHorizontal: 0,
    padding: 0,
    paddingHorizontal: 0,
    width: '35%',
  },
  dropDownContainerStyle: {
    marginHorizontal: 0,
  },
  labelStyle: {
    fontSize: RFPercentage(1.8),
    marginHorizontal: 0,
    marginVertical: 14,
    paddingHorizontal: 0,
  },
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginHorizontal: '2%',
  },
  countrySelectorBackgroundStyle: {
    backgroundColor: 'transparent',
    borderColor: BLUE_LIGHT,
  },
  countrySelectorContainerStyle: {
    marginVertical: RFPercentage(1),
  },

  countrySelectorLabelStyle: {
    marginVertical: 14,
  },
  empCodeInputStyles: {
    color: BLUE_LIGHT,
    fontSize: RFPercentage(2.2),
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  forgotPasswordStyle: {
    alignSelf: 'flex-end',
    color: BLUE_DARK,
    flexWrap: 'nowrap',
    marginRight: 20,
    marginTop: -30,
    textAlign: 'left',
  },
  inputWrapper: {
    alignItems: 'center',
    flexDirection: 'row-reverse',
    marginHorizontal: '2%',
  },
  loginButton: {
    alignSelf: 'center',
    backgroundColor: BLUE,
    borderRadius: 6,
    marginTop: RFPercentage(3),
    paddingVertical: RFPercentage(1.6),
    width: '45%',
  },
  loginButtonTitle: {
    fontFamily: TypographyFontFamily.medium,
    fontSize: RFPercentage(2.3),
  },
});
