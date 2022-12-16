import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@rneui/base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Modal, Portal } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { CallingModeTypes } from '../../../enums';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';

interface CallTypeListModalProps {
    visible: boolean;
    hide: Function;
    onTypeSelect: Function;
}

export default function CallTypeListModal({
    visible,
    hide,
    onTypeSelect
}: CallTypeListModalProps) {
    const CallingButtonTitles = {
        [CallingModeTypes.click_to_call]: 'Click to Call',
        [CallingModeTypes.manual]: 'Manual Call'
    };

    const hideModal = () => hide();

    const selectItem = (type: CallingModeTypes) => onTypeSelect(type);

    const Row = ({ item }: { item: CallingModeTypes }) => (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => selectItem(item)}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: RFPercentage(1)
            }}
        >
            <Icon
                name={'phone-alt'}
                type="font-awesome-5"
                size={RFPercentage(2)}
                color={'#06C270'}
                reverse
            />
            <Typography
                variant={TypographyVariants.title}
                style={styles.contact}
            >
                {CallingButtonTitles[item]}
            </Typography>
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
                    variant={TypographyVariants.subHeading}
                    style={styles.heading}
                >
                    Select call type
                </Typography>
                <View style={styles.separator} />
                {[CallingModeTypes.click_to_call, CallingModeTypes.manual]?.map(
                    (item) => (
                        <Row key={item} item={item} />
                    )
                )}
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    contact: {
        alignSelf: 'center',
        color: 'black',
        margin: 10
    },
    containerStyle: {
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'flex-start',
        paddingHorizontal: RFPercentage(2),
        paddingVertical: RFPercentage(1),
        width: '75%'
    },
    heading: {
        alignSelf: 'center',
        fontFamily: TypographyFontFamily.normal,
        margin: RFPercentage(1),
        paddingVertical: RFPercentage(0.4)
    },
    separator: {
        backgroundColor: '#e0e0e0',
        height: 1,
        width: '100%'
    }
});
