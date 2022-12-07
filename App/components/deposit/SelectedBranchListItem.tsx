import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BLUE_DARK } from '../../constants/Colors';
import { keyConverter } from '../../services/utils';
import Typography, { TypographyVariants } from '../ui/Typography';

export const SelectedBranchListItem = ({ dataDict }: { dataDict: any }) => {
    const [filteredData, setFilteredData] = useState({});
    useEffect(() => {
        let filterDetails = dataDict;
        setFilteredData(filterDetails);
    }, [dataDict]);

    const keyModifier = (key: string) => {
        return (
            <Typography variant={TypographyVariants.body3} style={styles.key}>
                {`${keyConverter(key)}`}
            </Typography>
        );
    };

    const valueModifier = (key: string, data?: any) => {
        return (
            <Typography variant={TypographyVariants.body2} style={styles.value}>
                {data ? data : '-'}
            </Typography>
        );
    };
    function Row({ data, itemKey: key }: { data: any; itemKey: any }) {
        return (
            <View key={key} style={styles.rowContainer}>
                {keyModifier(key)}
                {valueModifier(key, data)}
            </View>
        );
    }
    return (
        <View style={styles.row}>
            {Object.keys(filteredData).map((key) => (
                <Row key={key} itemKey={key} data={filteredData[key]} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    key: {
        color: BLUE_DARK,
        flex: 3,
        lineHeight: RFPercentage(2),
        padding: '1%',
        textTransform: 'capitalize'
    },
    row: {
        paddingHorizontal: RFPercentage(1),
        paddingVertical: RFPercentage(1)
    },
    rowContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    value: {
        color: BLUE_DARK,
        flex: 1.5,
        padding: '1%'
    }
});
