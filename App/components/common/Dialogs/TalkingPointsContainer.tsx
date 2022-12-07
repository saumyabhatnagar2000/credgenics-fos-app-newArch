import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../../ui/Typography';

export function TalkingPointsContainer({
    isVisible,
    setisVisible,
    content
}: {
    isVisible: boolean;
    setisVisible: React.Dispatch<React.SetStateAction<boolean>>;
    content?: string;
}) {
    const toggleOverlay = () => {
        setisVisible(!isVisible);
    };
    if (isVisible)
        return (
            <Pressable
                onPress={toggleOverlay}
                style={[
                    StyleSheet.absoluteFill,
                    { zIndex: 1, backgroundColor: '#3334' }
                ]}
            >
                <View style={styles.overlay}>
                    <View style={styles.triangularShape} />
                    <View style={styles.textContainer}>
                        <Typography
                            style={{ fontFamily: TypographyFontFamily.oblique }}
                            variant={TypographyVariants.body}
                        >
                            {content}
                        </Typography>
                    </View>
                </View>
            </Pressable>
        );
    else {
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    overlay: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderTopRightRadius: 0,
        elevation: 10,
        minHeight: 100,
        opacity: 1,
        padding: 10,
        position: 'absolute',
        right: '3%',
        top: '10%',
        width: '90%'
    },
    textContainer: {
        paddingLeft: RFPercentage(0.6)
    },
    triangularShape: {
        backgroundColor: 'transparent',
        borderBottomColor: 'white',
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderLeftWidth: 10,
        borderRightColor: 'transparent',
        borderRightWidth: 10,
        borderStyle: 'solid',
        height: 0,
        position: 'absolute',
        right: 0,
        top: -10,
        width: 0
    }
});
