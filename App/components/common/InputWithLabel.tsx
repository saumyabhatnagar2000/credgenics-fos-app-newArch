import React from 'react';
import { StyleSheet } from 'react-native';
import { Input } from '@rneui/base';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors, { BLUE_DARK } from '../../constants/Colors';
import { TypographyFontFamily } from '../ui/Typography';

export default function InputWithLabel({
    placeholder,
    label,
    value,
    compRef,
    error,
    loading,
    setText,
    ...props
}: {
    placeholder: string;
    label: string;
    value?: string;
    compRef?: React.RefObject<any>;
    error?: boolean;
    loading?: boolean;
    setText?: React.Dispatch<React.SetStateAction<String>>;
}) {
    return (
        <Input
            ref={compRef}
            inputContainerStyle={
                error && !loading ? styles.errorStyle : styles.inputContainer
            }
            label={label}
            placeholder={placeholder}
            labelStyle={styles.labelStyle}
            value={value}
            onChangeText={(text) => {
                setText?.(text);
            }}
            keyboardType="default"
            inputStyle={[
                styles.inputStyle,
                props.multiline && { textAlignVertical: 'top' }
            ]}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    errorStyle: {
        backgroundColor: Colors.table.grey,
        borderColor: 'red',
        borderRadius: 8,
        borderWidth: 1
    },
    inputContainer: {
        backgroundColor: Colors.table.grey,
        borderColor: Colors.common.blue,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: RFPercentage(1)
    },
    inputStyle: {
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.8)
    },
    labelStyle: {
        color: BLUE_DARK,
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(1.6),
        fontWeight: 'normal',
        marginBottom: RFPercentage(0.4),
        marginLeft: RFPercentage(0.6)
    }
});
