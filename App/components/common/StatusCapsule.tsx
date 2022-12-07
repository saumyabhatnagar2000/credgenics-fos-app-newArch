import React from 'react';
import { StyleSheet, View } from 'react-native';
import Typography, { TypographyVariants } from '../ui/Typography';

const StatusCapsule = ({
    title,
    primaryColor = 'grey',
    secondaryColor = 'black'
}: {
    title: string;
    primaryColor?: string;
    secondaryColor?: string;
}) => {
    return (
        <View
            style={[
                styles.container,
                { backgroundColor: primaryColor, borderColor: secondaryColor }
            ]}
        >
            <Typography
                style={[styles.titleStyle, { color: secondaryColor }]}
                variant={TypographyVariants.caption}
            >
                {title}
            </Typography>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'grey',
        borderColor: 'black',
        borderRadius: 7,
        borderWidth: 1,
        justifyContent: 'center',
        padding: 1
    },
    titleStyle: {
        marginHorizontal: 10
    }
});

export default StatusCapsule;
