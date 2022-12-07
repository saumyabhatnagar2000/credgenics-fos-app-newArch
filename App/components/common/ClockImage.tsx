import React from 'react';
import { ClockedInOutStatues } from '../../../enums';
import { SvgXml } from 'react-native-svg';
import { ClockInSvg, ClockOutSvg } from './assets/ClockInAssets';

export default function ClockImage({
    type = ClockedInOutStatues.clocked_in,
    size = 54
}: {
    type?: ClockedInOutStatues;
    size?: number;
}) {
    const svg =
        type === ClockedInOutStatues.clocked_out ? ClockOutSvg : ClockInSvg;
    return <SvgXml xml={svg} height={size} width={size} />;
}
