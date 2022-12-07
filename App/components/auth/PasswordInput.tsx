import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Icon, Input} from '@rneui/base';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {BLUE_DARK, BLUE_LIGHT} from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

export default function PasswordInput({
  setText,
  placeholder,
  compRef,
  error,
  loading,
  iconSize,
}) {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <Input
      ref={compRef}
      inputContainerStyle={[
        styles.inputContainer,
        error && !loading && styles.errorStyle,
      ]}
      underlineColorAndroid="transparent"
      placeholder={placeholder}
      errorStyle={error && {display: 'none'}}
      secureTextEntry={hidePassword}
      style={{
        color: BLUE_LIGHT,
        fontSize: RFPercentage(2.2),
      }}
      leftIcon={
        <Icon
          name={hidePassword ? 'lock-outline' : 'lock-open-outline'}
          color={hidePassword ? BLUE_DARK : '#FF5C5C'}
          style={{paddingHorizontal: RFPercentage(0.8)}}
          type="material-community"
          size={RFPercentage(iconSize ? iconSize : 3)}
        />
      }
      rightIcon={
        <Icon
          name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
          color={BLUE_LIGHT}
          style={{paddingHorizontal: RFPercentage(0.8)}}
          type="material-community"
          onPress={() => {
            setHidePassword(!hidePassword);
          }}
          size={RFPercentage(3)}
        />
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
