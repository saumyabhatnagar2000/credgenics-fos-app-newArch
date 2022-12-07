import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Typography from './Typography';

export const NumberTypography = (props: any) => {
    const { callingModes } = useAuth();
    const { number, ...extraProps } = props;
    let displayNumber = number;

    //uncomment for masking

    // if (
    //     callingModes.includes(CallingModeTypes.click_to_call) &&
    //     callingModes.length == 1
    // )
    //     displayNumber = number.replace(number.slice(0, 6), 'XXXXXX');

    return <Typography {...extraProps}>{displayNumber}</Typography>;
};
