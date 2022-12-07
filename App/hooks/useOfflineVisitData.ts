import {
    offlineVisitDataSlice,
    fetchRecoveryVariables
} from './../redux/offlineVisitDataSlice';
import { AuthData, OfflineVisitDataMap } from './../../types';
import {
    fetchDipositionStatus,
    selectCloseVisit,
    selectDispositionStatus,
    updateVisitCloseMap,
    selectRecoveryVariables
} from '../redux/offlineVisitDataSlice';
import { useAppDispatch, useAppSelector } from './../redux/hooks';
export default function useOfflineVisitData() {
    const dispatch = useAppDispatch();
    const dispositionStatus = useAppSelector(selectDispositionStatus);

    const visitSubmissionData = useAppSelector(selectCloseVisit);
    const recoveryVariables = useAppSelector(selectRecoveryVariables);

    const getDispositionStatus = (authData?: AuthData) => {
        dispatch(fetchDipositionStatus({ authData }))
            .unwrap()
            .then((data) => {
                return data;
            })
            .catch((e) => {});
    };

    const getRecoveryVariables = (authData: AuthData) => {
        dispatch(fetchRecoveryVariables(authData))
            .unwrap()
            .then((data) => data)
            .catch((e) => {});
    };

    const setOfflineVisitData = (a: OfflineVisitDataMap) =>
        dispatch(updateVisitCloseMap(a));

    return {
        dispositionStatus,
        visitSubmissionData,
        getDispositionStatus,
        setOfflineVisitData,
        getRecoveryVariables,
        recoveryVariables
    };
}
