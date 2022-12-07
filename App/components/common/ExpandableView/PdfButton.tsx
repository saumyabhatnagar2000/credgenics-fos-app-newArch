import React from 'react';

import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ViewIcon } from '../Icons/ViewIcon';
import Typography, { TypographyVariants } from '../../ui/Typography';
import { TaskStatusTypes } from '../../../../enums';

const Button_Deactive_Color = '#C7C9D9';

const getColor = (status: string) => {
    return status === TaskStatusTypes.cancelled
        ? Button_Deactive_Color
        : '#043E90';
};

const PdfButton = ({
    url,
    extraData,
    title = 'View'
}: {
    url: string;
    title?: string;
    extraData: any;
}) => {
    const { navigate } = useNavigation();

    const openPdf = () => {
        navigate('ReceiptPDFScreen', { url, extraData });
    };
    return (
        <TouchableOpacity
            disabled={extraData.visit_status == TaskStatusTypes.cancelled}
            onPress={openPdf}
            style={styles.rowContainer}
        >
            <ViewIcon color={getColor(extraData.visit_status)} />
            <Typography
                variant={TypographyVariants.body3}
                style={[
                    styles.leftMargin,
                    { color: getColor(extraData.visit_status) }
                ]}
            >
                {title}
            </Typography>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    leftMargin: {
        marginLeft: 5
    },
    rowContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 2
    }
});

export default PdfButton;
