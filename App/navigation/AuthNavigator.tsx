import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {LoginParamList} from '../../types';
import EnterOTPScreen from '../screens/auth/EnterOTPScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import NewPasswordScreen from '../screens/auth/NewPasswordScreen';
import HelpSectionScreen from '../screens/HelpSectionScreen';
import HelpSectionDetailsScreen from '../screens/HelpSectionDetailsScreen';
import useCommon from '../hooks/useCommon';
import NoInternetScreen from '../screens/NoInternetScreen';
import NetInfo from '@react-native-community/netinfo';

const Stack = createStackNavigator<LoginParamList>();

export default function AuthNavigator() {
  const [isInternetAvailable, setIsInternetAvailable] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsInternetAvailable(!!state.isConnected);
    });
    return () => unsubscribe();
  }, [setIsInternetAvailable]);

  if (!isInternetAvailable) return <NoInternetScreen />;

  return (
    <Stack.Navigator headerShown={false} screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="OTPScreen" component={EnterOTPScreen} />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
      <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} />
      <Stack.Screen name="HelpSectionScreen" component={HelpSectionScreen} />
      <Stack.Screen
        name="HelpSectionDetailsScreen"
        component={HelpSectionDetailsScreen}
      />
    </Stack.Navigator>
  );
}
