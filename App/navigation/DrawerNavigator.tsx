import React, {useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import CustomDrawerMenu from '../components/CustomDrawerLayout';
import {Icon} from '@rneui/base';
import Profile from '../screens/Profile';
import {BLUE_LIGHT} from '../constants/Colors';
import {useAuth} from '../hooks/useAuth';
import {HistoryScreen} from '../screens/HistoryScreen';
import {HistoryScreenTabType} from '../../enums';
import useCommon from '../hooks/useCommon';
const Drawer = createDrawerNavigator();

const DrawerNavigator = ({navigation}) => {
  const {isInternetAvailable} = useCommon();

  useEffect(() => {
    if (!isInternetAvailable) {
      navigation?.navigate?.('FieldVisitScreen');
    }
  }, [isInternetAvailable]);
  const {isRightDrawer} = useAuth();

  return (
    <Drawer.Navigator
      drawerContentOptions={{
        labelStyle: {
          color: '#989898',
        },
      }}
      drawerStyle={{width: '82.5%'}}
      drawerPosition={isRightDrawer ? 'right' : 'left'}
      drawerType={isRightDrawer ? 'front' : 'back'}
      drawerContent={props => <CustomDrawerMenu {...props} />}>
      <Drawer.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{
          gestureEnabled: true,
          swipeEnabled: false,
          drawerLabel: 'Home',
          drawerIcon: ({size}) => (
            <Icon name="home" size={size} type="material" color={BLUE_LIGHT} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerLabel: 'Profile',
          drawerIcon: ({focused, size}) => (
            <Icon
              name="person-outline"
              size={size}
              type="material"
              color={BLUE_LIGHT}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="History"
        component={HistoryScreen}
        initialParams={{
          params: {initialRoute: HistoryScreenTabType.visits},
        }}
        options={{
          drawerLabel: 'History',
          drawerIcon: ({focused, size}) => (
            <Icon
              name="history"
              size={size}
              type="material"
              color={BLUE_LIGHT}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
