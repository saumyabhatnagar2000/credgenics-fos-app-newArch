import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TypographyFontFamily } from './ui/Typography';

export default function TitleAvatar({
    title,
    size = 57,
    style = {},
    textStyle
}: {
    title: string;
    size?: number;
    style?: object;
    textStyle?: object;
}) {
    title = title ? title : 'N A';
    const text = title
        ?.split(' ')
        ?.map((letter: string) => letter[0] && letter[0].match(/[a-z]/i))
        ?.join('');
    return (
        <View
            style={[styles.container, style, { height: size, minWidth: size }]}
        >
            <Text style={[styles.title, textStyle]}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#043E90',
        borderColor: '#F6F8FB',
        borderRadius: 8,
        borderWidth: 1,
        elevation: 1,
        justifyContent: 'center'
    },
    title: {
        color: '#F6F8FB',
        fontFamily: TypographyFontFamily.heavy,
        fontSize: 24,
        fontStyle: 'normal',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        paddingHorizontal: 7
    }
});
