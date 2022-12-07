import React from 'react';
import { SvgFromXml } from 'react-native-svg';

const xml = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.49998 0.5C6.37822 0.5 4.34339 1.34284 2.84307 2.84307C1.34284 4.34339 0.5 6.37826 0.5 8.49998C0.5 10.6217 1.34284 12.6566 2.84307 14.1569C4.34339 15.6571 6.37825 16.5 8.49998 16.5C10.6217 16.5 12.6566 15.6571 14.1569 14.1569C15.6571 12.6566 16.5 10.6217 16.5 8.49998C16.5 7.09572 16.1303 5.7162 15.4282 4.50003C14.7261 3.28387 13.7162 2.27399 12.5 1.57186C11.2838 0.869732 9.90433 0.500091 8.50007 0.500091L8.49998 0.5ZM8.49998 15.4331C6.66119 15.4331 4.89774 14.7026 3.59734 13.4024C2.29712 12.1022 1.56665 10.3387 1.56665 8.4998C1.56665 6.66089 2.29712 4.89756 3.59734 3.59716C4.89756 2.29694 6.66107 1.56647 8.49998 1.56647C10.3389 1.56647 12.1022 2.29694 13.4026 3.59716C14.7028 4.89738 15.4333 6.66089 15.4333 8.4998C15.4333 10.3387 14.7028 12.102 13.4026 13.4024C12.1024 14.7026 10.3389 15.4331 8.49998 15.4331Z" fill="#043E90"/>
<path d="M12.9098 5.49203C12.8098 5.39263 12.6747 5.33691 12.5337 5.33691C12.3929 5.33691 12.2576 5.39263 12.1578 5.49203L7.20332 10.4465C7.14785 10.4986 7.06142 10.4986 7.00594 10.4465L4.84061 8.28114C4.74073 8.18186 4.6055 8.12602 4.46466 8.12602C4.32371 8.12602 4.18859 8.18186 4.08859 8.28114C3.98931 8.38114 3.93359 8.51625 3.93359 8.65721C3.93359 8.79804 3.98931 8.93328 4.08859 9.03316L7.00594 11.9505C7.06142 12.0027 7.14785 12.0027 7.20332 11.9505L12.9099 6.25977C13.0092 6.1599 13.0649 6.02466 13.0649 5.88383C13.0649 5.74288 13.0092 5.60776 12.9099 5.50775L12.9098 5.49203Z" fill="#043E90"/>
</svg>
`;

export const ResolveIcon = () => {
    return <SvgFromXml height={20} width={20} xml={xml} />;
};
