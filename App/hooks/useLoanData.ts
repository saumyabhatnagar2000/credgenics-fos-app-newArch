import { getAddressDataKey } from './../constants/Keys';
import { LoansArrayType } from './../../types';
import {
    fetchLoanDetails,
    selectLoanDetails,
    updateLoanDetail,
    updateLoanDetailMap,
    selectSelectedLoanData,
    updateSelectedLoanData,
    LoanDetailMapOfflineType,
    updateLoanDetailOfflineMap,
    selectLoanDetailOffline,
    clearLoanDetailMap as _clearLoanDetailMap
} from './../redux/loanDetailSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useAuth } from './useAuth';

export default function useLoanDetails() {
    const dispatch = useAppDispatch();
    const { authData } = useAuth();
    const loanDetailMap = useAppSelector(selectLoanDetails);
    const loanDetailOfflineObj = useAppSelector(selectLoanDetailOffline);

    const setLoanDetailMap = (a: any) => {
        return dispatch(updateLoanDetailMap(a));
    };
    const setLoanDetail = (a: any) => {
        return dispatch(updateLoanDetail(a));
    };

    const getLoanDetails = (loansArray: Array<LoansArrayType>) => {
        dispatch(fetchLoanDetails({ loansArray, authData }))
            .unwrap()
            .then((data) => {
                return data;
            })
            .catch((e) => {});
    };

    const selectedLoanData = useAppSelector(selectSelectedLoanData);
    const setSelectedLoanData = (a: any) => {
        return dispatch(updateSelectedLoanData(a));
    };

    const getAddressData = (allocationMonth: string, loanId: string) => {
        return (
            loanDetailMap?.[loanId]?.[getAddressDataKey(allocationMonth)] ?? {}
        );
    };

    const setLoanDetailsOfflineObj = (a: LoanDetailMapOfflineType) => {
        return dispatch(updateLoanDetailOfflineMap(a));
    };

    const clearLoanDetailMap = () => {
        return dispatch(_clearLoanDetailMap());
    };

    return {
        loanDetailMap,
        setLoanDetailMap,
        setLoanDetail,
        getLoanDetails,
        selectedLoanData,
        setSelectedLoanData,
        getAddressData,
        setLoanDetailsOfflineObj,
        loanDetailOfflineObj,
        clearLoanDetailMap
    };
}
