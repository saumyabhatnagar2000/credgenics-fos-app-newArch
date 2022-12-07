import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const ListFooterLoader = () => (
    <View
        style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}
    >
        <ActivityIndicator animating={true} />
    </View>
);

export default ListFooterLoader;
