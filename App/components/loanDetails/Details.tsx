import React, { useEffect, useState } from 'react';
import ExpandableView from '../common/ExpandableView/ExpandableView';
import { StyleSheet, View } from 'react-native';
import { TableRow } from '../common/ExpandableView/TableRow';
import Typography, { TypographyVariants } from '../ui/Typography';
import { flattenObj } from '../../services/utils';

export const Details = ({ loanDetails }: { loanDetails: any }) => {
    const [stringType, setStringType] = useState({});
    const [arrayType, setArrayType] = useState({});
    const [objectType, setObjectType] = useState({});

    const getUpdatedKeys = () => {
        let stringObj: any = {};
        let arrayObj: any = {};
        let objectObj: any = {};
        Object.keys(loanDetails).map((loan) => {
            if (
                typeof loanDetails[loan] === 'string' ||
                typeof loanDetails[loan] === 'number' ||
                loanDetails[loan] === null
            ) {
                stringObj[loan] = loanDetails[loan];
            } else if (Array.isArray(loanDetails[loan])) {
                arrayObj[loan] = loanDetails[loan];
            } else if (
                typeof loanDetails[loan] === 'object' &&
                !Array.isArray(loanDetails[loan])
            ) {
                objectObj[loan] = loanDetails[loan];
            }
        });
        setStringType({ ...stringObj });
        setArrayType({ ...arrayObj });
        setObjectType({ ...objectObj });
    };

    useEffect(() => {
        if (loanDetails && Object.keys(loanDetails).length) {
            getUpdatedKeys();
        }
    }, [loanDetails]);

    if (!Object.keys(loanDetails).length) {
        return (
            <View style={styles.container}>
                <Typography
                    variant={TypographyVariants.body}
                    style={{ padding: 20, textAlign: 'center' }}
                >
                    No Data found
                </Typography>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {Object.keys(stringType)?.length ? (
                <View style={{ padding: 10 }}>
                    <TableRow dataDict={stringType} color={true} />
                </View>
            ) : null}

            {Object.keys(arrayType)?.map((value) =>
                arrayType[value]?.map((val, i) => (
                    <ExpandableView
                        name={`${value.split('_').join(' ')} ${i + 1}`}
                        dataList={flattenObj(val) || {}}
                        hasChevron={false}
                        styles={styles.expandableViewStyle}
                        type="table"
                    />
                ))
            )}

            {Object.keys(objectType)?.map((value) => (
                <ExpandableView
                    name={`${value.split('_').join(' ')}`}
                    dataList={flattenObj(objectType[value]) || {}}
                    hasChevron={false}
                    styles={styles.expandableViewStyle}
                    type="table"
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10
    },
    expandableViewStyle: {
        backgroundColor: '#fff',
        elevation: 1,
        shadowOpacity: 0.8,
        shadowRadius: 2
    }
});
