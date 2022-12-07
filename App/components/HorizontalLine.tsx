import React from 'react';
import { View } from 'react-native';

export const HorizontalLine = ({
    type,
    style,
    color
}: {
    type: string;
    style?: object;
    color?: string;
}) => {
    return (
        <View style={[{ paddingHorizontal: 15 }, style]}>
            <View
                style={{
                    borderColor: color ?? '#043E90',
                    borderStyle: type,
                    borderWidth: 0.75,
                    borderRadius: 0.001
                }}
            />
        </View>
    );
};
