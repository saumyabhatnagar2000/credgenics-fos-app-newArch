import * as React from 'react';
import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../components/ui/Typography';
import { Button } from '@rneui/base';
import Layout from '../constants/Layout';

const appIcon = require('../../assets/images/cg-collect-logo.png');

const PLAYSTORE_URL =
    'http://play.google.com/store/apps/details?id=com.credgenics.fos';

export default function UpdateAvailableScreen() {
    return (
        <View style={styles.container}>
            <View>
                <Image
                    resizeMode="contain"
                    style={{ height: 150, width: 150 }}
                    source={appIcon}
                />
            </View>

            <View>
                <Typography
                    variant={TypographyVariants.heading2}
                    style={styles.title}
                >
                    Update Available
                </Typography>
                <Typography
                    variant={TypographyVariants.body}
                    style={[styles.text]}
                >
                    We have released a new version of the app with the latest
                    features.
                </Typography>
            </View>
            <View style={{ width: Layout.window.width * 0.35 }}>
                <Button
                    color="#5278C7"
                    title="Update"
                    titleStyle={styles.buttonTitleStyle}
                    buttonStyle={{
                        borderRadius: 4,
                        backgroundColor: '#043E90'
                    }}
                    onPress={async () =>
                        (await Linking.canOpenURL(PLAYSTORE_URL)) &&
                        Linking.openURL(PLAYSTORE_URL)
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'space-evenly',
        paddingHorizontal: '15%',
        paddingVertical: '20%'
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    text: {
        color: '#000',
        padding: 8,
        textAlign: 'center',
        marginVertical: RFPercentage(2),
        lineHeight: 18,
        fontSize: 16
    },
    title: {
        textAlign: 'center'
    },
    buttonTitleStyle: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2)
    }
});
