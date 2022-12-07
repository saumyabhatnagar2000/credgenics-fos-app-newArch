import React from 'react';
import { RefreshControl } from 'react-native';

export default function PlaceholderList() {
    return <RefreshControl refreshing={true} colors={['#043E90']} />;
}
