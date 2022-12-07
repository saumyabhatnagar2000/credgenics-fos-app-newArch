import React from 'react';
import { SvgXml } from 'react-native-svg';

export const Chevron = () => {
    return (
        <SvgXml
            xml={`
                <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.3937 5.19692L0 0.803223H8.7874L4.3937 5.19692Z" fill="#043E90"/>
                </svg>`}
            style={{ marginLeft: 5, marginBottom: 3 }}
        />
    );
};
