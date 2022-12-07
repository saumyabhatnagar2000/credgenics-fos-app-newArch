import { useEffect, useRef } from 'react';

export const useInterval = (callback: Function, delay: number) => {
    const savedCallBack = useRef<Function>(callback);
    useEffect(() => {
        savedCallBack.current = callback;
    }, [callback]);

    useEffect(() => {
        const timer = setInterval(() => {
            savedCallBack.current();
        }, delay);
        return () => clearInterval(timer);
    }, [delay]);
};
