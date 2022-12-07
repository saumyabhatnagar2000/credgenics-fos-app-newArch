import { ActionButtonType } from './../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import {
    AuthData,
    CollectionLimitDetails,
    DepositBranchType
} from '../../types';
import {
    CallingModeTypes,
    CompanyType,
    CountryCodes,
    DepositTypes,
    LocationAccessType
} from '../../enums';
import { getCurrentAllocationMonth } from '../services/utils';

const DEFAULT_GEOFENCING_DISTANCE = 3;

export interface ConfigState {
    authData?: AuthData | undefined;
    userName: string;
    currencySymbol: string;
    country: CountryCodes;
    otpVerificationRequired: boolean;
    companyName: string;
    allocationMonth: any;
    isFeedbackResponseNeeded: boolean;
    collectionModes: DepositTypes[];
    depositModes: DepositTypes[];
    callingModes: CallingModeTypes[];
    geoFencingRequired?: boolean;
    countryIsdCode: string;
    geofencingDistance: number;
    companyType?: CompanyType;
    isRecoveryAmountBifurcationEnabled: boolean;
    showBalanceClaimAmount: boolean;
    locationAccess?: LocationAccessType;
    isRoutePlanningEnabled: boolean;
    depositBranchLocation: string;
    showCompanyBankRepresentatives: boolean;
    depositOtpVerificationMethod: string;
    onlineCollectionMode: string;
    chequeDetailsInput: boolean;
    collectionLimitsDetails: CollectionLimitDetails;
    companyAddressCity: string;
    companyAddressPincode: string;
    companyAddressState: string;
    companyAddressText: string;
    companyLogo: string;
    offlineMode: boolean;
}

const initialState: ConfigState = {
    authData: undefined,
    userName: '',
    currencySymbol: '',
    country: CountryCodes.india,
    otpVerificationRequired: false,
    companyName: '',
    allocationMonth: getCurrentAllocationMonth(),
    isFeedbackResponseNeeded: false,
    collectionModes: [],
    depositModes: [],
    callingModes: [],
    geoFencingRequired: false,
    countryIsdCode: '',
    geofencingDistance: DEFAULT_GEOFENCING_DISTANCE,
    companyType: CompanyType.loan,
    isRecoveryAmountBifurcationEnabled: false,
    showBalanceClaimAmount: false,
    locationAccess: undefined,
    isRoutePlanningEnabled: false,
    depositBranchLocation: '',
    showCompanyBankRepresentatives: false,
    depositOtpVerificationMethod: '',
    onlineCollectionMode: '',
    chequeDetailsInput: false,
    collectionLimitsDetails: {
        max_limit: 0,
        available_limit: 0,
        collection_in_hand: 0,
        total_collection: 0
    },
    companyAddressCity: '',
    companyAddressPincode: '',
    companyAddressState: '',
    companyAddressText: '',
    companyLogo: '',
    offlineMode: false
};

export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<AuthData>) => {
            state.authData = action.payload;
        },
        setUserName: (state, action: PayloadAction<string>) => {
            state.userName = action.payload;
        },
        setCurrencySymbol: (state, action: PayloadAction<string>) => {
            state.currencySymbol = action.payload;
        },
        setCountry: (state, action: PayloadAction<CountryCodes>) => {
            state.country = action.payload;
        },
        setOtpVerificationRequired: (state, action: PayloadAction<boolean>) => {
            state.otpVerificationRequired = action.payload;
        },
        setCompanyName: (state, action: PayloadAction<string>) => {
            state.companyName = action.payload;
        },
        setAllocationMonth: (state, action: PayloadAction<any>) => {
            state.allocationMonth = action.payload;
        },
        setIsFeedbackResponseNeeded: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.isFeedbackResponseNeeded = action.payload;
        },
        setCollectionModes: (state, action: PayloadAction<DepositTypes[]>) => {
            state.collectionModes = action.payload;
        },
        setDepositModes: (state, action: PayloadAction<DepositTypes[]>) => {
            state.depositModes = action.payload;
        },
        setCallingModes: (state, action: PayloadAction<CallingModeTypes[]>) => {
            state.callingModes = action.payload;
        },
        setGeofencingRequired: (state, action: PayloadAction<boolean>) => {
            state.geoFencingRequired = action.payload;
        },
        setCountryIsdCode: (state, action: PayloadAction<string>) => {
            state.countryIsdCode = action.payload;
        },
        setGeofencingDistance: (state, action: PayloadAction<number>) => {
            state.geofencingDistance = action.payload;
        },
        setCompanyType: (state, action: PayloadAction<CompanyType>) => {
            state.companyType = action.payload;
        },
        setIsRecoveryAmountBifurcationEnabled: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.isRecoveryAmountBifurcationEnabled = action.payload;
        },
        setShowBalanceClaimAmount: (state, action: PayloadAction<boolean>) => {
            state.showBalanceClaimAmount = action.payload;
        },
        setLocationAccess: (
            state,
            action: PayloadAction<LocationAccessType>
        ) => {
            state.locationAccess = action.payload;
        },
        setIsRoutePlanningEnabled: (state, action: PayloadAction<boolean>) => {
            state.isRoutePlanningEnabled = action.payload;
        },
        setDepositBranchLocation: (state, action: PayloadAction<string>) => {
            state.depositBranchLocation = action.payload;
        },
        setShowCompanyBankRepresentatives: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.showCompanyBankRepresentatives = action.payload;
        },
        setDepositOtpVerificationMethod: (
            state,
            action: PayloadAction<string>
        ) => {
            state.depositOtpVerificationMethod = action.payload;
        },

        setOnlineCollectionMode: (state, action: PayloadAction<string>) => {
            state.onlineCollectionMode = action.payload;
        },
        setChequeDetailsInput: (state, action: PayloadAction<boolean>) => {
            state.chequeDetailsInput = action.payload;
        },
        setCollectionLimitsDetails: (
            state,
            action: PayloadAction<CollectionLimitDetails>
        ) => {
            state.collectionLimitsDetails = action.payload;
        },
        setCompanyAddressCity: (state, action: PayloadAction<string>) => {
            state.companyAddressCity = action.payload;
        },
        setCompanyAddressState: (state, action: PayloadAction<string>) => {
            state.companyAddressState = action.payload;
        },
        setCompanyAddressPincode: (state, action: PayloadAction<string>) => {
            state.companyAddressPincode = action.payload;
        },
        setCompanyAddressText: (state, action: PayloadAction<string>) => {
            state.companyAddressText = action.payload;
        },
        setCompanyLogo: (state, action: PayloadAction<string>) => {
            state.companyLogo = action.payload;
        },
        setOfflineMode: (state, action: PayloadAction<boolean>) => {
            state.offlineMode = action.payload;
        }
    }
});

