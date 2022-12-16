import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@rneui/base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Modal, Portal } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { CallActionType } from '../../../types';
import { GREY_2 } from '../../constants/Colors';
import { NumberTypography } from '../ui/NumberTypography';
import Typography, { TypographyVariants } from '../ui/Typography';

export default function CallListModal({
    visible,
    setVisible,
    contactNumberList,
    onCall
}: CallActionType) {
    const hideModal = () => setVisible(false);

    const selectNumber = (number: string) => onCall(number);

    const Row = ({ item }: { item: string }) => (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => selectNumber(item)}
            style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                alignContent: 'center',
                marginVertical: 10
            }}
        >
            <Icon
                name={'phone-alt'}
                type="font-awesome-5"
                size={20}
                color={'#06C270'}
                reverse
            />
            <NumberTypography
                style={styles.contact}
                variant={TypographyVariants.body2}
                number={item}
            />
        </TouchableOpacity>
    );
    return (
        <Portal>
            <Modal
                visible={visible}
                dismissable={true}
                onDismiss={hideModal}
                contentContainerStyle={styles.containerStyle}
            >
                <Typography
                    variant={TypographyVariants.heading2}
                    style={{ textAlign: 'center' }}
                >
                    Contact Numbers
                </Typography>
                <View style={styles.separator} />

                {contactNumberList?.map((item) => (
                    <Row key={item} item={item?.trim()} />
                ))}
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    contact: {
        alignSelf: 'center',
        color: 'black',
        flex: 4,
        flexWrap: 'wrap',
        fontSize: RFPercentage(2.5),
        margin: RFPercentage(1.2),
        paddingVertical: 2
    },
    containerStyle: {
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        height: '50%',
        justifyContent: 'flex-start',
        padding: 20,
        width: '90%'
    },
    heading: {
        alignSelf: 'center',
        color: '#3E7BFA',
        flexWrap: 'wrap',
        fontFamily: 'poppins',
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: 'bold',
        margin: 10
    },
    separator: {
        backgroundColor: '#e0e0e0',
        height: 1,
        width: '100%'
    },
    noDataFound: {
        textAlign: 'center',
        paddingVertical: RFPercentage(0.5),
        color: GREY_2
    }
});
