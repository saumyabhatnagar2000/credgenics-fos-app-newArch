import React from 'react';
import { StyleSheet, View } from 'react-native';
import useCommon from '../hooks/useCommon';

const styles = StyleSheet.create({
    container: {
        opacity: 0.3
    },
    heading: {
        color: '#f00a',
        position: 'absolute',
        textAlign: 'center',
        top: 0,
        width: '100%'
    }
});

export default function OnlineOnly(props) {
    const { isInternetAvailable } = useCommon();

    if (isInternetAvailable) return props?.children;

    return (
        <View>
            <View
                onStartShouldSetResponderCapture={(event) => true}
                onMoveShouldSetResponderCapture={(event) => true}
                onTouchStart={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                }}
                style={styles.container}
            >
                {props?.children}
            </View>
        </View>
    );
}
