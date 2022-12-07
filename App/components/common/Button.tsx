import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';

const Button = ({ title, titleProps, onPress, style, ...props }: any) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.container, style]}
        {...props}
    >
        <Text style={[styles.title, titleProps]}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: Colors.common.primary,
        borderRadius: 5,
        height: 40,
        justifyContent: 'center',
        marginVertical: 10,
        width: '100%'
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10
    }
});

export default Button;
