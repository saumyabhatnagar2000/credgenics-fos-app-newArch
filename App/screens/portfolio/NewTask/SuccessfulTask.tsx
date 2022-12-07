import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    NewTaskType,
    TaskFilterType,
    TaskOptions,
    TaskTypes
} from '../../../../enums';
import { SuccessfulVisit } from '../images/SuccessfulVisit';
import { SuccessfulReminder } from '../images/SuccessfulReminder';
import Typography, {
    TypographyVariants
} from '../../../components/ui/Typography';
import { useTaskFilter } from '../../../hooks/useTaskFilter';
import { FilterTaskTypesText } from '../../../components/tasks/TaskSortAndFilter';
import { StringCompare } from '../../../services/utils';

export const SuccessfullTaskImage = ({
    message,
    type
}: {
    message: string;
    type: string;
}) => {
    const { navigate } = useNavigation();
    const { setFinalTaskFilterData } = useTaskFilter();
    const redirect = () => {
        if (StringCompare(type, TaskTypes.ptp)) {
            setFinalTaskFilterData({
                [TaskFilterType.visit_purpose]: {
                    [TaskOptions.ptp]: true
                },
                [TaskFilterType.scheduled_date]: {
                    [FilterTaskTypesText.today]: true
                }
            });
            navigate('FieldVisitScreen');
        } else {
            setFinalTaskFilterData({
                [TaskFilterType.visit_purpose]: {
                    [TaskOptions.surprise_visit]: true
                },
                [TaskFilterType.scheduled_date]: {
                    [FilterTaskTypesText.today]: true
                }
            });
            navigate('FieldVisitScreen');
        }
    };

    return (
        <View style={styles.container}>
            {type === NewTaskType.field_visit ? (
                <SuccessfulVisit />
            ) : (
                <SuccessfulReminder />
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
                onPress={redirect}
            >
                Check from here
            </Typography>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        paddingTop: '40%'
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
