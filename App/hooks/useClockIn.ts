import { ClockInStatusContextData } from './../../types';
import { useContext } from 'react';
import { ClockInStatusContext } from '../contexts/ClockInStatusContext';

export function useClockIn(): ClockInStatusContextData {
    const context = useContext(ClockInStatusContext);
    if (!context) {
        throw new Error(
            'useClockIn must be used within an ClockInStatusContextProvider'
        );
    }
    return context;
}
