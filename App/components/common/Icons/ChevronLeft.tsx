import React from 'react';
import { SvgXml } from 'react-native-svg';

export const ChevronLeft = ({ size = 54, color = '#F5F6FA' }) => {
    return (
        <SvgXml
            xml={`
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.42871 2.14307L1.57157 9.00021L8.42871 15.8574" stroke=${color} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `}
            height={size}
            width={size}
        />
    );
};
