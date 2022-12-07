import * as React from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

export default function WavyHeader() {
    return (
        <Svg
            width={430}
            height={150}
            preserveAspectRatio="xMinYMin slice"
            viewBox="0 0 360 121"
            fill="none"
        >
            <Path
                d="M251.129 54.03C300.484 32.867 344.274 43.335 360 51.214V0H0v117.626c124.839 17.447 189.435-37.145 251.129-63.597z"
                fill="#6698FA"
            />
            <Path
                d="M251.129 41.08c49.355-16.09 93.145-8.13 108.871-2.14V0H0v89.434C124.839 102.7 189.435 61.192 251.129 41.08z"
                fill="url(#prefix__paint0_linear)"
            />
            <Defs>
                <LinearGradient
                    id="prefix__paint0_linear"
                    x1={476.283}
                    y1={62.283}
                    x2={455.327}
                    y2={-64.652}
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
