import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Typography from './Typography';

const CurrencyTypography = (props: any) => {
    const { getCurrencyString } = useAuth();
    const { amount, ...extraProps } = props;

    return (
        <Typography {...extraProps}>
            {amount ? getCurrencyString(amount) : getCurrencyString(0)}
        </Typography>
    );
};

export default CurrencyTypography;
