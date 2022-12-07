import React from 'react';
import { SvgXml } from 'react-native-svg';

export const CrossIcon = ({ height = 27, width = 27 }) => {
    return (
        <SvgXml
            xml={`
            <svg width="32" height="27" viewBox="0 0 32 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.6846 7.50183L16.0582 13.1282L21.6846 18.7546" stroke="#909195" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.3154 7.50183L15.9418 13.1282L10.3154 18.7546" stroke="#909195" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            
            `}
            height={height}
            width={width}
        />
    );
};
