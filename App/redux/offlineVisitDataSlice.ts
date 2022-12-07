import { ToastAndroid } from 'react-native';
import { AuthData, OfflineVisitDataMap } from './../../types';
import { getAllDispositionStatus } from './../services/callingService';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import { getRecVar } from '../services/portfolioService';
import _ from 'lodash';

export interface OfflineVisitDataSliceState {
    dispositionStatus: any;
    visitCloseData: any;
    recoveryVariable: any;
}

const initialState: OfflineVisitDataSliceState = {
    dispositionStatus: {},
    visitCloseData: {},
    recoveryVariable: []
};

export const fetchDipositionStatus = createAsyncThunk(
    'offlineVisitData/allStatus',
    async ({ authData }: { authData?: AuthData }) => {
        try {
            return await getAllDispositionStatus(authData);
        } catch (e) {}
    }
);

export const fetchRecoveryVariables = createAsyncThunk(
    'offlineVisitData/recsVars',
    async (authData: AuthData) => {
        try {
            return await getRecVar(authData);
        } catch {}
    }
);

export const offlineVisitDataSlice = createSlice({
    name: 'offlineVisitDataSlice',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(
            fetchDipositionStatus.fulfilled,
            (state, { payload }) => {
                state.dispositionStatus = { ...payload };
            }
        ),
            builder.addCase(
                fetchRecoveryVariables.fulfilled,
                (state, { payload }) => {
                    state.recoveryVariable = payload;
                }
            );
    },
    reducers: {
        updateVisitCloseMap: (
            state,
            action: PayloadAction<OfflineVisitDataMap>
        ) => {
            state.visitCloseData = {
                ...state.visitCloseData,
                ...action.payload
            };
        },
        updateDispositionStatus: (state, action: PayloadAction<any>) => {},
        removeSubmittedVisitFromCache: (state, action: PayloadAction<any>) => {
            try {
                delete state.visitCloseData[action.payload];
            } catch (e) {
                // no visit found
            }
            if (Object.keys(state.visitCloseData).length == 0)
                ToastAndroid.show(
                    'Data Syncing Completed!!',
                    ToastAndroid.SHORT
                );
        },
        clearVisitCloseMap: (state) => {
            state.visitCloseData = {};
        }
    }
});

export const {
    updateDispositionStatus,
    updateVisitCloseMap,
    removeSubmittedVisitFromCache,
    clearVisitCloseMap
} = offlineVisitDataSlice.actions;

export const selectDispositionStatus = (state: RootState) =>
    state.offlineVisitData.dispositionStatus;
export const selectCloseVisit = (state: RootState) =>
    state.offlineVisitData.visitCloseData;
export const selectRecoveryVariables = (state: RootState) =>
    state.offlineVisitData.recoveryVariable;

export default offlineVisitDataSlice.reducer;
