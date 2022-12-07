import React from 'react';
import { SvgXml } from 'react-native-svg';

export const FailureTick = () => {
    return (
        <SvgXml
            xml={`<svg width="15" height="15" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.96968 18.0536C13.9235 18.0536 17.9394 14.0122 17.9394 9.02682C17.9394 4.04144 13.9235 0 8.96968 0C4.01586 0 0 4.04144 0 9.02682C0 14.0122 4.01586 18.0536 8.96968 18.0536Z" fill="#AA3D3D"/>
            <path d="M14 5.00714L12.9929 4L9 7.99286L5.00714 4L4 5.00714L7.99286 9L4 12.9929L5.00714 14L9 10.0071L12.9929 14L14 12.9929L10.0071 9L14 5.00714Z" fill="white"/>
            </svg>
            `}
        />
    );
};
