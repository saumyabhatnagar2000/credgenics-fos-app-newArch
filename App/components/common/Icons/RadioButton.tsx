import React from 'react';
import { SvgFromXml } from 'react-native-svg';

const xml = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="6" fill="#043E90"/>
<circle cx="12" cy="12" r="11" stroke="#043E90" stroke-width="2"/>
</svg>
`;
export default function RadioButtonIcon() {
    return <SvgFromXml xml={xml} height={13} width={13} />;
}
