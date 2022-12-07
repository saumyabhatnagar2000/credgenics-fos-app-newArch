import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import useCommon from '../../hooks/useCommon';

const OFFLINE_TEXT = 'You are Offline. Some functionalities may not work';
const ONLINE_TEXT = 'You are back Online.';
export default function OfflineBanner() {
    const { isInternetAvailable } = useCommon();
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        if (isInternetAvailable) {
            setTimeout(() => {
                setShowBanner(false);
            }, 3000);
        } else setShowBanner(true);
    }, [isInternetAvailable]);

    if (!showBanner) {
        return null;
    }
    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: isInternetAvailable ? 'green' : '#E4B63F'
                }
            ]}
        >
            <Text style={styles.text}>
                {isInternetAvailable ? ONLINE_TEXT : OFFLINE_TEXT}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E4B63F',
        alignItems: 'center',
        paddingVertical: RFPercentage(0.4)
    },
    text: {
        fontSize: RFPercentage(1.5),
        fontWeight: 'bold'
    }
});
