import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CheckBox } from '@rneui/base';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BLUE_DARK } from '../../../constants/Colors';
import { ItemRow } from './ItemRow';

export const SelectBankListItem = ({
    dataDict,
    selected = false,
    selector = false
}: {
    dataDict: any;
    selected?: boolean;
    selector?: boolean;
}) => {
    return (
        <View style={styles.row}>
            {selector && (
                <CheckBox
                    containerStyle={{
                        marginTop: RFPercentage(1.5),
                        padding: 0
                    }}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checkedColor={BLUE_DARK}
                    uncheckedColor={BLUE_DARK}
                    checked={selected}
                    size={25}
                />
            )}
            <View style={styles.content}>
                <ItemRow dataDict={dataDict} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingRight: RFPercentage(1),
        paddingVertical: RFPercentage(1)
    },
    row: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
});
