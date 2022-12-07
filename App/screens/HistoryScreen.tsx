import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DepositHistoryScreen from './deposit/DepositHistoryScreen';
import CustomAppBar from '../components/common/AppBar';
import { TypographyFontFamily } from '../components/ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BLUE_DARK } from '../constants/Colors';
import TaskHistoryScreen from './history/TaskHistoryScreen';
import { useTaskHistoryFilter } from '../hooks/useTaskHistoryFilter';
import { HistoryScreenTabType } from '../../enums';

const Tab = createMaterialTopTabNavigator();
export const HistoryScreen = ({ route }: { route?: any }) => {
    const { filterActive } = useTaskHistoryFilter();
    const initialRoute = route?.params?.initialRoute;

    return (
        <View style={{ flex: 1, backgroundColor: '#F6F8Fb' }}>
            <CustomAppBar backButton title="History" />
            <Tab.Navigator
                initialRouteName={
                    initialRoute?.length > 0
                        ? initialRoute
                        : HistoryScreenTabType.visits
                }
                initialLayout={{ width: Dimensions.get('screen').width }}
                tabBarOptions={{
                    style: styles.tabBarOptions,
                    labelStyle: styles.tabLabel,
                    activeTintColor: BLUE_DARK,
                    inactiveTintColor: '#9B9B9F',
                    indicatorStyle: {
                        backgroundColor: BLUE_DARK,
                        borderRadius: 20
                    }
                }}
                swipeEnabled={!filterActive}
                backBehavior="history"
            >
                <Tab.Screen name="visits" component={TaskHistoryScreen} />
                <Tab.Screen name="deposits" component={DepositHistoryScreen} />
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    tabBarOptions: {
        alignSelf: 'center',
        backgroundColor: '#F6F8FB',
        elevation: 0,
        width: '50%'
    },
    tabLabel: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(1.5),
        textAlign: 'justify'
    }
});
