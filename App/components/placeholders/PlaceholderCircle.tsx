import React from 'react';
import { View } from 'react-native';

const ActionButtonHolder = () => (
    <View
        style={{
            borderRadius: 100,
            backgroundColor: 'white',
            height: 50,
            width: 50,
            position: 'absolute',
            bottom: 0,
            right: 0,
            margin: 25,
            elevation: 1
        }}
    />
);

export default ActionButtonHolder;
