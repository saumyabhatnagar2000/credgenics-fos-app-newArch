import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

function UserProfileIcon({ background }: { background: string }) {
    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <Svg width="58" height="60" viewBox="0 0 58 67" fill="none">
                <Path
                    d="M46.2494 17.3435C46.2494 26.9218 38.4843 34.6869 28.906 34.6869C19.3276 34.6869 11.5625 26.9218 11.5625 17.3435C11.5625 7.76432 19.3276 0 28.906 0C38.4843 0 46.2494 7.76432 46.2494 17.3435Z"
                    fill="#486DB6"
                />
                <Path
                    d="M28.9051 36.7676C12.9491 36.7676 0 49.4864 0 66.8302H57.8122C57.8114 49.486 44.8619 36.7676 28.9051 36.7676Z"
                    fill="#486DB6"
                />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderRadius: 86,
        height: 116,
        justifyContent: 'center',
        width: 116
    }
});

export default UserProfileIcon;
