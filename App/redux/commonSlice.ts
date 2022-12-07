import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface CommonState {
    isInternetAvailable: boolean;
    showSyncScreen: boolean;
}

const initialState: CommonState = {
    isInternetAvailable: false,
    showSyncScreen: false
};

export const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        setIsInternetAvaiable: (state, action: PayloadAction<boolean>) => {
            state.isInternetAvailable = action.payload;
        },
        setShowSyncScreen: (state, action: PayloadAction<boolean>) => {
            state.showSyncScreen = action.payload;
        }
    }
});

export const { setIsInternetAvaiable, setShowSyncScreen } = commonSlice.actions;

export const selectIsInternetAvaiable = (state: RootState) =>
    state.common.isInternetAvailable;
export const selectShowSyncScreen = (state: RootState) =>
    state.common.showSyncScreen;
export default commonSlice.reducer;
