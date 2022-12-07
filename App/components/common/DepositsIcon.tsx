import React from 'react';
import { SvgXml } from 'react-native-svg';
import { cashsvg, checksvg, onlinepaysvg } from './depositsIconAssets';
import { DepositTypes } from '../../../enums';

export default function DepositsImages({
    type = DepositTypes.online,
    size = 54
}: {
    type?: string;
    size?: number;
}) {
    var newxml = cashsvg;
    if (type.toLowerCase() === 'cash') {
        newxml = cashsvg;
    } else if (type.toLowerCase() === 'online') {
        newxml = onlinepaysvg;
    } else {
        newxml = checksvg;
    }
    return <SvgXml xml={newxml} height={size} width={size} />;
}
