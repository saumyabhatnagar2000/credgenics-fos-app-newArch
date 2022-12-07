import React from 'react';
import { SvgFromXml } from 'react-native-svg';

export default function FilterIcon({ color }: { color: string }) {
    const xml = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.28578 1.14282H0.714355L4.14293 5.19711V8.42854L5.85721 9.28568V5.19711L9.28578 1.14282Z" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;
    return <SvgFromXml xml={xml} height={13} width={13} />;
}
