import * as React from 'react';
import {TouchableOpacity} from 'react-native';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function NotificationIcon() {
  const navigation = useNavigation();

  const openDrawer = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, []);

  return (
    <TouchableOpacity onPress={openDrawer}>
      <FontAwesome5 name="bell" size={24} style={{marginRight: 25}} />
    </TouchableOpacity>
  );
}
