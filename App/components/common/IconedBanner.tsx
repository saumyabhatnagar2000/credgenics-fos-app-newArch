import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { LocationSvg, PhoneSvg } from '../IconSvg';
import { View } from '../Themed';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';

export default function IconedBanner({
    value,
    bgColor,
    type,
    onClickAddicon,
    onTextClick
}: {
    value: string;
    bgColor: string;
    type: string;
    onClickAddicon?: Function;
    onTextClick?: Function;
}) {
    return (
        <View
            style={StyleSheet.flatten([
                styles.container,
                { backgroundColor: 'transparent' }
            ])}
        >
            {type === 'location' ? (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}
                >
                    <TouchableOpacity
                        style={styles.locationContainer}
                        onPress={onTextClick}
                    >
                        <LocationSvg />
                        <Typography
                            variant={TypographyVariants.body1}
                            style={styles.value}
                        >
                            {value}
                        </Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            paddingHorizontal: RFPercentage(0.7)
                        }}
                        onPress={onClickAddicon}
                    >
                        <Typography
                            variant={TypographyVariants.body4}
                            style={{
                                fontSize: RFPercentage(1.5),
                                fontFamily: TypographyFontFamily.heavy
                            }}
                        >
                            Add/Change
                        </Typography>
                    </TouchableOpacity>
                </View>
            ) : type === 'phone' ? (
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}
                    onPress={onTextClick}
                >
                    <View style={styles.locationContainer}>
                        <PhoneSvg />
                        <Typography
                            variant={TypographyVariants.body1}
                            style={styles.value}
                        >
                            {'Call Customer'}
                        </Typography>
                    </View>
                    <View
                        style={{ paddingHorizontal: RFPercentage(0.7) }}
                        onPress={onClickAddicon}
                    >
                        <Typography
                            variant={TypographyVariants.body4}
                            style={{
                                fontSize: RFPercentage(1.5),
                                fontFamily: TypographyFontFamily.heavy
                            }}
                        >
                            Add/Call
                        </Typography>
                    </View>
                </TouchableOpacity>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5B8DEF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: RFPercentage(1.6),
        paddingVertical: RFPercentage(1.2)
    },
    locationContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 5,
        justifyContent: 'center'
    },
    value: {
        flex: 2,
        paddingLeft: '2.5%'
    }
});
