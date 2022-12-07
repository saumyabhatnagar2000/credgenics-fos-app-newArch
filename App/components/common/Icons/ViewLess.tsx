import React from 'react';
import { SvgXml } from 'react-native-svg';

export const ViewLess = () => {
    return (
        <SvgXml
            xml={`
                <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 3.5L4 0.5L1 3.5" stroke="#8899A8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>                        
          `}
            height={3}
            width={6}
            style={{ paddingLeft: 15 }}
        />
    );
};
