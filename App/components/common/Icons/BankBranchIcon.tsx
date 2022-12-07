import React from 'react';
import { SvgFromXml } from 'react-native-svg';

const xml = `<svg width="15" height="15" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 9.62542H22V6.87554H0V9.62542ZM11.0006 0L2.75 5.4997H19.2506L11.0006 0ZM20.6253 11H17.8753V19.2489H15.1253V11H12.3753V19.2489H9.62468V11H6.87532V19.2489H4.12532V11H1.37468V19.2489H0V22H22V19.2489H20.6253V11Z" fill="#043E90"/>
</svg>
`;
export const BankBranchIcon = () => {
    return <SvgFromXml xml={xml} />;
};
