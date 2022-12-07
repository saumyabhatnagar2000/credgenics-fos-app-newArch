import { TaskContextData } from '../../types';
import { useContext } from 'react';
import { TaskContext } from '../contexts/TaskContext';

export function useTaskAction(): TaskContextData {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
