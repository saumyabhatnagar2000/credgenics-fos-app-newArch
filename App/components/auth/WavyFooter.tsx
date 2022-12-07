import * as React from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

export default function WavyFooter() {
    return (
        <Svg
            width={430}
            height={160}
            preserveAspectRatio="xMinYMin slice"
            viewBox="0 0 360 154"
            fill="none"
        >
            <Path
                d="M108.872 86.343C59.516 113.625 15.726 100.129 0 89.97V156h360V4.35C235.161-18.143 170.565 52.24 108.871 86.343z"
                fill="url(#prefix__paint0_linear)"
            />
            <Defs>
                <LinearGradient
                    id="prefix__paint0_linear"
                    x1={-116.283}
                    y1={50.389}
                    x2={-58.885}
                    y2={255.426}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#5B8DEF" />
                    <Stop offset={0} stopColor="#5B8DEF" />
                    <Stop offset={1} stopColor="#0063F7" />
                </LinearGradient>
            </Defs>
        </Svg>
    );
}
