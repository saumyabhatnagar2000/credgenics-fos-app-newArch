import {
    setIsInternetAvaiable as _setIsInternetAvaiable,
    selectIsInternetAvaiable,
    selectShowSyncScreen,
    setShowSyncScreen as _setShowSyncScreen
} from '../redux/commonSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export default function useCommon() {
    const dispatch = useAppDispatch();
    const isInternetAvailable = useAppSelector(selectIsInternetAvaiable);

    const setIsInternetAvaiable = (a: boolean) =>
        dispatch(_setIsInternetAvaiable(a));

    const runIfOnline = (a: Function) => {
        return isInternetAvailable && a;
    };
    const showSyncScreen = useAppSelector(selectShowSyncScreen);
    const setShowSyncScreen = (a: boolean) => dispatch(_setShowSyncScreen(a));
    const continueIfOnline = (a: boolean) => isInternetAvailable && a;

    return {
        isInternetAvailable,
        setIsInternetAvaiable,
        runIfOnline,
        continueIfOnline,
        showSyncScreen,
        setShowSyncScreen
    };
}
