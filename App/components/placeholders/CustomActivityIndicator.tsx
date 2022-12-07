import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { BLUE_DARK } from '../../constants/Colors';

export const CustomActivityIndicator = () => {
    return <ActivityIndicator color={BLUE_DARK} size="small" />;
};
