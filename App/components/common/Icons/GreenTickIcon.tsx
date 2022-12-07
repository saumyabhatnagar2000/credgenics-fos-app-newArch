import React from 'react';
import { SvgXml } from 'react-native-svg';

export const GreenTickIcon = () => {
    const xml = `<svg width="14" height="15" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.94936 16.5C12.3397 16.5 15.8987 12.9183 15.8987 8.5C15.8987 4.08172 12.3397 0.5 7.94936 0.5C3.55905 0.5 0 4.08172 0 8.5C0 12.9183 3.55905 16.5 7.94936 16.5Z" fill="#377E22"/>
    <path d="M11.8449 5.16081C11.9451 5.24275 10.4612 7.23989 8.53132 9.61945L7.36002 11.0399L7.19919 11.2342L7.02926 11.0581C5.51203 9.50108 4.48942 8.34772 4.56225 8.27488C4.63507 8.20203 5.7912 9.23095 7.34484 10.7394L7.01712 10.7728L8.16415 9.33718C10.0941 6.94244 11.7418 5.07886 11.8449 5.16081Z" fill="white" stroke="white" stroke-width="0.5"/>
    </svg>
    
`;
    return <SvgXml xml={xml} />;
};
