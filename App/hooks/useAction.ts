import { ActionContextData } from './../../types';
import { useContext } from 'react';
import { ActionContext } from '../contexts/ActionContext';

export function useAction(): ActionContextData {
    const context = useContext(ActionContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