export const {
    setAuthData,
    setUserName,
    setCurrencySymbol,
    setCountry,
    setOtpVerificationRequired,
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
    setChequeDetailsInput,
    setCollectionLimitsDetails,
    setCompanyAddressCity,
    setCompanyAddressPincode,
    setCompanyAddressText,
    setCompanyAddressState,
    setCompanyLogo,
    setOfflineMode
} = configSlice.actions;

export const selectAuthData = (state: RootState) => state.config.authData;
export const selectUserName = (state: RootState) => state.config.userName;
export const selectCurrencySymbol = (state: RootState) =>
    state.config.currencySymbol;
export const selectCountry = (state: RootState) => state.config.country;
export const selectFOSAccessPermitted = (state: RootState) =>
    state.config.FOSAccessPermitted;
export const selectOtpVerificationRequired = (state: RootState) =>
    state.config.otpVerificationRequired;
export const selectDepositBranch = (state: RootState) =>
    state.config.depositBranch;
export const selectCompanyName = (state: RootState) => state.config.companyName;
export const selectAllocationMonth = (state: RootState) =>
    state.config.allocationMonth;
export const selectIsFeedbackResponseNeeded = (state: RootState) =>
    state.config.isFeedbackResponseNeeded;
export const selectCollectionModes = (state: RootState) =>
    state.config.collectionModes;
export const selectDepositModes = (state: RootState) =>
    state.config.depositModes;
export const selectCallingModes = (state: RootState) =>
    state.config.callingModes;
export const selectGeofencingRequired = (state: RootState) =>
    state.config.geoFencingRequired;
export const selectCountryIsdCode = (state: RootState) =>
    state.config.countryIsdCode;
export const selectGeofencingDistance = (state: RootState) =>
    state.config.geofencingDistance;
export const selectCompanyType = (state: RootState) => state.config.companyType;
export const selectIsRecoveryAmountBifurcationEnabled = (state: RootState) =>
    state.config.isRecoveryAmountBifurcationEnabled;
export const selectShowBalanceClaimAmount = (state: RootState) =>
    state.config.showBalanceClaimAmount;
export const selectLocationAccess = (state: RootState) =>
    state.config.locationAccess;
export const selectIsRoutePlanningEnabled = (state: RootState) =>
    state.config.isRoutePlanningEnabled;
export const selectDepositBranchLocation = (state: RootState) =>
    state.config.depositBranchLocation;
export const selectShowCompanyBankRepresentatives = (state: RootState) =>
    state.config.showCompanyBankRepresentatives;
export const selectDepositOtpVerificationMethod = (state: RootState) =>
    state.config.depositOtpVerificationMethod;
export const selectOnlineCollectionMode = (state: RootState) =>
    state.config.onlineCollectionMode;
export const selectMockLocationEnabled = (state: RootState) =>
    state.config.mockLocationEnabled;
export const selectChequeDetailsInput = (state: RootState) =>
    state.config.chequeDetailsInput;
export const selectCollectionLimitsDetails = (state: RootState) =>
    state.config.collectionLimitsDetails;
export const selectCompanyAddressState = (state: RootState) =>
    state.config.companyAddressCity;
export const selectCompanyAddressPincode = (state: RootState) =>
    state.config.companyAddressPincode;
export const selectCompanyAddressCity = (state: RootState) =>
    state.config.companyAddressCity;
export const selectCompanyAddressText = (state: RootState) =>
    state.config.companyAddressText;
export const selectCompanyLogo = (state: RootState) => state.config.companyLogo;
export const selectOfflineMode = (state: RootState) => state.config.offlineMode;

export default configSlice.reducer;
