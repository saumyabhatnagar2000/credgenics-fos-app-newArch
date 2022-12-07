import React from 'react';
import { SvgXml } from 'react-native-svg';

const HomeXml = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.64278 14.052H12.0118C12.4856 14.052 12.8732 13.6645 12.8732 13.1907V7.80673H14.1222C14.4883 7.80673 14.7898 7.59131 14.9406 7.24684C15.0698 6.90223 14.9838 6.53616 14.7252 6.29923L8.07065 0.22612C7.72604 -0.0753735 7.23075 -0.0753735 6.90779 0.22612L0.27475 6.29923C0.0163661 6.53613 -0.0698577 6.92369 0.0593304 7.24684C0.188522 7.59145 0.51166 7.80673 0.87773 7.80673H2.12681V13.1692C2.12681 13.6429 2.51438 14.0305 2.98817 14.0305H5.33569C5.80947 14.0305 6.19704 13.6429 6.19704 13.1692V9.93878H8.7813V13.1477C8.78146 13.6644 9.16903 14.052 9.64281 14.052L9.64278 14.052Z" fill="url(#paint0_radial_4287_3576)"/>
<defs>
<radialGradient id="paint0_radial_4287_3576" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(5.21104 -2.63476) rotate(82.1894) scale(16.8431 20.6468)">
<stop stop-color="#5278C7"/>
<stop offset="1" stop-color="#233F78"/>
</radialGradient>
</defs>
</svg>
`;

const WorkXml = `<svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.6537 2.7429H12.1791V1.43817C12.1786 1.05685 12.027 0.691348 11.7574 0.421696C11.4878 0.152051 11.1223 0.000495057 10.741 0H4.26251C3.88119 0.000483454 3.51568 0.152048 3.24603 0.421696C2.97651 0.691341 2.82483 1.05682 2.82434 1.43817V2.7429H1.34811C0.990366 2.74326 0.647446 2.88576 0.39475 3.13885C0.142023 3.39194 3.77144e-06 3.73496 3.77144e-06 4.09258V10.5729C-0.000842282 10.9311 0.14069 11.2751 0.393543 11.5289C0.646397 11.7827 0.989778 11.9257 1.34814 11.9261H13.6503H13.6502C14.0079 11.9261 14.3509 11.7842 14.604 11.5314C14.8571 11.2786 14.9995 10.9357 15 10.5781V4.09592C15.001 3.73793 14.8596 3.3943 14.6071 3.14049C14.3546 2.88668 14.0117 2.74358 13.6537 2.74274L13.6537 2.7429ZM4.33519 1.51079H10.6682V2.74274H4.33519V1.51079Z" fill="url(#paint0_radial_4287_3571)"/>
<defs>
<radialGradient id="paint0_radial_4287_3571" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(5.21104 -2.23613) rotate(80.819) scale(14.346 20.5732)">
<stop stop-color="#5278C7"/>
<stop offset="1" stop-color="#233F78"/>
</radialGradient>
</defs>
</svg>
`;

const OthersXml = `<svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.5 17C6.5 17 13 12.4007 13 6.20034C13 2.76541 10.1009 0 6.5 0C2.89906 0 0 2.76541 0 6.20034C0 12.4007 6.5 17 6.5 17ZM2.89906 6.20034C2.89906 4.30822 4.51643 2.76541 6.5 2.76541C8.48357 2.76541 10.1315 4.30822 10.1315 6.20034C10.1315 8.09247 8.51408 9.63527 6.53052 9.63527C4.54695 9.63527 2.89906 8.12158 2.89906 6.20034Z" fill="url(#paint0_radial_4287_3584)"/>
<defs>
<radialGradient id="paint0_radial_4287_3584" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.51623 -3.1875) rotate(84.3877) scale(20.2847 17.9749)">
<stop stop-color="#5278C7"/>
<stop offset="1" stop-color="#233F78"/>
</radialGradient>
</defs>
</svg>
`;
export const HomeIcon = () => {
    return <SvgXml xml={HomeXml} />;
};
export const WorkIcon = () => {
    return <SvgXml xml={WorkXml} />;
};
export const OtherIcon = () => {
    return <SvgXml xml={OthersXml} />;
};
