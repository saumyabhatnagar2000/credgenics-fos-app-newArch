import { TaskHistoryFilterContextData } from '../../types';
import { useContext } from 'react';
import { TaskHistoryFilterContext } from '../contexts/TaskHistoryFilterContext';

export function useTaskHistoryFilter(): TaskHistoryFilterContextData {
    const context = useContext(TaskHistoryFilterContext);
    if (!context) {
        throw new Error(
            'useTaskHistoryFilter must be used within an taskFilterHistoryProvider'
        );
    }
    return context;
}
