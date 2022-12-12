import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import Colors, { GREY_3 } from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { BottomTabParamList } from '../../types';
import PortfolioScreen from '../screens/portfolio/Portfolio';
import TaskScreen from '../screens/tasks/TaskScreen';
import DepositPendingScreen from '../screens/deposit/DepositPendingScreen';
import { PortfolioIcon } from '../components/common/Icons/Portfolio';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { ScheduledVisitIcon } from '../components/common/Icons/ScheduledVisit';
import { CollectionsIcon } from '../components/common/Icons/Collections';
import { TypographyFontFamily } from '../components/ui/Typography';
import HomeTab from '../screens/HomeTab';
import useCommon from '../hooks/useCommon';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
    const colorScheme = useColorScheme();
    const { isInternetAvailable } = useCommon();

    return (
        <BottomTab.Navigator
            initialRouteName="HomeTab"
            detachInactiveScreens
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: Colors[colorScheme].tabIconSelected,
                tabBarInactiveTintColor: GREY_3,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    flex: 1,
                    alignSelf: 'center',
                    marginTop: RFPercentage(0.5),
                    fontFamily: TypographyFontFamily.medium,
                    fontSize: RFPercentage(1.2),
                    textTransform: 'uppercase'
                },
                tabBarItemStyle: {
                    paddingTop: 15,
                    alignItems: 'center'
                },
                tabBarStyle: [
                    {
                        display: 'flex',
                        height: RFPercentage(7.5),
                        borderTopWidth: 0,
                        elevation: 0,
                        shadowOffset: {
                            width: 0,
                            height: 0
                        }
                    }
                ]
            }}
        >
            <BottomTab.Screen
                name="HomeTab"
                component={HomeTab}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="home" size={26} color={color} />
                    )
                }}
                listeners={{
                    tabPress: (e) => {
                        if (!isInternetAvailable) {
                            e.preventDefault();
                        }
                    }
                }}
            />
            <BottomTab.Screen
                name="PortfolioScreen"
                component={PortfolioScreen}
                options={{
                    tabBarLabel: 'Portfolio',
                    tabBarIcon: ({ color }) => <PortfolioIcon color={color} />
                }}
                listeners={{
                    tabPress: (e) => {
                        if (!isInternetAvailable) {
                            e.preventDefault();
                        }
                    }
                }}
            />
            <BottomTab.Screen
                name="FieldVisitScreen"
                component={TaskScreen}
                options={{
                    tabBarLabel: 'Scheduled Visit',
                    tabBarIcon: ({ color }) => (
                        <ScheduledVisitIcon color={color} />
                    )
                }}
            />
            <BottomTab.Screen
                name="DepositPendingScreen"
                component={DepositPendingScreen}
                options={{
                    tabBarLabel: 'Collections',
                    tabBarIcon: ({ color }) => <CollectionsIcon color={color} />
                }}
                listeners={{
                    tabPress: (e) => {
                        if (!isInternetAvailable) {
                            e.preventDefault();
                        }
                    }
                }}
            />
        </BottomTab.Navigator>
    );
}
