import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        opacity: 0.3
    }
});

export default function Disabled(props: any) {
    return (
        <View pointerEvents={props.isDisable ? 'none' : 'auto'}>
            <View style={props.isDisable && styles.container}>
                {props?.children}
            </View>
        </View>
    );
}
