import * as React from 'react';
import { Button, Image, Linking, StyleSheet, Text, View } from 'react-native';
import Layout from '../constants/Layout';

const appIcon = require('../../assets/images/icon.png');

const PLAYSTORE_URL =
    'http://play.google.com/store/apps/details?id=com.credgenics.fos';

export default function UpdateAvailableScreen() {
    return (
        <View style={styles.container}>
            <View>
                <Image style={{ height: 128, width: 128 }} source={appIcon} />
                <Text style={styles.heading}>CG Collect </Text>
            </View>

            <View>
                <Text style={styles.title}>Update Available</Text>
                <Text style={[styles.text, { fontSize: 14 }]}>
                    We have released a new version of the app with the latest
                    features.
                </Text>
            </View>
            <View style={{ width: Layout.window.width * 0.28 }}>
                <Button
                    color="#5278C7"
                    title="Update"
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
        fontSize: 12,
        padding: 8,
        textAlign: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});
