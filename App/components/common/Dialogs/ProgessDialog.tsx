import React from 'react';
import { Text, View } from 'react-native';
import { ActivityIndicator, Dialog, Portal } from 'react-native-paper';
import { BLUE_DARK } from '../../../constants/Colors';
import { TypographyFontFamily } from '../../ui/Typography';

export const ProgressDialog = ({
    title,
    visible
}: {
    title: string;
    visible: boolean;
}) => {
    return (
        <View>
            <Portal>
                <Dialog
                    style={{
                        width: 220,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        backgroundColor: '#F6F8FB'
                    }}
                    visible={visible}
                    dismissable={false}
                >
                    <Dialog.Content
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}
                    >
                        <ActivityIndicator animating color={BLUE_DARK} />
                        <View style={{ width: 20 }} />
                        <Text
                            style={{
                                color: BLUE_DARK,
                                fontFamily: TypographyFontFamily.medium
                            }}
                        >
                            {title}
                        </Text>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </View>
    );
};
