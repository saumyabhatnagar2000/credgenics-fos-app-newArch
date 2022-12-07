import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BLUE_DARK, LINEAR_GRADIENT } from '../../constants/Colors';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

const Day = ({
    index,
    selected,
    disabled,
    select,
    selectedStyle,
    selectedTextStyle,
    disabledStyle,
    dayStyle,
    dayTextStyle,
    disabledTextStyle,
    empty,
    displayedSelected
}: any) => {
    const selectThis = () => {
        if (!disabled) {
            select(index);
        }
    };
    const dayStyles = {
        ...styles.day,
        ...dayStyle
    };
    const dayTextStyles = {
        ...styles.dayText,
        ...dayTextStyle
    };
    const disabledStyles = {
        ...styles.disabled,
        ...disabledStyle
    };
    const disabledTextStyles = {
        ...styles.disabledText,
        ...disabledTextStyle
    };
    const selectedStyles = {
        ...styles.selected,
        ...selectedStyle
    };
    const selectedTextStyles = {
        ...styles.selectedText,
        ...selectedTextStyle
    };
    return (
        <TouchableOpacity
            key={'day-' + index}
            onPress={empty ? null : selectThis}
        >
            <View style={styles.day}>
                {selected ? (
                    <LinearGradient
                        style={{
                            paddingVertical: RFPercentage(1),
                            borderRadius: 5
                        }}
                        colors={LINEAR_GRADIENT}
                    >
                        <View>
                            <Text
                                style={{
                                    ...dayTextStyles,
                                    ...(selected && selectedTextStyles),
                                    ...(disabled && disabledTextStyles)
                                }}
                            >
                                {index}
                            </Text>
                        </View>
                    </LinearGradient>
                ) : displayedSelected ? (
                    <View
                        style={{
                            ...dayStyles,
                            ...(displayedSelected && styles.displayedDate)
                        }}
                    >
                        <Text
                            style={{
                                ...dayTextStyles,
                                ...(displayedSelected &&
                                    styles.displayedDateText)
                            }}
                        >
                            {index}
                        </Text>
                    </View>
                ) : (
                    <View
                        style={{
                            ...dayStyles,
                            ...(selected && selectedStyles),
                            ...(disabled && disabledStyles)
                        }}
                    >
                        <Text
                            style={{
                                ...dayTextStyles,
                                ...(selected && selectedTextStyles),
                                ...(disabled && disabledTextStyles)
                            }}
                        >
                            {index}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default Day;

const styles = StyleSheet.create({
    day: {
        height: height * 0.065,
        justifyContent: 'center',
        width: width * 0.09
    },
    dayText: {
        color: '#043E90',
        fontSize: 16,
        textAlign: 'center'
    },
    disabled: {},
    disabledText: {
        opacity: 0.3
    },
    displayedDate: {
        backgroundColor: '#fff',
        borderColor: BLUE_DARK,
        borderRadius: 5,
        borderWidth: 1,
        height: '80%'
    },
    displayedDateText: {
        color: BLUE_DARK
    },
    selected: {
        alignItems: 'center',
        backgroundColor: '#3b83f7',
        borderRadius: 8,
        height: '80%',
        justifyContent: 'center'
    },
    selectedText: {
        color: 'white'
    }
});
