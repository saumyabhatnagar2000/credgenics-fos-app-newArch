import {
    DrawerActions,
    useFocusEffect,
    useNavigation
} from '@react-navigation/native';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Icon } from '@rneui/base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BLUE_DARK, RED3 } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { getMissedTasks } from '../../services/callingService';
import Typography, { TypographyVariants } from '../ui/Typography';

export default function MissedTask() {
    const navigation = useNavigation();
    const { setIsRightDrawer, authData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    const openRightDrawer = () => {
        setIsRightDrawer(true);
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const getData = useCallback(() => {
        setLoading(true);
        setItems([]);
        (async () => {
            try {
                const apiResponse = await getMissedTasks(
                    '',
                    moment().subtract(1, 'day').format('YYYY-M-DD'),
                    authData
                );
                if (apiResponse?.data) {
                    setItems(apiResponse?.data?.output?.reminders ?? []);
                }
            } catch (e) {
                ToastAndroid.show(
                    'Error fetching missed tasks',
                    ToastAndroid.SHORT
                );
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useFocusEffect(getData);

    if (loading || items.length == 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Icon
                    name="md-warning"
                    type="ionicon"
                    color={RED3}
                    style={styles.iconStyle}
                />
                <Typography variant={TypographyVariants.body2}>
                    <Typography variant={TypographyVariants.body3}>
                        {items.length}
                    </Typography>
                    {'  '}
                    Missed PTP / Visit / Call
                </Typography>
            </View>
            <TouchableOpacity
                onPress={openRightDrawer}
                style={styles.clickContainer}
            >
                <Typography
                    style={styles.buttonText}
                    variant={TypographyVariants.body1}
                >
                    View
                </Typography>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonText: {
        color: 'white',
        margin: RFPercentage(0.8),
        marginHorizontal: RFPercentage(1.2)
    },
    clickContainer: {
        backgroundColor: BLUE_DARK,
        borderRadius: 3
    },
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 4,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: RFPercentage(2),
        marginVertical: RFPercentage(2),
        padding: RFPercentage(1.2),
        paddingHorizontal: RFPercentage(2)
    },
    iconStyle: {
        marginRight: RFPercentage(1)
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row'
    }
});
