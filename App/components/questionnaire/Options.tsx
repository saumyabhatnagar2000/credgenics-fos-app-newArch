import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, { TypographyVariants } from '../ui/Typography';

export function Options({
    options,
    answer,
    onAnswer,
    editable
}: {
    options: Array<string>;
    answer: string;
    onAnswer: Function;
    editable: boolean;
}) {
    interface customColors {
        [index: string]: {
            text: string;
            bg: string;
        };
    }

    const getColors = (title: string) => {
        const _title = title.toLowerCase();

        switch (_title) {
            case 'yes':
                return {
                    text: '#06C270',
                    bg: '#E3FFF1'
                };

            case 'no':
                return {
                    text: '#E53535',
                    bg: '#FFE5E5'
                };

            default:
                return {
                    text: '#FF8800',
                    bg: '#FFF8E5'
                };
        }
    };

    const Row = ({ title, index }: { title: string; index: number }) => {
        const isSelected = answer === title;
        const colors = getColors(title);

        const radioButtonBackgroundColor = isSelected ? colors.text : '#8F90A6';

        const bgColor = isSelected ? colors.bg : '#E4E4EB';

        return (
            <TouchableOpacity
                disabled={!editable}
                activeOpacity={editable ? 0.5 : 1}
                onPress={() => (editable ? onAnswer(title) : {})}
                style={styles.optionsRow}
            >
                <View
                    style={[
                        styles.rbstyle,
                        { borderColor: radioButtonBackgroundColor }
                    ]}
                >
                    {isSelected && (
                        <View
                            style={[
                                styles.selected,
                                { backgroundColor: radioButtonBackgroundColor }
                            ]}
                        />
                    )}
                </View>
                <View
                    style={[
                        styles.textContainer,
                        {
                            backgroundColor: bgColor,
                            borderColor: radioButtonBackgroundColor
                        }
                    ]}
                >
                    <Typography
                        style={[
                            styles.text,
                            {
                                color: radioButtonBackgroundColor
                            }
                        ]}
                        variant={TypographyVariants.caption1}
                    >
                        {title}
                    </Typography>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.optionsContainer}>
            {options?.map((item, idx) => {
                return <Row title={item} index={idx} />;
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    optionsContainer: {
        backgroundColor: '#fff',
        paddingLeft: RFPercentage(1)
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: RFPercentage(0.4),
        paddingVertical: RFPercentage(1)
    },
    rbstyle: {
        alignItems: 'center',
        borderColor: '#043E90',
        borderRadius: 110,
        borderWidth: 1,
        height: RFPercentage(2.2),
        justifyContent: 'center',
        marginRight: 15,
        width: RFPercentage(2.2)
    },
    selected: {
        backgroundColor: '#043E90',
        borderRadius: 55,
        height: RFPercentage(1.3),
        width: RFPercentage(1.3)
    },
    text: {
        color: '#8F90A6',
        fontSize: RFPercentage(1.3)
    },
    textContainer: {
        // minHeight: 10,
        minWidth: RFPercentage(6),
        padding: RFPercentage(1.4),
        paddingVertical: RFPercentage(0.4),
        borderWidth: 1,
        borderRadius: RFPercentage(2),
        justifyContent: 'center',
        alignItems: 'center'
    }
});
