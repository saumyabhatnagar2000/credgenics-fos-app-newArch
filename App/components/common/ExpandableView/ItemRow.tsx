import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import { Icon } from '@rneui/base';
import { LocationType } from '../../../../types';
import { useAuth } from '../../../hooks/useAuth';
import { sendReceipt } from '../../../services/communicationService';
import {
    StringCompare,
    goToLocationOnMap,
    isStringLink,
    keyConverter
} from '../../../services/utils';
import PdfButton from './PdfButton';
import { SendIcon } from '../Icons/SendIcon';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, { TypographyVariants } from '../../ui/Typography';
import { DARK_GREY } from '../../../constants/Colors';
import CurrencyTypography from '../../ui/CurrencyTypography';
import { useNavigation } from '@react-navigation/native';
import { TaskStatusTypes } from '../../../../enums';
import { CalculatorIcon } from '../Icons/CalculatorIcon';
import { LATE_FEE_COMPANIES } from '../../../constants/CustomConfig';
import useLoanDetails from '../../../hooks/useLoanData';

const COLOR_BLUE = '#043E90';
const Button_Deactive_Color = '#C7C9D9';

const getPDFButtonColor = (status: string) => {
    return status === TaskStatusTypes.cancelled
        ? Button_Deactive_Color
        : '#043E90';
};

const getText = (str: string, type: string) => (
    <Typography
        variant={TypographyVariants.body2}
        style={type === 'visit' ? styles.value : styles.valueBlue}
    >
        {str}
    </Typography>
);

