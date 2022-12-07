import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SubmitButtonHolder = () => (
    <View
        style={{
            backgroundColor: 'white',
            height: 50,
            width: '100%',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0
        }}
    >
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
                width={200}
                height={20}
                borderRadius={20}
                alignSelf="center"
            />
        </SkeletonPlaceholder>
    </View>
);

export default SubmitButtonHolder;
