import React from 'react';
import { SvgXml } from 'react-native-svg';

export const ScheduledVisitIcon = ({ color }: { color: string }) => {
    return (
        <SvgXml
            xml={`
            <svg width="32" height="34" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.9802 22.6201C22.9348 22.6654 22.8895 22.7108 22.8895 22.7561C20.3966 25.8382 17.949 27.6513 17.8584 27.7419C17.6317 27.8779 17.4051 27.9686 17.1785 27.9686C16.9518 27.9686 16.6799 27.8779 16.4533 27.7419C16.3626 27.6513 13.915 25.8382 11.4221 22.8014L0 29.0564L25.0652 33.6796L32 23.7533L22.9802 22.6201Z" fill="${color}"/>
            <path d="M17.1334 26.7906C17.1334 26.7906 26.7878 19.6291 26.7878 9.9747C26.7878 4.62626 22.4818 0.320312 17.1334 0.320312C11.785 0.320312 7.479 4.62626 7.479 9.9747C7.479 19.6291 17.1334 26.7906 17.1334 26.7906ZM11.785 9.9747C11.785 7.02853 14.1872 4.62626 17.1334 4.62626C20.0796 4.62626 22.5272 7.02853 22.5272 9.9747C22.5272 12.9209 20.1249 15.3231 17.1787 15.3231C14.2325 15.3231 11.785 12.9662 11.785 9.9747Z" fill="${color}"/>
            </svg>
            `}
            height={27}
            width={27}
        />
    );
};