export const ItemRow = ({
    dataDict,
    extraData,
    type = 'visit'
}: {
    dataDict: any;
    extraData: any;
    type?: string;
}) => {
    const { authData, isFeedbackResponseNeeded, getCurrencyString } = useAuth();
    const { navigate } = useNavigation();
    const { selectedLoanData } = useLoanDetails();

    const [filteredData, setFilteredData] = useState({});

    useEffect(() => {
        let filterDetails = JSON.parse(JSON.stringify(dataDict));
        if (
            (filterDetails?.visit_status?.toLowerCase() ===
                TaskStatusTypes.open ||
                !isFeedbackResponseNeeded) &&
            (filterDetails?.feedback_response ||
                filterDetails?.feedback_response == null)
        )
            delete filterDetails?.feedback_response;

        if (filterDetails?.visit_status) delete filterDetails?.visit_status;

        setFilteredData(filterDetails);
    }, [dataDict]);

    const mapLink = (location: LocationType) => (
        <View style={[styles.rowContainer, styles.value]}>
            <TouchableOpacity
                onPress={() => goToLocationOnMap(location)}
                style={styles.rowContainer}
            >
                <Icon
                    color={styles.blue.color}
                    name="navigate-circle-outline"
                    type="ionicon"
                    size={RFPercentage(2)}
                />
                <Typography
                    variant={TypographyVariants.body3}
                    style={styles.leftMargin}
                >
                    Open Map
                </Typography>
            </TouchableOpacity>
        </View>
    );

    const SendButton = () => {
        try {
            if (
                extraData &&
                extraData.type === 'TASK' &&
                extraData.loan_id &&
                dataDict.id
            ) {
                const handleSendReceipt = async () => {
                    try {
                        const response = await sendReceipt(
                            extraData.loan_id,
                            dataDict.id,
                            extraData.visit_date ??
                                extraData.loan_data.visit_date,
                            extraData.amount_recovered,
                            extraData.short_collection_receipt_url,
                            extraData.loan_data.allocation_month,
                            extraData.loan_data.applicant_name,
                            authData!
                        );
                        let message = '';
                        if (response?.success) {
                            message = response?.message ?? 'Receipt sent';
                            ToastAndroid.show(message, ToastAndroid.SHORT);
                        }
                    } catch (e) {}
                };

                return (
                    <TouchableOpacity
                        disabled={
                            extraData.visit_status == TaskStatusTypes.cancelled
                        }
                        onPress={handleSendReceipt}
                        style={[
                            styles.rowContainer,
                            { marginLeft: RFPercentage(1) }
                        ]}
                    >
                        <SendIcon
                            color={getPDFButtonColor(extraData.visit_status)}
                        />
                        <Typography
                            variant={TypographyVariants.body3}
                            style={{
                                marginLeft: 3,
                                color: getPDFButtonColor(extraData.visit_status)
                            }}
                        >
                            Send
                        </Typography>
                    </TouchableOpacity>
                );
            } else {
                throw Error('insufficient data');
            }
        } catch (e) {}

        return null;
    };

    const keyModifier = (key: string) => {
        if (
            key == 'late_fee' &&
            LATE_FEE_COMPANIES.includes(authData?.company_id!)
        ) {
            return (
                <TouchableOpacity
                    style={styles.keyContainer}
                    onPress={extraData?.openSheet}
                >
                    <Typography
                        variant={TypographyVariants.body3}
                        style={{
                            marginRight: RFPercentage(1),
                            textDecorationLine: 'underline'
                        }}
                    >
                        {`${keyConverter(key)}`}
                    </Typography>
                    <CalculatorIcon />
                </TouchableOpacity>
            );
        }

        return (
            <Typography variant={TypographyVariants.body3} style={styles.key}>
                {`${keyConverter(key)}`}
            </Typography>
        );
    };

    const valueModifier = (key: string, data?: any) => {
        if (key === 'feedback_response' && type === 'visit') {
            return (
                <TouchableOpacity
                    style={type === 'visit' ? styles.value : styles.valueBlue}
                    onPress={() => {
                        const hasResponse = data?.length > 0;
                        const visitId = dataDict?.id;
                        const params = hasResponse
                            ? {
                                  responseId: data,
                                  loanData: extraData?.loan_data
                              }
                            : {
                                  visitId,
                                  loanData: extraData?.loan_data,
                                  allocation_month:
                                      selectedLoanData.allocation_month
                              };
                        navigate('QuestionnaireScreen', params);
                    }}
                >
                    <Typography variant={TypographyVariants.body2}>
                        {data ? 'View responses' : 'Fill feedback'}
                    </Typography>
                </TouchableOpacity>
            );
        }

        if (data) {
            if (typeof data === 'object') {
                try {
                    const locData = data as LocationType;
                    if (locData.latitude && locData.longitude) {
                        return mapLink(locData);
                    }
                } catch (e) {}
            } else if (key == 'call_type')
                return getText(data?.split('_').join(' ') ?? '', type);
            else {
                if (key.includes('amount')) {
                    return (
                        <CurrencyTypography
                            amount={data}
                            variant={TypographyVariants.body2}
                            style={
                                type === 'visit'
                                    ? styles.value
                                    : styles.valueBlue
                            }
                        />
                    );
                } else if (
                    key === 'call_start_time' ||
                    key === 'call_end_time'
                ) {
                    return getText(data.split(' ')[1], type);
                }

                try {
                    if (isStringLink(data) && key === 'collection_receipt') {
                        return (
                            <View style={[styles.rowContainer, styles.value]}>
                                <PdfButton
                                    extraData={{
                                        ...extraData,
                                        authData,
                                        visit_id: dataDict.id
                                    }}
                                    url={data}
                                />
                                <SendButton />
                            </View>
                        );
                    }
                } catch (e) {}

                if (typeof data === 'boolean') {
                    if (
                        key == 'is_customer_met' &&
                        StringCompare(
                            dataDict.visit_status,
                            TaskStatusTypes.open
                        )
                    ) {
                        return getText('-', type);
                    }

                    return getText(data ? 'Yes' : 'No', type);
                }

                return getText(data, type);
            }
        } else if (typeof data === 'boolean' && data === false) {
            if (
                key == 'is_customer_met' &&
                StringCompare(dataDict.visit_status, TaskStatusTypes.open)
            ) {
                return getText('-', type);
            }

            return getText('No', type);
        } else if ((!data || data === 0) && key.includes('amount'))
            return getText(getCurrencyString(0), type);
        else if (typeof data === 'number' && data === 0) {
            return getText('0', type);
        }
        return getText('-', type);
    };

    function Row({ data, itemKey: key }: { data: any; itemKey: any }) {
        return (
            <View key={key} style={styles.rowContainer}>
                {keyModifier(key)}
                <Text style={{ flex: 1, padding: RFPercentage(1) }}>:</Text>
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
    blue: {
        color: COLOR_BLUE,
        fontSize: RFPercentage(1.9)
    },
    key: {
        color: DARK_GREY,
        flex: 12,
        lineHeight: RFPercentage(2.75),
        padding: '1%',
        textTransform: 'capitalize'
    },
    keyContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 12,
        padding: '1%'
    },
    leftMargin: {
        marginLeft: 5
    },
    row: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    rowContainer: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    value: {
        color: DARK_GREY,
        flex: 10,
        padding: '1%'
    },
    valueBlue: {
        color: DARK_GREY,
        flex: 10,
        padding: '1%',
        textTransform: 'capitalize'
    }
});
