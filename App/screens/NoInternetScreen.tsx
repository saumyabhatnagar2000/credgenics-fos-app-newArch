import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Typography, { TypographyVariants } from '../components/ui/Typography';

export default function NoInternetScreen() {
    return (
        <View style={styles.container}>
            <SvgXml xml={noInternetConnection} />
            <Typography variant={TypographyVariants.body3} style={styles.title}>
                No Internet Connection!
            </Typography>
        </View>
    );
}

const noInternetConnection = `<svg width="190" height="170" viewBox="0 0 190 170" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M111.198 144.723C111.198 153.668 103.946 160.92 95.0011 160.92C86.0551 160.92 78.8021 153.668 78.8021 144.723C78.8021 135.778 86.0551 128.526 95.0011 128.526C103.946 128.526 111.198 135.778 111.198 144.723Z" fill="#DEDEDE"/>
<path d="M95 112.943C103.979 112.943 112.193 116.397 118.479 122.091C122.441 125.68 128.432 125.336 131.968 121.296C135.563 117.185 135.299 110.771 131.28 107.107C121.585 98.2672 108.888 92.8972 95 92.8972C81.112 92.8972 68.415 98.2672 58.719 107.107C54.701 110.771 54.437 117.186 58.033 121.296C61.569 125.336 67.559 125.681 71.521 122.091C77.807 116.397 86.021 112.943 95 112.943Z" fill="#DEDEDE"/>
<path d="M95 77.93C112.62 77.93 128.72 84.782 140.979 96.045C144.98 99.722 151.045 99.494 154.639 95.388C158.232 91.281 157.958 84.89 153.965 81.201C138.271 66.704 117.61 57.884 95 57.884C72.39 57.884 51.729 66.704 36.035 81.202C32.042 84.89 31.768 91.281 35.361 95.388C38.955 99.495 45.02 99.722 49.021 96.045C61.28 84.782 77.38 77.93 95 77.93Z" fill="#DEDEDE"/>
<path d="M95.0001 42.7152C121.451 42.7152 145.602 53.0902 163.905 70.1122C167.836 73.7682 173.889 73.3912 177.438 69.3362C181.063 65.1932 180.7 58.7942 176.68 55.0652C154.969 34.9272 126.338 22.6702 95.0001 22.6702C63.6631 22.6702 35.0311 34.9272 13.3201 55.0652C9.29906 58.7942 8.93705 65.1932 12.5631 69.3362C16.1121 73.3912 22.1641 73.7682 26.0951 70.1122C44.3981 53.0902 68.5491 42.7152 95.0001 42.7152Z" fill="#DEDEDE"/>
<path d="M40.8711 153.281L158.789 10.2411C160.243 8.47807 162.851 8.22708 164.615 9.68108C166.378 11.1351 166.63 13.7431 165.176 15.5071L47.2591 158.546C45.8051 160.31 43.1961 160.561 41.4331 159.107C39.6691 157.653 39.4181 155.045 40.8711 153.281Z" fill="#E84B4B"/>
</svg>
`;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    link: {
        marginTop: 15,
        paddingVertical: 15
    },
    linkText: {
        color: '#2e78b7',
        fontSize: 14
    },
    title: {
        fontSize: 20,
        // fontWeight: 'bold',
        padding: 40,
        color: '#000'
    }
});
