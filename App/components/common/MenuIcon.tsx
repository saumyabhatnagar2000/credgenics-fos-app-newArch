import * as React from 'react';
import {TouchableOpacity} from 'react-native';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {Icon} from '@rneui/base';

export default function MenuIcon() {
  const navigation = useNavigation();

  const openDrawer = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, []);

  return (
    <TouchableOpacity onPress={openDrawer}>
      <Icon type="feather" name="menu" size={24} style={{marginLeft: 25}} />
    </TouchableOpacity>
  );
}
