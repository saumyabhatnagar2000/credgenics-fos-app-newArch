import React from 'react';
import { SvgXml } from 'react-native-svg';

const MENU_SVG = `<svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.0763 9.44141H1.6485C0.749319 9.44141 0 10.1907 0 11.0899C0 11.9891 0.749319 12.7384 1.6485 12.7384H15.1063C16.0054 12.7384 16.7548 11.9891 16.7548 11.0899C16.7248 10.1608 16.0054 9.44141 15.0763 9.44141Z" fill="white"/>
<path d="M20.3215 0H1.6485C0.749319 0 0 0.749319 0 1.6485C0 2.54768 0.749319 3.297 1.6485 3.297H20.3515C21.2507 3.297 22 2.54768 22 1.6485C21.97 0.749319 21.2507 0 20.3215 0Z" fill="white"/>
<path d="M20.3215 18.8528H1.6485C0.749319 18.8528 0 19.6021 0 20.5013C0 21.4005 0.749319 22.1498 1.6485 22.1498H20.3515C21.2507 22.1498 22 21.4005 22 20.5013C21.97 19.6021 21.2507 18.8528 20.3215 18.8528Z" fill="white"/>
</svg>`;

export default function MenuIcon({ size = 18 }: { size?: number }) {
    return <SvgXml xml={MENU_SVG} width={size} />;
}
