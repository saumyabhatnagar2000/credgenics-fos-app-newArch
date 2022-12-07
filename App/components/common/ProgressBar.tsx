import React from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../../constants/Colors';
import Typography, { TypographyVariants } from '../ui/Typography';

export function ProgressBar({
    progress,
    total,
    title,
    showPercentage = false,
    titleRequired = true
}: {
    progress: number;
    total: number;
    title?: string;
    showPercentage?: boolean;
    titleRequired?: boolean;
}) {
    let width = Number(progress / total) * 100;
    if (width > 100) width = 100;

    return (
        <View style={styles.container}>
            {titleRequired &&
                (!showPercentage ? (
                    <Typography
                        style={styles.text}
                        variant={TypographyVariants.caption}
                    >
                        {`${progress} out of ${total} ${title ?? 'questions'}`}
                    </Typography>
                ) : (
                    <Typography
                        style={[styles.text]}
                        variant={TypographyVariants.caption}
                    >
                        {!isNaN(progress / total)
                            ? `${Math.round((progress / total) * 1000) / 10}%`
                            : '0%'}
                    </Typography>
                ))}
            <View style={styles.progressBar}>
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        styles.progress,
                        { width: `${width}%` }
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 50,
        justifyContent: 'center',
        paddingVertical: 15,
        width: '100%'
    },
    progress: {
        backgroundColor: Colors.common.blue,
        borderRadius: 5
    },
    progressBar: {
        backgroundColor: '#CED4E1',
        borderRadius: 5,
        height: 4,
        width: '80%'
    },
    text: {
        color: Colors.common.blue,
        marginBottom: 5
    }
});
