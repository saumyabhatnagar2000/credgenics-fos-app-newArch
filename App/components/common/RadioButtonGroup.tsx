import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CheckBox } from '@rneui/base';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors from '../../constants/Colors';

export default function RadioButtonGroup({ buttons, checked, setChecked }) {
    return (
        <View style={styles.container}>
            {buttons.map((title: string) => (
                <CheckBox
                    key={title}
                    containerStyle={styles.checkboxContainer}
                    checked={title == checked}
                    title={title}
                    textStyle={styles.textStyle}
                    onPress={() => setChecked(title)}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checkedColor="#043E90"
                    uncheckedColor="#043E90"
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    checkboxContainer: {
        backgroundColor: Colors.table.grey,
        borderColor: Colors.table.grey,
        flex: 1
    },
    container: {
        alignItems: 'center',
        backgroundColor: Colors.table.grey,
        borderColor: Colors.common.blue,
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    textStyle: {
        color: Colors.common.blue,
        fontFamily: 'AvenirLTProMedium',
        fontSize: RFPercentage(1.6),
        fontWeight: 'normal'
    }
});
