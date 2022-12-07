import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import DepositList from '../../components/deposit/DepositList';
import { useTaskHistoryFilter } from '../../hooks/useTaskHistoryFilter';

export default function DepositHistoryScreen() {
    const { filterActive } = useTaskHistoryFilter();
    const navigation = useNavigation();
    React.useEffect(() => {
        if (filterActive) {
            const unsubscribe = navigation.addListener('tabPress', (e) => {
                e.preventDefault();
            });
            return unsubscribe;
        }
    }, [navigation, filterActive]);
    return <DepositList />;
}
