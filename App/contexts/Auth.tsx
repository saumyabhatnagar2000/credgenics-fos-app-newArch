import React, {createContext, useEffect, useMemo, useState} from 'react';
import {
  AuthContextData,
  AuthData,
  DepositBranchType,
  OrganisationDetails,
} from '../../types';
import {Platform, ToastAndroid} from 'react-native';
import {
  StringCompare,
  capitalizeFirstLetter,
  getLocationPromise,
  getCurrentAllocationMonth,
} from '../services/utils';
import {
  CallingModeTypes,
  ClockedInOutStatues,
  CountryCodes,
  CurrencyTypes,
} from '../../enums';
import {fetchOrgDetails} from '../services/appConfigService';
import axios, {AxiosError} from 'axios';
import Urls from '../constants/Urls';
import {getCountryCode} from '../services/countryService';
import {
  AUTH_STORAGE_KEY,
  COMPANY_STORAGE_KEY,
  COUNTRY_STORAGE_KEY,
  LOGIN_TYPE_STORAGE_KEY,
  ROUTE_PLANNING_RESUME_KEY,
  USERNAME_STORAGE_KEY,
} from '../constants/Storage';
import {
  deleteStorageData,
  getStorageData,
  setStorageData,
} from '../utils/Storage';
import * as Sentry from '@sentry/browser';
import {
  getUserClockStatus,
  logoutUser,
  setUserClockStatus,
} from '../services/authService';
import useConfig from '../hooks/useConfig';
import useCommon from '../hooks/useCommon';
import {EventScreens, Events} from '../constants/Events';
import {useMixpanel} from './MixpanelContext';
import {getCollectionLimits} from '../services/dashboardService';
import useOfflineVisitData from '../hooks/useOfflineVisitData';
import useLoanDetails from '../hooks/useLoanData';
import {useAppDispatch} from '../redux/hooks';

if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/hi'); // load the required locale details
  // Intl.__disableRegExpRestore(); /*For syntaxerror invalid regular expression unmatched parentheses*/
}

const {BASE_URL, BASE_URL_IDN} = Urls;

