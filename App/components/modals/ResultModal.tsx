import * as React from 'react';
import {Button} from '@rneui/base';
import {StyleSheet, View} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import {ResultModalType} from '../../../types';
import {ErrorReminder} from '../../screens/portfolio/images/ErrorReminder';
import {VisitSuccessImage} from '../common/Icons/VisitSuccess';
import Typography, {TypographyVariants} from '../ui/Typography';
import {RFPercentage} from 'react-native-responsive-fontsize';
import useCommon from '../../hooks/useCommon';

export default function ResultModal({
  visible,
  message,
  buttonText,
  positive,
  extra,
  onDone,
  generateReceipt,
  showReceiptButton,
}: ResultModalType) {
  const {isInternetAvailable} = useCommon();
  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={false}
        contentContainerStyle={styles.containerStyle}>
        <View>
          {positive ? (
            <View
              style={{
                marginTop: RFPercentage(1),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <VisitSuccessImage />
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Typography
                style={{
                  color: '#F47458',
                  marginVertical: RFPercentage(3),
                }}
                variant={TypographyVariants.heading}>
                Error!!
              </Typography>
              <View style={{marginBottom: RFPercentage(8)}}>
                <ErrorReminder />
              </View>
            </View>
          )}
        </View>
        {message ? (
          <>
            {positive ? (
              <Typography
                variant={TypographyVariants.title1}
                style={styles.textStyle}>
                {message}
              </Typography>
            ) : null}
            {showReceiptButton && (
              <Typography
                style={{
                  marginBottom: RFPercentage(2),
                  textDecorationLine: 'underline',
                }}
                variant={TypographyVariants.body2}
                onPress={generateReceipt}>
                View Collection Receipt
              </Typography>
            )}
            {isInternetAvailable && extra}
            <Button
              containerStyle={{
                width: '100%',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
              onPress={() => onDone?.()}
              titleStyle={{
                fontFamily: 'AvenirLTProHeavy',
                fontSize: RFPercentage(2.2),
              }}
              buttonStyle={{
                backgroundColor: '#043E90',
                paddingVertical: RFPercentage(1.2),
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
              title={buttonText}
            />
          </>
        ) : null}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'space-evenly',
    width: '80%',
  },
  svgContainer: {
    // height: 300,
    // width: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#909195',
    marginBottom: RFPercentage(4),
  },
});
