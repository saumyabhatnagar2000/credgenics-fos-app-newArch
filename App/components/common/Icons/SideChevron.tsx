import React from 'react';
import { SvgXml } from 'react-native-svg';

export const SideChevron = ({
    color = '#043E90',
    rotate = -90,
    height = 6,
    width = 12
}) => {
    return (
        <SvgXml
            xml={`
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L7 7L13 1" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `}
            height={height}
            width={width}
            style={{ transform: [{ rotate: `${rotate}deg` }] }}
        />
    );
};
