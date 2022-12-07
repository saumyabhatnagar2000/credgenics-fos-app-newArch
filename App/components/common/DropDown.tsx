import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet } from 'react-native';
import { ChevronDown } from './Icons/ChevronDown';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { TypographyFontFamily } from '../ui/Typography';

export const CustomDropDown = ({
    open,
    setOpen,
    items,
    values,
    setValues,
    setItems,
    placeholder,
    onChangeValue,
    containerStyle = {},
    dropDownContainerStyle = {},
    labelStyle = {},
    backgroundStyle = {},
    ...props
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    items: Array<Object>;
    values: string;
    setValues: React.Dispatch<React.SetStateAction<string>>;
    setItems: any;
    placeholder?: string;
    onChangeValue: any;
    containerStyle?: any;
    dropDownContainerStyle?: any;
    backgroundStyle?: any;
    labelStyle?: any;
    props?: object;
}) => {
    return (
        <DropDownPicker
            open={open}
            value={values}
            items={items}
            setOpen={setOpen}
            setValue={setValues}
            setItems={setItems}
            placeholder={placeholder}
            placeholderStyle={styles.placeHolderStyle}
            onChangeValue={onChangeValue}
            dropDownDirection="BOTTOM"
            itemSeparator={true}
            itemSeparatorStyle={styles.itemSeparator}
            containerStyle={[styles.containerStyle, containerStyle]}
            dropDownContainerStyle={[
                styles.dropDownContainer,
                dropDownContainerStyle
            ]}
            style={[styles.backgroundStyle, backgroundStyle]}
            closeAfterSelecting={true}
            listItemLabelStyle={styles.listItemLabel}
            showTickIcon={false}
            labelStyle={[styles.label, labelStyle]}
            ArrowDownIconComponent={() => <ChevronDown />}
            selectedItemContainerStyle={{
                backgroundColor: '#E5F0FF'
            }}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    backgroundStyle: {
        backgroundColor: '#F6F8FB',
        borderColor: '#043E90'
    },
    containerStyle: {
        paddingHorizontal: RFPercentage(1.5)
    },
    dropDownContainer: {
        backgroundColor: '#f6f8fb',
        borderColor: 'rgba(0,0,0,0.2)',
        marginHorizontal: RFPercentage(1.5)
    },
    itemSeparator: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        height: 0.8
    },
    label: {
        color: '#043E90',
        fontFamily: TypographyFontFamily.normal
    },
    listItemLabel: {
        alignSelf: 'center',
        color: '#043E90',
        fontFamily: TypographyFontFamily.normal
    },
    placeHolderStyle: {
        color: '#043E90',
        fontFamily: TypographyFontFamily.medium
    }
});
