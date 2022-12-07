import React, {useMemo} from 'react';
import {ToastAndroid} from 'react-native';
import {Dimensions, StyleSheet, View} from 'react-native';
import {FAB} from '@rneui/themed';
import {TouchableOpacity} from 'react-native-gesture-handler';

import Pdf from 'react-native-pdf';
import CustomAppBar from '../../components/common/AppBar';
import {useAuth} from '../../hooks/useAuth';
import {sendReceipt} from '../../services/communicationService';
import {handleDownloadFile} from '../../services/utils';
import {Icon} from '@rneui/base';
import {RFPercentage} from 'react-native-responsive-fontsize';
import RNPrint from 'react-native-print';
import {useNavigation} from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import useCommon from '../../hooks/useCommon';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 25,
  },
  fabStyle: {
    bottom: 10,
    position: 'absolute',
    right: 10,
  },
  pdf: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },

  row: {
    flexDirection: 'row',
  },
});

export default function ReceiptPDFScreen({route}: {route: any}) {
  const {url, extraData, base64} = route.params;
  const {authData} = useAuth();
  const {navigate} = useNavigation();
  const {isInternetAvailable} = useCommon();

  const source = {
    uri: url,
    cache: true,
  };

  const downloadFile = () => {
    if (base64) {
      //download in case of offline receipt
      let filePath =
        RNFetchBlob.fs.dirs.DownloadDir +
        `/CG_Collect_${Date.now()}_Offline_Receipt.pdf`;
      RNFetchBlob.fs
        .writeFile(filePath, base64, 'base64')
        .then(res => {
          ToastAndroid.show(
            'Receipt has been downloaded successfully',
            ToastAndroid.SHORT,
          );
        })
        .catch(e => {
          ToastAndroid.show('Some error occurred', ToastAndroid.SHORT);
        });
    } else if (url) {
      handleDownloadFile(url);
      ToastAndroid.show('Downloading...', ToastAndroid.SHORT);
    }
  };

  const handleSendReceipt = async () => {
    try {
      if (
        extraData &&
        extraData.type === 'TASK' &&
        extraData.loan_id &&
        extraData.visit_id
      ) {
        const response = await sendReceipt(
          extraData.loan_id,
          extraData.visit_id,
          extraData.visit_date,
          extraData.amount_recovered,
          extraData.short_collection_receipt_url,
          extraData.loan_data.allocation_month,
          extraData.loan_data.applicant_name,
          authData,
        );
        let message = '';
        if (response?.success) {
          message = response?.message ?? 'Receipt sent';
          ToastAndroid.show(message, ToastAndroid.SHORT);
        }
      } else {
        throw Error('insufficient data');
      }
    } catch (e) {}
  };

  const RightActionComponent = useMemo(() => {
    const PrintButton = (
      <TouchableOpacity onPress={() => RNPrint.print({filePath: url})}>
        <Icon
          name="print"
          type="ionicon"
          color="white"
          style={{marginHorizontal: RFPercentage(0.8)}}
        />
      </TouchableOpacity>
    );

    const DownloadButton = (
      <TouchableOpacity onPress={downloadFile}>
        <Icon
          name="ios-download"
          type="ionicon"
          color="white"
          style={{marginHorizontal: RFPercentage(0.8)}}
        />
      </TouchableOpacity>
    );

    return (
      <View style={styles.row}>
        {DownloadButton}
        {PrintButton}
      </View>
    );
  }, [url]);

  return (
    <>
      <CustomAppBar
        title={extraData?.type == 'TASK' ? 'Payment Receipt' : 'Notice'}
        filter={false}
        sort={false}
        calendar={false}
        search={false}
        backButton={true}
        add={false}
        notifications={false}
        onBackClicked={() => {
          navigate('FieldVisitScreen');
        }}
        rightActionComponent={RightActionComponent}
      />
      <View style={styles.container}>
        <Pdf source={source} style={styles.pdf} />
        {extraData.type === 'TASK' && isInternetAvailable ? (
          <FAB
            onPress={handleSendReceipt}
            color="#3E7BFA"
            style={styles.fabStyle}
            icon={{name: 'send', color: 'white'}}
          />
        ) : null}
      </View>
    </>
  );
}
