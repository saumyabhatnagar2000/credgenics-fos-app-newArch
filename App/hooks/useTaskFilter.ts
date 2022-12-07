import { TaskFilterContextData } from './../../types';
import { useContext } from 'react';
import { TaskFilterContext } from '../contexts/TaskFilterContext';

export function useTaskFilter(): TaskFilterContextData {
    const context = useContext(TaskFilterContext);
    if (!context) {
        throw new Error(
            'useTaskFilter must be used within an TaskFilterProvider'
        );
    }
    return context;
}
