import { LocationContextData } from './../../types';
import { useContext } from 'react';
import { LocationContext } from '../contexts/LocationContext';

export function useLocation(): LocationContextData {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within an LocationProvider');
    }
    return context;
}
