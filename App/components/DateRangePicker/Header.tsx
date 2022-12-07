import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

const Header = ({ index, dayHeaderTextStyle, dayHeaderStyle, day }: any) => {
    const dayHeaderStyles = {
        ...styles.dayHeader,
        ...dayHeaderStyle
    };
    const dayHeaderTextStyles = {
        ...styles.dayHeaderText,
        ...dayHeaderTextStyle
    };
    return (
        <View key={'headers-' + index} style={dayHeaderStyles}>
            <Text style={dayHeaderTextStyles}>{day}</Text>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    dayHeader: {
        height: height * 0.03,
        justifyContent: 'center',
        width: width * 0.09
    },
    dayHeaderText: {
        textAlign: 'center'
    }
});
