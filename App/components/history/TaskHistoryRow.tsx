import React, { useMemo } from 'react';
import { ToastAndroid } from 'react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { TaskRowType } from '../../../types';
import { BLUE_DARK, GREY } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { sendReceipt } from '../../services/communicationService';
import { StringCompare, getOnlyDate } from '../../services/utils';
import Sendimage from '../common/SendImage';
import Typography, { TypographyVariants } from '../ui/Typography';
import CurrencyTypography from '../ui/CurrencyTypography';
import {
    TaskScheduledByType,
    TaskStatusTypes,
    VisitPurposeType
} from '../../../enums';
import PdfButton from '../common/ExpandableView/PdfButton';
import { ViewIcon } from '../common/Icons/ViewIcon';
import { useNavigation } from '@react-navigation/native';

const Button_Deactive_Color = '#C7C9D9';

export default function TaskHistoryRow({ rowData }: TaskRowType): JSX.Element {
    const { authData } = useAuth();
    const { navigate } = useNavigation();

    const isButtonEnabled = useMemo(() => {
        if (rowData?.visit_status == TaskStatusTypes.cancelled) return false;

        return rowData?.collection_receipt_url ? true : false;
    }, [rowData]);

    const handleSendReceipt = async () => {
        try {
            const response = await sendReceipt(
                rowData.loan_id!,
                rowData.visit_id!,
                rowData.visit_date!,
                rowData.amount_recovered!,
                rowData.short_collection_receipt_url!,
                rowData.allocation_month!,
                rowData.applicant_name!,
                authData
            );
            let message = '';
            if (response?.success) {
                message = response?.message ?? 'Receipt sent';
                ToastAndroid.show(message, ToastAndroid.SHORT);
            }
        } catch (e) {}
    };

    const openPdfViewer = () => {
        navigate('ReceiptPDFScreen', {
            url: rowData.collection_receipt_url ?? '',
            extraData: {
                authData,
                type: 'TASK',
                visit_id: rowData.visit_id,
                loan_id: rowData.loan_id
            }
        });
    };

    return (
        <View style={styles.main}>
            <View style={styles.row}>
                <View style={[styles.left, { padding: 5 }]}>
                    <View>
                        <View style={styles.toprow}>
                            <View style={{ flex: 3 }}>
                                <Typography
                                    variant={TypographyVariants.title1}
                                    style={styles.heading}
                                >
                                    {rowData.applicant_name ?? 'NA'}
                                </Typography>
                                <Typography
                                    style={styles.textSecondary}
                                    variant={TypographyVariants.caption1}
                                >
                                    ID: {rowData.loan_id}
                                </Typography>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.right}>
                    <View style={[styles.optionsContainer]}>
                        {
                            <TouchableOpacity
                                onPress={openPdfViewer}
                                style={styles.center}
                                disabled={!isButtonEnabled}
                            >
                                <ViewIcon
                                    color={
                                        isButtonEnabled
                                            ? BLUE_DARK
                                            : Button_Deactive_Color
                                    }
                                    size="large"
                                />
                            </TouchableOpacity>
                        }
                        <TouchableOpacity
                            style={styles.sendButton}
                            disabled={!isButtonEnabled}
                            onPress={handleSendReceipt}
                        >
                            <Sendimage
                                color={
                                    isButtonEnabled
                                        ? BLUE_DARK
                                        : Button_Deactive_Color
                                }
                                size={18}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        {
                            <CurrencyTypography
                                style={[
                                    styles.amount,
                                    {
                                        color: rowData?.amount_recovered
                                            ? styles.amount.color
                                            : '#909195'
                                    }
                                ]}
                                variant={TypographyVariants.title1}
                                amount={rowData?.amount_recovered}
                            />
                        }
                    </View>
                </View>
            </View>
            <View
                style={[
                    styles.row,
                    {
                        marginLeft: RFPercentage(0.4),
                        justifyContent: 'flex-start'
                    }
                ]}
            >
                {StringCompare(
                    rowData?.visit_purpose,
                    VisitPurposeType.promise_to_pay
                ) && (
                    <>
                        <Typography variant={TypographyVariants.body4}>
                            PTP
                        </Typography>
                        <Typography
                            variant={TypographyVariants.caption3}
                            style={{ marginHorizontal: 6 }}
                        >
                            |
                        </Typography>
                    </>
                )}
                <Typography variant={TypographyVariants.body4}>
                    {rowData.scheduled_by == TaskScheduledByType.agent
                        ? 'Self Scheduled'
                        : 'Manager Scheduled'}
                    {'  '}|{'  '}
                    {getOnlyDate(rowData.visit_date)}
                </Typography>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    amount: {
        color: '#25AB22',
        textAlign: 'center'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    heading: {
        paddingVertical: 2
    },
    left: {
        flex: 5,
        justifyContent: 'center'
    },
    main: {
        backgroundColor: '#fff',
        borderRadius: RFPercentage(0.5),
        marginHorizontal: RFPercentage(1),
        marginVertical: RFPercentage(0.6),
        paddingHorizontal: RFPercentage(0.8),
        paddingVertical: RFPercentage(0.4)
    },
    optionsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 5
    },
    right: {
        alignItems: 'stretch',
        flex: 2,
        justifyContent: 'space-between'
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4
    },
    sendButton: {
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: RFPercentage(1)
    },
    textSecondary: {
        color: GREY,
        marginTop: RFPercentage(0.4)
    },
    toprow: {
        alignItems: 'flex-start',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 5
    }
});