const CurrencyTypesObj = {
  rs: '₹',
  rp: 'Rp',
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({children}) => {
  const {logEvent} = useMixpanel();
  const dispatch = useAppDispatch();
  const {
    authData,
    setAuthData,
    userName,
    setUserName,
    currencySymbol,
    setCurrencySymbol,
    country,
    setCountry,
    otpVerificationRequired,
    setOtpVerificationRequired,
    companyName,
    setCompanyName,
    isFeedbackResponseNeeded,
    setIsFeedbackResponseNeeded,
    collectionModes,
    setCollectionModes,
    depositModes,
    setDepositModes,
    callingModes,
    setCallingModes,
    geoFencingRequired,
    setGeofencingRequired,
    countryIsdCode,
    setCountryIsdCode,
    geofencingDistance,
    setGeofencingDistance,
    companyType,
    setCompanyType,
    isRecoveryAmountBifurcationEnabled,
    setIsRecoveryAmountBifurcationEnabled,
    showBalanceClaimAmount,
    setShowBalanceClaimAmount,
    locationAccess,
    setLocationAccess,
    isRoutePlanningEnabled,
    setIsRoutePlanningEnabled,
    depositBranchLocation,
    setDepositBranchLocation,
    depositOtpVerificationMethod,
    setDepositOtpVerificationMethod,
    onlineCollectionMode,
    setOnlineCollectionMode,
    chequeDetailsInput,
    setChequeDetailsInput,
    setCollectionLimitsDetails,
    companyAddressCity,
    companyAddressState,
    setCompanyAddressState,
    companyAddressPincode,
    setCompanyAddressPincode,
    companyAddressText,
    setCompanyAddressText,
    companyLogo,
    setCompanyLogo,
    setCompanyAddressCity,
    setOfflineMode,
  } = useConfig();

  const [FOSAccessPermitted, setFOSAccessPermitted] = useState(true);
  const [allocationMonth, setAllocationMonth] = useState(
    getCurrentAllocationMonth(),
  );
  const [mockLocationEnabled, setMockLocationEnabled] = useState(false);
  const [depositBranch, setDepositBranch] = useState<DepositBranchType>();

  const {getDispositionStatus, getRecoveryVariables} = useOfflineVisitData();

  const {clearLoanDetailMap} = useLoanDetails();

  const {isInternetAvailable} = useCommon();

  const [isRightDrawer, setIsRightDrawer] = useState<boolean>(false);
  const [
    showCompanyBranchRepresentatives,
    setShowCompanyBranchRepresentatives,
  ] = useState(false);

  const getCurrencyString = (amount: string) => {
    const getStr = (str: string) => {
      const intt = Number(str);
      if (currencySymbol == CurrencyTypesObj.rs)
        return intt.toLocaleString('hi');
      else return intt.toLocaleString('en-US');
    };
    return amount
      ? `${currencySymbol + ' ' + getStr(amount)}`
      : `${currencySymbol + ' ' + '0'}`;
  };

  const getOrgDetails = async () => {
    try {
      const data: OrganisationDetails = await fetchOrgDetails(authData);
      if (data) {
        const {
          fos_collection_mode = '',
          fos_deposit_mode = '',
          fos_calling_mode = '',
          feedback_response_fos = false,
          country_currency_code = CurrencyTypes.rs,
          company_name,
          fos_otp_verification_required = false,
          geofencing_required = false,
          country_isd_code,
          company_type,
          geofencing_distance = 3,
          deposit_details = [],
          is_recovery_amount_bifurcation_enabled = false,
          show_balance_claim_amount = false,
          location_access,
          route_planning = false,
          deposit_branch_location,
          company_branch_representatives,
          online_collection_mode,
          deposit_otp_verification_method,
          cheque_details_input = false,
          address_city,
          address_pincode,
          address_state,
          address_text,
          company_logo,
          offline_mode,
        } = data;
        const collectionData = fos_collection_mode
          .split(',')
          .map((word: string) => capitalizeFirstLetter(word));
        const depositData = fos_deposit_mode
          .split(',')
          .map((word: string) => capitalizeFirstLetter(word));
        const callingModeData = fos_calling_mode.split(',');
        setCollectionModes(collectionData);
        setDepositModes(depositData);
        setCallingModes(callingModeData);
        setIsFeedbackResponseNeeded(feedback_response_fos);
        setCompanyName(company_name);
        setOtpVerificationRequired(fos_otp_verification_required);
        setGeofencingRequired(geofencing_required);
        setCountryIsdCode(country_isd_code);
        setGeofencingDistance(geofencing_distance);
        setCompanyType(company_type);
        setIsRecoveryAmountBifurcationEnabled(
          is_recovery_amount_bifurcation_enabled,
        );
        setShowBalanceClaimAmount(show_balance_claim_amount);
        setLocationAccess(location_access);
        setIsRoutePlanningEnabled(route_planning);
        setDepositBranchLocation(deposit_branch_location);
        setShowCompanyBranchRepresentatives(company_branch_representatives);
        setDepositOtpVerificationMethod(deposit_otp_verification_method);
        setOnlineCollectionMode(online_collection_mode);
        setChequeDetailsInput(cheque_details_input);
        setOfflineMode(offline_mode);

        if (
          Object.keys(CurrencyTypes).includes(
            country_currency_code.toLowerCase(),
          )
        ) {
          const code = country_currency_code.toLowerCase();
          setCurrencySymbol(CurrencyTypesObj[code]);
        } else {
          setCurrencySymbol(country_currency_code);
        }
        setCompanyAddressCity(address_city);
        setCompanyAddressPincode(address_pincode);
        setCompanyAddressState(address_state);
        setCompanyAddressText(address_text);
        setCompanyLogo(company_logo);
        setOfflineMode(offline_mode);
      }
    } catch (e: any) {
      if (StringCompare(e, 'Access Unauthorized')) {
        setFOSAccessPermitted(false);
      }
      if (e?.response && e?.response?.data) {
        ToastAndroid.show(e?.response?.data, ToastAndroid.SHORT);
      }
    }
    return [];
  };

  const getMaskedNumber = (number: string) => {
    if (
      callingModes.includes(CallingModeTypes.click_to_call) &&
      callingModes.length == 1
    ) {
      return number.replace(number.slice(0, 6), 'XXXXXX');
    }
    return number;
  };

  const initCountry = async () => {
    try {
      let fetchedCountry = (await getCountryCode()) ?? CountryCodes.india;
      if (
        fetchedCountry &&
        Object.values(CountryCodes as any).includes(fetchedCountry)
      ) {
        setCountry(fetchedCountry as CountryCodes);
      }
    } catch (e) {
      //
    }
  };

  const updateCollectionLimitsDetails = async () => {
    try {
      const response = await getCollectionLimits(authData);
      if (response && response?.data?.length > 0) {
        setCollectionLimitsDetails(response?.data[0]);
      }
    } catch (e: any) {
      if (e?.response && e?.response?.data) {
        ToastAndroid.show(e?.response?.data, ToastAndroid.SHORT);
      }
    }
  };

  useEffect(() => {
    if (authData && isInternetAvailable) {
      getOrgDetails();
      initCountry();
      updateCollectionLimitsDetails();
      getDispositionStatus(authData);
      if (isRecoveryAmountBifurcationEnabled) getRecoveryVariables(authData);
    }
  }, [authData, isInternetAvailable, isRecoveryAmountBifurcationEnabled]);

  useEffect(() => {
    if (mockLocationEnabled) {
      Sentry.captureMessage('User is mocking location');
      logEvent(Events.mocking_location, EventScreens.app);
    }
  }, [mockLocationEnabled]);

  const signIn = async (
    username: string,
    loginType: string,
    _companyName: string,
  ) => {
    setUserName(username);
    await setStorageData(USERNAME_STORAGE_KEY, username);
    await setStorageData(LOGIN_TYPE_STORAGE_KEY, loginType);
    await setStorageData(COMPANY_STORAGE_KEY, _companyName);
    await setStorageData(ROUTE_PLANNING_RESUME_KEY, JSON.stringify(false));
  };

  const verification = async (userData: AuthData) => {
    setAuthData(userData);
    await setStorageData(AUTH_STORAGE_KEY, JSON.stringify(userData));
    await setStorageData(COUNTRY_STORAGE_KEY, country);
  };

  const signOut = async (responseCode?: number): Promise<void> => {
    // if (!isInternetAvailable) return;
    if (authData && responseCode != 401) {
      try {
        const {isMocked, ...data} = await getLocationPromise();
        const getClockStatus = await getUserClockStatus(authData);
        const currentStatus = getClockStatus?.status;
        if (currentStatus === ClockedInOutStatues.clocked_in) {
          await setUserClockStatus(data, authData);
        }
        await logoutUser(authData?.authenticationtoken!);
      } catch (e) {}
    }
    await deleteStorageData(AUTH_STORAGE_KEY);
    await deleteStorageData(COUNTRY_STORAGE_KEY);
    await deleteStorageData(ROUTE_PLANNING_RESUME_KEY);
    dispatch({type: 'LOGOUT'});
    console.log('logged out');
    Sentry.setUser(null);
  };

  useEffect(() => {
    if (country == CountryCodes.indonesia) {
      axios.defaults.baseURL = BASE_URL_IDN ?? BASE_URL;
    } else {
      axios.defaults.baseURL = BASE_URL;
    }
  }, [country]);

  useMemo(() => {
    axios.interceptors.request.use(
      async function (config) {
        if (!config.baseURL || config.baseURL.length == 0) {
          const cntry = await getStorageData('@Country');
          if (cntry && cntry == CountryCodes.indonesia) {
            axios.defaults.baseURL = BASE_URL_IDN ?? BASE_URL;
            config.baseURL = BASE_URL_IDN ?? BASE_URL;
          } else {
            axios.defaults.baseURL = BASE_URL;
            config.baseURL = BASE_URL;
          }
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      },
    );
    axios.interceptors.response.use(
      function (response) {
        if (response?.status == 401) {
          signOut(response?.status);
          return response;
        }
        return response;
      },
      function (error: AxiosError) {
        console.log(
          'error',
          error,
          error?.response?.data,
          error.request.responseURL,
        );

        if (error.message == 'Network Error') {
          // ToastAwndroid.show(
          //     "Seems like you're offline",
          //     ToastAndroid.SHORT
          // );
          return;
        }
        if (error?.response?.status == 401) {
          const urlParts = error?.request?.responseURL.split('/') ?? [];
          if (
            urlParts.length > 0 &&
            urlParts[urlParts.length - 1] == 'send-otp'
          ) {
            return Promise.reject(error);
          }
          signOut(error?.response?.status);
          if (urlParts.length > 0 && urlParts[urlParts.length - 1] == 'login')
            return Promise.reject(error);
          else return;
        }
        return Promise.reject(error);
      },
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authData,
        userName,
        allocationMonth,
        depositBranch,
        companyName,
        otpVerificationRequired,
        setDepositBranch,
        setAllocationMonth,
        signIn,
        verification,
        signOut,
        collectionModes,
        depositModes,
        callingModes,
        currencySymbol,
        getCurrencyString,
        getMaskedNumber,
        isFeedbackResponseNeeded,
        isRightDrawer,
        setIsRightDrawer,
        geoFencingRequired,
        countryIsdCode,
        country,
        setCountry,
        geofencingDistance,
        initCountry,
        companyType,
        isRecoveryAmountBifurcationEnabled,
        showBalanceClaimAmount,
        locationAccess,
        isRoutePlanningEnabled,
        FOSAccessPermitted,
        setFOSAccessPermitted,
        depositBranchLocation,
        showCompanyBranchRepresentatives,
        depositOtpVerificationMethod,
        onlineCollectionMode,
        chequeDetailsInput,
        mockLocationEnabled,
        setMockLocationEnabled,
        updateCollectionLimitsDetails,
        companyAddressCity,
        companyAddressPincode,
        companyAddressState,
        companyAddressText,
        companyLogo,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
