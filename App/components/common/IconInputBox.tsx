import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon, Input} from '@rneui/base';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {IconInputType} from '../../../types';
import {BLUE_LIGHT} from '../../constants/Colors';

export default function IconInputBox({
  placeholder,
  value,
  icon,
  setText,
  compRef,
  error,
  loading,
  keyboardType,
  disabled,
  style,
  iconSize,
  inputContainerStyle = {},
  containerStyle = {},
}: IconInputType) {
  return (
    <Input
      containerStyle={[containerStyle]}
      ref={compRef}
      inputContainerStyle={[
        styles.inputContainer,
        error && !loading && styles.errorStyle,
        inputContainerStyle,
      ]}
      value={value}
      keyboardType={keyboardType}
      underlineColorAndroid="transparent"
      placeholder={placeholder}
      errorStyle={{display: 'none'}}
      disabled={disabled}
      style={[
        {
          color: BLUE_LIGHT,
          fontSize: RFPercentage(2.2),
        },
        style,
      ]}
      leftIcon={
        icon.component ?? (
          <Icon
            name={icon.iconName}
            color={icon.iconColor}
            style={{paddingHorizontal: RFPercentage(0.8)}}
            type={icon.iconType}
            size={RFPercentage(iconSize ? iconSize : 3)}
          />
        )
      }
      onChangeText={text => setText(text)}
    />
  );
}

const styles = StyleSheet.create({
  errorStyle: {
    borderColor: 'red',
  },
  inputContainer: {
    borderColor: BLUE_LIGHT,
    borderRadius: RFPercentage(0.8),
    borderWidth: 1,
    marginVertical: RFPercentage(1),
    paddingHorizontal: RFPercentage(1),
  },
});
