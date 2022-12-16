import React from 'react';
import { Modal, Portal } from 'react-native-paper';
import { ModalButtonType } from '../../../types';
import { StyleSheet, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { TypographyFontFamily } from '../ui/Typography';
import { Button } from '@rneui/base';

export const CustomModal = ({
  visible,
  data,
  HeaderComponent,
  dismissable
}: {
  visible: boolean;
  dismissable: boolean;
  data: Array<ModalButtonType>;
  HeaderComponent: React.FunctionComponent;
}) => {
  return (
    <Portal>
      <Modal visible={visible} dismissable={dismissable}>
        <View style={styles.containerStyle}>
          <HeaderComponent />
          <View style={styles.buttonContainer}>
            {data.map((item) => {
              return (
                <Button
                  title={item.buttonText}
                  onPress={item.buttonFunction}
                  titleStyle={item.buttonTextStyle}
                  buttonStyle={item.buttonStyle}
                />
              );
            })}
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: RFPercentage(0.5)
  },
  containerStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    height: '50%',
    justifyContent: 'space-evenly',
    paddingHorizontal: RFPercentage(2),
    width: '80%'
  },
  headerText: {
    fontFamily: TypographyFontFamily.medium,
    fontSize: RFPercentage(2.3),
    lineHeight: RFPercentage(3.5),
    textAlign: 'center'
  }
});
