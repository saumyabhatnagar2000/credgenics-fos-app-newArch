import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { PortfolioLoan } from '../../types';

export interface PortfolioState {
    portfolioList: Array<PortfolioLoan>;
}

const initialState: PortfolioState = {
    portfolioList: []
};

export const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        updatePortfolioList: (
            state,
            action: PayloadAction<Array<PortfolioLoan>>
        ) => {
            state.portfolioList = action.payload;
        }
    }
});

export const { updatePortfolioList } = portfolioSlice.actions;

export const selectPortfolioList = (state: RootState) =>
    state.portfolio.portfolioList;

export default portfolioSlice.reducer;
