import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer
} from '@react-navigation/native';
import * as React from 'react';
import { ColorSchemeName, StatusBar, Text } from 'react-native';
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/common/Loading';
import NoInternetScren from '../screens/NoInternetScreen';
import NetInfo from '@react-native-community/netinfo';
import { RootNavigator } from './RootStackNavigator';
import UpdateAvailableScreen from '../screens/UpdateAvailableScreen';
import useAppConfig from '../hooks/useAppConfig';
// import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';

import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useClockIn } from '../hooks/useClockIn';
import ClockInOut from '../components/auth/ClockInOut';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { LocationDialog } from '../components/common/Dialogs/LocationDialog';
import { useLocation } from '../hooks/useLocation';
import { NoPermissonModal } from '../components/common/Dialogs/NoPermission';
import { MockLocationEnabledModal } from '../components/common/Dialogs/MockLocationEnabled';
import useCommon from '../hooks/useCommon';
import OfflineBanner from '../components/common/OfflineBanner';
import SyncScreen from '../screens/SyncScreen';
import { useAppSelector } from '../redux/hooks';
import { selectCloseVisit } from '../redux/offlineVisitDataSlice';
import { selectLoanDetailOffline } from '../redux/loanDetailSlice';
import { CompanyType } from '../../enums';
import _ from 'lodash';
import useConfig from '../hooks/useConfig';
import RNBootSplash from 'react-native-bootsplash';

export default function Navigation({
  colorScheme
}: {
  colorScheme: ColorSchemeName;
}) {
  const navigation = React.useRef();
  const updateRequired = useAppConfig();
  const {
    setIsInternetAvaiable,
    isInternetAvailable,
    showSyncScreen,
    setShowSyncScreen
  } = useCommon();

  const [isConnected, setIsConnnected] = React.useState(true);

  const visitCachedData = useAppSelector(selectCloseVisit);
  const loanDetailsCachedData = useAppSelector(selectLoanDetailOffline);
  const { offlineMode } = useConfig();

  React.useEffect(() => {
    try {
      if (!offlineMode) return;
      if (
        (Object.keys(visitCachedData).length ||
          Object.keys(loanDetailsCachedData).length) &&
        isInternetAvailable
      ) {
        setShowSyncScreen(true);
      } else {
        setTimeout(() => {
          setShowSyncScreen(false);
        }, 2000);
      }
    } catch (e) {}
  }, [visitCachedData, loanDetailsCachedData, isInternetAvailable]);

  const {
    authData,
    FOSAccessPermitted,
    setFOSAccessPermitted,
    mockLocationEnabled,
    setMockLocationEnabled,
    companyType
  } = useAuth();
  const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();
  const { locationPermission, showLocationDialog, setShowLocationDialog } =
    useLocation();
  const { hideClockInBottomSheet, bottomSheetRef } = useClockIn();
  const snapPoints = React.useMemo(() => [RFPercentage(18)], []);

  const renderBackdrop = React.useCallback(
    (props) => <BottomSheetBackdrop disappearsOnIndex={-1} {...props} />,
    []
  );

  const changeConnection = React.useCallback(
    _.throttle((state) => {
      setIsInternetAvaiable(state.isInternetReachable && state.isConnected);
      setIsConnnected(state.isInternetReachable && state.isConnected);
    }, 4000),
    [setIsInternetAvaiable, setIsConnnected]
  );

  React.useEffect(() => {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener((state) => {
      changeConnection(state);
    });
    // Unsubscribe
    return () => unsubscribe();
  }, [setIsInternetAvaiable]);

  if (updateRequired) return <UpdateAvailableScreen />;

  if (!isConnected && !offlineMode) return <NoInternetScren />;

  if (showSyncScreen) {
    return <SyncScreen />;
  }

  let content = <AuthNavigator />;
  if (authData) {
    content = (
      <>
        <RootNavigator />
        <BottomSheet
          ref={bottomSheetRef}
          index={isInternetAvailable ? 0 : -1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          onClose={hideClockInBottomSheet}
        >
          <ClockInOut />
        </BottomSheet>
        <LocationDialog
          visible={showLocationDialog}
          setVisible={setShowLocationDialog}
          currentPermission={locationPermission}
        />
        <NoPermissonModal
          visible={!FOSAccessPermitted}
          setVisible={setFOSAccessPermitted}
        />
        <MockLocationEnabledModal
          visible={mockLocationEnabled}
          setVisible={setMockLocationEnabled}
        />
      </>
    );
  }

  return (
    <NavigationContainer
      ref={navigation}
      onReady={() => {
        routingInstrumentation.registerNavigationContainer(navigation);
        RNBootSplash.hide({ fade: true });
      }}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <StatusBar translucent />
      {content}
      <OfflineBanner />
    </NavigationContainer>
  );
}
