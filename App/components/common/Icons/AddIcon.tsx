import React from 'react';
import { SvgFromXml } from 'react-native-svg';

const xml = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 2L8 13.75" stroke="#043E90" stroke-width="2.5" stroke-linecap="round"/>
<path d="M13.75 8L2 8" stroke="#043E90" stroke-width="2.5" stroke-linecap="round"/>
</svg>
`;
export const AddIcon = () => {
    return <SvgFromXml xml={xml} />;
};
