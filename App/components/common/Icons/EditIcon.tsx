import React from 'react';
import { SvgXml } from 'react-native-svg';

export const EditIcon = ({ color }: { color: string }) => {
    return (
        <SvgXml
            xml={`<svg width="15" height="15" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10.0006V12.5006H2.5L9.87333 5.12723L7.37333 2.62723L0 10.0006ZM11.8067 3.1939C12.0667 2.9339 12.0667 2.5139 11.8067 2.2539L10.2467 0.693901C9.98667 0.433901 9.56667 0.433901 9.30667 0.693901L8.08667 1.9139L10.5867 4.4139L11.8067 3.1939Z" fill=${color}/>
            </svg>`}
        />
    );
};
