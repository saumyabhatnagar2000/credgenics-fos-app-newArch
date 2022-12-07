import { getLoanDetailsWithLoan } from './../services/portfolioService';
import {
    UpdationAddressType,
    AuthData,
    LoanDataWithDetailsType,
    LoansArrayType,
    SelectedLoanDataType
} from './../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import { LoanDetailsType } from '../../types';
import { TaskScheduledByType, VisitPurposeType } from '../../enums';

export interface LoanDetailMapType {
    [loan_id: string]: LoanDataWithDetailsType;
}

export interface LoanDetailOfflineType {
    addressData?: UpdationAddressType | undefined;
    allocationMonth: string;
    applicantContactNumber?: string | undefined;
    coApplicantObject?: any | undefined;
}
export interface LoanDetailMapOfflineType {
    [loan_id: string]: LoanDetailOfflineType;
}
export interface LoanDetailSliceState {
    loanDetailMap: LoanDetailMapType;
    selectedLoanData: SelectedLoanDataType;
    loanDetailOfflineMap: LoanDetailMapOfflineType;
}

const initialState: LoanDetailSliceState = {
    loanDetailMap: {},
    selectedLoanData: {
        loan_id: '',
        applicant_name: '',
        applicant_type: '',
        date_of_default: '',
        total_claim_amount: 0,
        distance_in_km: '',
        address_index: 0,
        applicant_index: 0,
        final_status: '',
        applicant_photo_link: '',
        number_of_transactions: '',
        dpd: '',
        visit_id: '',
        allocation_month: '',
        created: '',
        distance: '',
        reminder_id: '',
        visit_date: '',
        visit_purpose: VisitPurposeType.surprise_visit,
        visit_status: '',
        collection_receipt_url: '',
        scheduled_by: TaskScheduledByType.agent,
        amount_recovered: '',
        short_collection_receipt_url: ''
    },
    loanDetailOfflineMap: {}
};

type LoanDetailMapItem = {
    loanId: string;
    loanDetail: LoanDetailsType;
};

export const fetchLoanDetails = createAsyncThunk(
    'loanDetail/allLoan',
    async ({
        loansArray,
        authData
    }: {
        loansArray: Array<LoansArrayType>;
        authData?: AuthData;
    }) => {
        try {
            return await getLoanDetailsWithLoan(loansArray, authData);
        } catch (e) {}
    }
);

export const loanDetailSlice = createSlice({
    name: 'loanDetail',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchLoanDetails.fulfilled, (state, { payload }) => {
            let newPayload = {};
            if (state.loanDetailMap) {
                Object.keys(payload).forEach((loan_id) => {
                    let tempPayload = {};
                    if (payload[loan_id]) {
                        tempPayload = {
                            ...state.loanDetailMap[loan_id],
                            ...payload[loan_id]
                        };
                    }
                    newPayload = {
                        ...state.loanDetailMap,
                        ...newPayload,
                        ...{ [loan_id]: tempPayload }
                    };
                });
                state.loanDetailMap = { ...state.loanDetailMap, ...newPayload };
            } else {
                state.loanDetailMap = { ...payload };
            }
        });
    },
    reducers: {
        updateLoanDetailMap: (
            state,
            action: PayloadAction<LoanDetailMapType>
        ) => {
            state.loanDetailMap = { ...state.loanDetailMap, ...action.payload };
        },
        clearLoanDetailMap: (state) => {
            state.loanDetailMap = {};
        },
        updateLoanDetail: (state, action: PayloadAction<LoanDetailMapType>) => {
            state.loanDetailMap = { ...state.loanDetailMap, ...action.payload };
        },
        updateSelectedLoanData: (
            state,
            action: PayloadAction<SelectedLoanDataType>
        ) => {
            state.selectedLoanData = { ...action.payload };
        },
        updateLoanDetailOfflineMap: (
            state,
            action: PayloadAction<LoanDetailMapOfflineType>
        ) => {
            state.loanDetailOfflineMap = {
                ...state.loanDetailOfflineMap,
                ...action.payload
            };
        },
        removeAddressDatafromCache: (state, action: PayloadAction<string>) => {
            const tempData = state.loanDetailOfflineMap[action.payload];
            state.loanDetailOfflineMap = {
                ...state.loanDetailOfflineMap,
                [action.payload]: {
                    ...tempData,
                    addressData: undefined
                }
            };
        },
        removeAppContactNumFromCache: (state, action: PayloadAction<any>) => {
            const tempData = state.loanDetailOfflineMap[action.payload];
            state.loanDetailOfflineMap = {
                ...state.loanDetailOfflineMap,
                [action.payload]: {
                    ...tempData,
                    applicantContactNumber: undefined
                }
            };
        },
        removeCoAppContactNumFromCache: (
            state,
            action: PayloadAction<string>
        ) => {
            const tempData = state.loanDetailOfflineMap[action.payload];
            state.loanDetailOfflineMap = {
                ...state.loanDetailOfflineMap,
                [action.payload]: {
                    ...tempData,
                    coApplicantObject: undefined
                }
            };
        },
        removeLoanDataFromCache: (state, action: PayloadAction<string>) => {
            const loanData = state.loanDetailOfflineMap[action.payload];
            if (
                loanData.addressData == undefined &&
                loanData.applicantContactNumber == undefined &&
                loanData.coApplicantObject == undefined
            ) {
                try {
                    delete state.loanDetailOfflineMap[action.payload];
                } catch (e) {}
            }
        },
        clearAllLoanDetailOfflineMap: (state) => {
            state.loanDetailOfflineMap = {};
        }
    }
});

export const {
    updateLoanDetailMap,
    updateLoanDetail,
    clearLoanDetailMap,
    updateSelectedLoanData,
    updateLoanDetailOfflineMap,
    removeAddressDatafromCache,
    removeAppContactNumFromCache,
    removeCoAppContactNumFromCache,
    removeLoanDataFromCache,
    clearAllLoanDetailOfflineMap
} = loanDetailSlice.actions;

export const selectLoanDetails = (state: RootState) =>
    state.loanDetail.loanDetailMap;
export const selectSelectedLoanData = (state: RootState) =>
    state.loanDetail.selectedLoanData;
export const selectLoanDetailOffline = (state: RootState) =>
    state.loanDetail.loanDetailOfflineMap;

export default loanDetailSlice.reducer;
