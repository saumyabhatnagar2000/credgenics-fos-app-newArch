import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const Button = ({ children, onPress, buttonStyle, buttonTextStyle }) => {
    const mergedStyles = {
        button: {
            ...styles.button,
            ...buttonStyle
        },
        buttonText: {
            ...styles.buttonText,
            ...buttonTextStyle
        }
    };
    return (
        <TouchableOpacity onPress={onPress} style={mergedStyles.button}>
            <Text style={mergedStyles.buttonText}>{children}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderColor: '#bdbdbd',
        borderRadius: 15,
        borderStyle: 'solid',
        borderWidth: 1,
        justifyContent: 'center',
        marginBottom: 10,
        marginLeft: 10,
        padding: 10
    },
    buttonText: {}
});

export default Button;
