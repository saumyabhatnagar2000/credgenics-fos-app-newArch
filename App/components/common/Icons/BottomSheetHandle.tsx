import React from 'react';
import { View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const BottomSheetHandle = () => {
    return (
        <View
            style={{
                width: RFPercentage(10),
                height: 5,
                backgroundColor: '#C4C4C4',
                borderRadius: 8,
                marginVertical: RFPercentage(1),
                alignSelf: 'center'
            }}
        />
    );
};
