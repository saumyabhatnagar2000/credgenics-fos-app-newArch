import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NewTaskType } from '../../../../enums';
import { ErrorVisit } from '../images/ErrorVisit';
import { ErrorReminder } from '../images/ErrorReminder';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../../../components/ui/Typography';
import { StringCompare } from '../../../services/utils';
import { useNavigation } from '@react-navigation/native';

export const ErrorTask = ({
    message,
    onRetry,
    type
}: {
    message: string;
    onRetry: Function;
    type: string;
}) => {
    const { navigate } = useNavigation();
    const checkIfAlreadyOpen = useMemo(() => {
        return StringCompare(
            message,
            'Field Visit/PTP already open for this loan.'
        );
    }, [message]);
    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>ERROR!!</Text>
            {type === NewTaskType.field_visit ? (
                <ErrorVisit />
            ) : (
                <ErrorReminder />
            )}

            <Typography
                variant={TypographyVariants.body}
                style={styles.messageText}
            >
                {message}
            </Typography>
            <Typography
                variant={TypographyVariants.body}
                style={[styles.messageText, styles.retry]}
                onPress={() => {
                    checkIfAlreadyOpen
                        ? navigate('FieldVisitScreen')
                        : onRetry();
                }}
            >
                {checkIfAlreadyOpen ? 'Check from here' : 'Retry'}
            </Typography>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#F6F8FB',
        flex: 1,
        paddingTop: '40%'
    },
    errorText: {
        color: '#F47458',
        fontFamily: TypographyFontFamily.heavy,
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 36
    },
    messageText: {
        color: '#909195',
        paddingTop: 30
    },
    retry: {
        color: '#043E90',
        paddingTop: 5,
        textDecorationLine: 'underline'
    }
});
