import {
    selectCompanyAddressText,
    selectCompanyLogo,
    selectOfflineMode
} from './../redux/configSlice';
import {
    CallingModeTypes,
    CompanyType,
    CountryCodes,
    DepositTypes,
    LocationAccessType
} from '../../enums';
import {
    AuthData,
    CollectionLimitDetails,
    DepositBranchType
} from '../../types';
import {
    setAllocationMonth as _setAllocationMonth,
    setAuthData as _setAuthData,
    setCallingModes as _setCallingModes,
    setChequeDetailsInput as _setChequeDetailsInput,
    setCollectionLimitsDetails as _setCollectionLimitsDetails,
    setCollectionModes as _setCollectionModes,
    setCompanyName as _setCompanyName,
    setCompanyType as _setCompanyType,
    setCountry as _setCountry,
    setCountryIsdCode as _setCountryIsdCode,
    setCurrencySymbol as _setCurrencySymbol,
    setDepositBranch as _setDepositBranch,
    setDepositBranchLocation as _setDepositBranchLocation,
    setDepositModes as _setDepositModes,
    setDepositOtpVerificationMethod as _setDepositOtpVerificationMethod,
    setOnlineCollectionMode as _setOnlineCollectionMode,
    setFOSAccessPermitted as _setFOSAccessPermitted,
    setGeofencingDistance as _setGeofencingDistance,
    setGeofencingRequired as _setGeofencingRequired,
    setIsFeedbackResponseNeeded as _setIsFeedbackResponseNeeded,
    setIsRecoveryAmountBifurcationEnabled as _setIsRecoveryAmountBifurcationEnabled,
    setIsRoutePlanningEnabled as _setIsRoutePlanningEnabled,
    setLocationAccess as _setLocationAccess,
    setMockLocationEnabled as _setMockLocationEnabled,
    setOtpVerificationRequired as _setOtpVerificationRequired,
    setShowBalanceClaimAmount as _setShowBalanceClaimAmount,
    setShowCompanyBankRepresentatives as _setShowCompanyBankRepresentatives,
    setUserName as _setUserName,
    setCompanyAddressCity as _setCompanyAddressCity,
    setCompanyAddressState as _setCompanyAddressState,
    setCompanyAddressText as _setCompanyAddressText,
    setCompanyAddressPincode as _setCompanyAddressPincode,
    setCompanyLogo as _setCompanyLogo,
    setOfflineMode as _setOfflineMode,
    selectAllocationMonth,
    selectAuthData,
    selectCallingModes,
    selectChequeDetailsInput,
    selectCollectionLimitsDetails,
    selectCollectionModes,
    selectCompanyName,
    selectCompanyType,
    selectCountry,
    selectCountryIsdCode,
    selectCurrencySymbol,
    selectDepositBranch,
    selectDepositBranchLocation,
    selectDepositModes,
    selectDepositOtpVerificationMethod,
    selectOnlineCollectionMode,
    selectFOSAccessPermitted,
    selectGeofencingDistance,
    selectGeofencingRequired,
    selectIsFeedbackResponseNeeded,
    selectIsRecoveryAmountBifurcationEnabled,
    selectIsRoutePlanningEnabled,
    selectLocationAccess,
    selectMockLocationEnabled,
    selectOtpVerificationRequired,
    selectShowBalanceClaimAmount,
    selectShowCompanyBankRepresentatives,
    selectUserName,
    selectCompanyAddressCity,
    selectCompanyAddressPincode,
    selectCompanyAddressState
} from '../redux/configSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export default function useConfig() {
    const dispatch = useAppDispatch();

    const authData = useAppSelector(selectAuthData);
    const userName = useAppSelector(selectUserName);
    const currencySymbol = useAppSelector(selectCurrencySymbol);
    const country = useAppSelector(selectCountry);
    const FOSAccessPermitted = useAppSelector(selectFOSAccessPermitted);
    const otpVerificationRequired = useAppSelector(
        selectOtpVerificationRequired
    );
    const depositBranch = useAppSelector(selectDepositBranch);
    const companyName = useAppSelector(selectCompanyName);
    const allocationMonth = useAppSelector(selectAllocationMonth);
    const isFeedbackResponseNeeded = useAppSelector(
        selectIsFeedbackResponseNeeded
    );
    const collectionModes = useAppSelector(selectCollectionModes);
    const depositModes = useAppSelector(selectDepositModes);
    const callingModes = useAppSelector(selectCallingModes);
    const geoFencingRequired = useAppSelector(selectGeofencingRequired);
    const geofencingDistance = useAppSelector(selectGeofencingDistance);
    const countryIsdCode = useAppSelector(selectCountryIsdCode);
    const companyType = useAppSelector(selectCompanyType);
    const isRecoveryAmountBifurcationEnabled = useAppSelector(
        selectIsRecoveryAmountBifurcationEnabled
    );
    const showBalanceClaimAmount = useAppSelector(selectShowBalanceClaimAmount);
    const locationAccess = useAppSelector(selectLocationAccess);
    const isRoutePlanningEnabled = useAppSelector(selectIsRoutePlanningEnabled);
    const depositBranchLocation = useAppSelector(selectDepositBranchLocation);
    const showCompanyBankRepresentatives = useAppSelector(
        selectShowCompanyBankRepresentatives
    );
    const depositOtpVerificationMethod = useAppSelector(
        selectDepositOtpVerificationMethod
    );
    const onlineCollectionMode = useAppSelector(selectOnlineCollectionMode);
    const mockLocationEnabled = useAppSelector(selectMockLocationEnabled);
    const chequeDetailsInput = useAppSelector(selectChequeDetailsInput);
    const collectionLimitsDetails = useAppSelector(
        selectCollectionLimitsDetails
    );
    const companyAddressCity = useAppSelector(selectCompanyAddressCity);
    const companyAddressPincode = useAppSelector(selectCompanyAddressPincode);
    const companyAddressState = useAppSelector(selectCompanyAddressState);
    const companyAddressText = useAppSelector(selectCompanyAddressText);
    const companyLogo = useAppSelector(selectCompanyLogo);
    const offlineMode = useAppSelector(selectOfflineMode);

    const setAuthData = (a?: AuthData) => {
        dispatch(_setAuthData(a!));
    };

    const setUserName = (a: string) => dispatch(_setUserName(a));
    const setCurrencySymbol = (a: string) => dispatch(_setCurrencySymbol(a));

    const setCountry = (a: CountryCodes) => {
        dispatch(_setCountry(a()));
    };

    const setFOSAccessPermitted = (a: boolean) =>
        dispatch(_setFOSAccessPermitted(a));

    const setOtpVerificationRequired = (a: boolean) =>
        dispatch(_setOtpVerificationRequired(a));

    const setDepositBranch = (a: DepositBranchType) =>
        dispatch(_setDepositBranch(a));

    const setCompanyName = (a: string) => dispatch(_setCompanyName(a));

    const setAllocationMonth = (a: any) => dispatch(_setAllocationMonth(a));

    const setIsFeedbackResponseNeeded = (a: boolean) =>
        dispatch(_setIsFeedbackResponseNeeded(a));

    const setCollectionModes = (a: DepositTypes[]) =>
        dispatch(_setCollectionModes(a));

    const setDepositModes = (a: DepositTypes[]) =>
        dispatch(_setDepositModes(a));

    const setCallingModes = (a: CallingModeTypes[]) =>
        dispatch(_setCallingModes(a));

    const setGeofencingRequired = (a: boolean) =>
        dispatch(_setGeofencingRequired(a));

    const setCountryIsdCode = (a: string) => dispatch(_setCountryIsdCode(a));

    const setGeofencingDistance = (a: number) =>
        dispatch(_setGeofencingDistance(a));

    const setCompanyType = (a: CompanyType) => dispatch(_setCompanyType(a));

    const setIsRecoveryAmountBifurcationEnabled = (a: boolean) =>
        dispatch(_setIsRecoveryAmountBifurcationEnabled(a));

    const setShowBalanceClaimAmount = (a: boolean) =>
        dispatch(_setShowBalanceClaimAmount(a));

    const setLocationAccess = (a: LocationAccessType) =>
        dispatch(_setLocationAccess(a));

    const setIsRoutePlanningEnabled = (a: boolean) =>
        dispatch(_setIsRoutePlanningEnabled(a));

    const setDepositBranchLocation = (a: string) =>
        dispatch(_setDepositBranchLocation(a));

    const setShowCompanyBankRepresentatives = (a: boolean) =>
        dispatch(_setShowCompanyBankRepresentatives(a));

    const setDepositOtpVerificationMethod = (a: string) =>
        dispatch(_setDepositOtpVerificationMethod(a));
    const setOnlineCollectionMode = (a: string) =>
        dispatch(_setOnlineCollectionMode(a));
    const setMockLocationEnabled = (a: boolean) =>
        dispatch(_setMockLocationEnabled(a));
    const setChequeDetailsInput = (a: boolean) =>
        dispatch(_setChequeDetailsInput(a));
    const setCollectionLimitsDetails = (a: CollectionLimitDetails) =>
        dispatch(_setCollectionLimitsDetails(a));
    const setCompanyAddressCity = (a: string) =>
        dispatch(_setCompanyAddressCity(a));
    const setCompanyAddressPincode = (a: string) =>
        dispatch(_setCompanyAddressPincode(a));
    const setCompanyAddressState = (a: string) =>
        dispatch(_setCompanyAddressState(a));
    const setCompanyAddressText = (a: string) =>
        dispatch(_setCompanyAddressText(a));
    const setCompanyLogo = (a: string) => dispatch(_setCompanyLogo(a));
    const setOfflineMode = (a: boolean) => dispatch(_setOfflineMode(a));

    return {
        authData,
        userName,
        currencySymbol,
        country,
        FOSAccessPermitted,
        otpVerificationRequired,
        depositBranch,
        companyName,
        allocationMonth,
        isFeedbackResponseNeeded,
        collectionModes,
        depositModes,
        callingModes,
        geoFencingRequired,
        geofencingDistance,
        countryIsdCode,
        companyType,
        isRecoveryAmountBifurcationEnabled,
        showBalanceClaimAmount,
        locationAccess,
        isRoutePlanningEnabled,
        depositBranchLocation,
        showCompanyBankRepresentatives,
        depositOtpVerificationMethod,
        onlineCollectionMode,
        collectionLimitsDetails,
        setAuthData,
        setUserName,
        setCurrencySymbol,
        setCountry,
        setFOSAccessPermitted,
        setOtpVerificationRequired,
        setDepositBranch,
        setCompanyName,
        setAllocationMonth,
        setIsFeedbackResponseNeeded,
        setCollectionModes,
        setDepositModes,
        setCallingModes,
        setGeofencingRequired,
        setCountryIsdCode,
        setGeofencingDistance,
        setCompanyType,
        setIsRecoveryAmountBifurcationEnabled,
        setShowBalanceClaimAmount,
        setLocationAccess,
        setIsRoutePlanningEnabled,
        setDepositBranchLocation,
        setShowCompanyBankRepresentatives,
        setDepositOtpVerificationMethod,
        setOnlineCollectionMode,
        mockLocationEnabled,
        setMockLocationEnabled,
        chequeDetailsInput,
        setChequeDetailsInput,
        setCollectionLimitsDetails,
        companyAddressCity,
        setCompanyAddressCity,
        companyAddressState,
        setCompanyAddressState,
        companyAddressPincode,
        setCompanyAddressPincode,
        companyAddressText,
        setCompanyAddressText,
        companyLogo,
        setCompanyLogo,
        offlineMode,
        setOfflineMode
    };
}
