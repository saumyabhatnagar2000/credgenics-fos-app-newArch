import React, { useEffect, useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ExpandableCardType } from '../../../../types';
import { ItemRow } from '../ExpandableView/ItemRow';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { formatDate } from '../../../services/utils';
import { ViewMore } from '../Icons/ViewMore';
import { ViewLess } from '../Icons/ViewLess';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../../ui/Typography';
import { BLUE_DARK, DARK_GREY } from '../../../constants/Colors';
import CurrencyTypography from '../../ui/CurrencyTypography';
import { useAuth } from '../../../hooks/useAuth';
import { CompanyType, ExpandableCardTypes } from '../../../../enums';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import PdfButton from '../ExpandableView/PdfButton';
import ExpandableAmountCard from './ExpandableAmountCard';

export default function ExpandableCard(config: ExpandableCardType) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [data, setData] = useState({});
    const [blueHeaderData, setBlueHeaderData] = useState({});
    const [headerData, setHeaderData] = useState({});
    const { navigate } = useNavigation();
    const { getMaskedNumber, getCurrencyString, companyType } = useAuth();
    //Added keys to be masked
    const maskableKeys: Array<String> = ['call_to'];
    const removeDuplicateKeys = (obj: object, keys: Array<string>) => {
        let dummyObj: any = {
            ...obj
        };
        keys.map((key) => {
            delete dummyObj[key];
        });
        return dummyObj;
    };
    useEffect(() => {
        if (config.dataList && Object?.keys(config?.dataList)?.length) {
            if (config.type === ExpandableCardTypes.visit) {
                setHeaderData(
                    (({ amount_recovered, visit_status }) => ({
                        amount_recovered,
                        visit_status
                    }))(config.dataList)
                );
                setBlueHeaderData(
                    (({ visit_date, visit_purpose }) => ({
                        visit_date,
                        visit_purpose
                    }))(config.dataList)
                );

                if (config?.dataList?.amount_recovered) {
                    setData(
                        removeDuplicateKeys(config?.dataList, [
                            'amount_recovered',
                            'visit_date',
                            'sub_disposition_1',
                            'sub_disposition_2'
                        ])
                    );
                } else
                    setData(
                        removeDuplicateKeys(config?.dataList, [
                            'amount_recovered',
                            'visit_date'
                        ])
                    );
            } else if (config.type == ExpandableCardTypes.transaction) {
                setHeaderData(
                    (({
                        final_status,
                        balance_claim_amount,
                        amount_recovered
                    }) => ({
                        balance_claim_amount,
                        amount_recovered,
                        final_status
                    }))(config.dataList?.defaults)
                );
            } else if (config.type == ExpandableCardTypes.digitalNotice) {
                setHeaderData(
                    (({ type_of_comm, notice_link }) => ({
                        type_of_comm,
                        notice_link
                    }))(config.dataList)
                );
            } else if (config.type == ExpandableCardTypes.speedPost) {
                setHeaderData(
                    ((
                        { s3_link },
                        {
                            speedpost_delivery_status,
                            speedpost_delivery_confirmed_on
                        }
                    ) => ({
                        s3_link,
                        speedpost_delivery_status,
                        speedpost_delivery_confirmed_on
                    }))(config.dataList, JSON.parse(config.dataList?.data))
                );
            } else {
                setHeaderData(
                    (({ call_to, call_status, call_disposition }, {}) => ({
                        call_to,
                        call_disposition,
                        call_status
                    }))(config.dataList, config.extraData)
                );

                setBlueHeaderData(
                    (({ call_type }) => ({
                        call_type
                    }))(config.dataList)
                );

                setData(
                    removeDuplicateKeys(config.dataList, [
                        'call_to',
                        'call_disposition',
                        'call_status'
                    ])
                );
            }
        }
    }, [config]);

    const toggleExpand = () => {
        if (Platform.OS == 'android') {
            LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
            );
            setIsExpanded(!isExpanded);
        }
    };

    const checkCardExpanded = () => {
        return companyType === CompanyType.credit_line && isExpanded;
    };

    const convertData = () => {
        if (data.length === 0) {
            return (
                <View style={styles.block}>
                    <Text>No Data Available</Text>
                </View>
            );
        }

        return (
            <View
                style={
                    config.type === 'visit'
                        ? styles.block
                        : styles.firstContentWrapper
                }
            >
                <View style={{ width: '100%' }}>
                    <ItemRow
                        extraData={{ ...config.extraData, ...config.dataList }}
                        dataDict={data}
                        type={config.type}
                    />
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {config.type === 'visit' && (
                    <>
                        <View style={styles.dateTimeWrapper}>
                            <Typography
                                variant={TypographyVariants.body2}
                                style={styles.headerText}
                            >
                                {formatDate(blueHeaderData?.visit_date)}
                            </Typography>
                            <Typography
                                variant={TypographyVariants.caption2}
                                style={styles.timeText}
                            >
                                {blueHeaderData.visit_date?.split(' ')[1]}
                            </Typography>
                        </View>
                        <Typography
                            variant={TypographyVariants.caption1}
                            style={styles.statusText}
                        >
                            {headerData?.visit_status}
                        </Typography>
                    </>
                )}
                {config.type == 'call' && (
                    <>
                        <View style={styles.dateTimeWrapper}>
                            <Typography
                                variant={TypographyVariants.body2}
                                style={styles.headerText}
                            >
                                {formatDate(data?.call_start_time)}
                            </Typography>
                        </View>
                    </>
                )}
                {config.type == 'transaction' && (
                    <>
                        <View style={styles.dateTimeWrapper}>
                            <Typography
                                variant={TypographyVariants.body2}
                                style={styles.headerText}
                            >
                                Transaction Id:{' '}
                                {config.dataList?.transaction_id ?? ''}
                            </Typography>
                        </View>
                        {/* TODO: Uncomment for more transaction Details */}
                        {/* <View style={styles.iconContainer}>
                            <SideChevron color="#fff" />
                        </View> */}
                    </>
                )}
                {config.type == ExpandableCardTypes.digitalNotice && (
                    <>
                        {config.dataList?.delivered_time && (
                            <View style={styles.dateTimeWrapper}>
                                <Typography
                                    variant={TypographyVariants.body2}
                                    style={styles.headerText}
                                >
                                    {formatDate(
                                        config?.dataList?.delivered_time
                                    ) ?? ''}
                                </Typography>
                            </View>
                        )}

                        <View style={styles.dateTimeWrapper}>
                            <Typography
                                variant={TypographyVariants.caption}
                                style={styles.headerText}
                            >
                                Type: {config?.dataList?.notice_type ?? '--'}
                            </Typography>
                        </View>
                    </>
                )}
                {config.type == ExpandableCardTypes.speedPost && (
                    <>
                        {config.dataList?.created && (
                            <View style={styles.dateTimeWrapper}>
                                <Typography
                                    variant={TypographyVariants.body2}
                                    style={styles.headerText}
                                >
                                    {moment(config?.dataList?.created).format(
                                        'DD MMMM,YYYY'
                                    ) ?? ''}
                                </Typography>
                            </View>
                        )}
                        <View style={styles.dateTimeWrapper}>
                            <Typography
                                variant={TypographyVariants.caption}
                                style={styles.headerText}
                            >
                                Type: {config?.dataList?.notice_type ?? '--'}
                            </Typography>
                        </View>
                    </>
                )}
            </View>

            <View style={styles.contentWrapper}>
                {config?.type === 'visit' && checkCardExpanded() ? (
                    <ExpandableAmountCard
                        headerLabel={'Total Amount'}
                        headerValue={config?.dataList?.amount_recovered}
                        dataList={data}
                        type={ExpandableCardTypes.visit}
                    />
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={toggleExpand}
                    >
                        <View style={styles.firstContentWrapper}>
                            {config.type === 'visit' && !checkCardExpanded() && (
                                <View style={styles.heading}>
                                    <Typography
                                        variant={TypographyVariants.body3}
                                        style={styles.totalAmountLabel}
                                    >
                                        {'Total Amount'}
                                    </Typography>
                                    <Typography
                                        variant={TypographyVariants.body3}
                                        style={[
                                            styles.separatorColon,
                                            { flex: 1 }
                                        ]}
                                    >
                                        {':'}
                                    </Typography>
                                    <CurrencyTypography
                                        amount={headerData?.amount_recovered}
                                        style={{
                                            flex: 10,
                                            paddingHorizontal: '1%'
                                        }}
                                        variant={TypographyVariants.body4}
                                    />
                                </View>
                            )}
                            {config.type == 'call' && (
                                <View style={styles.call}>
                                    {Object.keys(headerData).map((d, i) => (
                                        <View style={styles.callDiv} key={i}>
                                            <Typography
                                                variant={
                                                    TypographyVariants.body3
                                                }
                                                style={styles.callTextKey}
                                            >
                                                {d.split('_').join(' ')}
                                            </Typography>
                                            <Text style={styles.colon}>:</Text>

                                            {maskableKeys.includes(
                                                d.toLowerCase()
                                            ) ? (
                                                <Typography
                                                    variant={
                                                        TypographyVariants.body2
                                                    }
                                                    style={[
                                                        styles.callTextValue,
                                                        {
                                                            textTransform:
                                                                'none'
                                                        }
                                                    ]}
                                                >
                                                    {headerData[d] &&
                                                        headerData[d]
                                                            .split('_')
                                                            .join(' ')}
                                                </Typography>
                                            ) : (
                                                <Typography
                                                    variant={
                                                        TypographyVariants.body2
                                                    }
                                                    style={styles.callTextValue}
                                                >
                                                    {headerData[d]}
                                                </Typography>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            )}
                            {(config.type ===
                                ExpandableCardTypes.digitalNotice ||
                                config.type ==
                                    ExpandableCardTypes.speedPost) && (
                                <View style={styles.call}>
                                    {Object.keys(headerData).map((d, i) => (
                                        <View style={styles.callDiv} key={i}>
                                            <Typography
                                                variant={
                                                    TypographyVariants.body3
                                                }
                                                style={
                                                    styles.transactionTextKey
                                                }
                                            >
                                                {d.split('_').join(' ')}
                                            </Typography>
                                            <Text style={styles.colon}>:</Text>

                                            {d.includes('link') ? (
                                                <View
                                                    style={[
                                                        styles.rowContainer,
                                                        styles.value
                                                    ]}
                                                >
                                                    <PdfButton
                                                        extraData={{
                                                            type: config.type
                                                        }}
                                                        url={headerData[d]}
                                                    />
                                                </View>
                                            ) : (
                                                <Typography
                                                    variant={
                                                        TypographyVariants.body2
                                                    }
                                                    style={
                                                        styles.transactionTextValue
                                                    }
                                                >
                                                    {headerData[d]}
                                                </Typography>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            )}
                            {config.type == ExpandableCardTypes.transaction && (
                                <View style={styles.call}>
                                    {Object.keys(headerData).map((d, i) => (
                                        <View style={styles.callDiv} key={i}>
                                            <Typography
                                                variant={
                                                    TypographyVariants.body3
                                                }
                                                style={
                                                    styles.transactionTextKey
                                                }
                                            >
                                                {d.split('_').join(' ')}
                                            </Typography>
                                            <Text style={styles.colon}>:</Text>

                                            {
                                                <Typography
                                                    variant={
                                                        TypographyVariants.body2
                                                    }
                                                    style={
                                                        styles.transactionTextValue
                                                    }
                                                >
                                                    {d.includes('amount')
                                                        ? getCurrencyString(
                                                              headerData[d]
                                                          )
                                                        : headerData[d]}
                                                </Typography>
                                            }
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                {isExpanded && convertData()}
                {config?.type != ExpandableCardTypes.transaction &&
                    config?.type != ExpandableCardTypes.digitalNotice &&
                    config.type != ExpandableCardTypes.speedPost && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={toggleExpand}
                        >
                            <View style={styles.collapsibleWrapper}>
                                <Text style={styles.collapsibleText}>
                                    {isExpanded ? 'Less' : 'More'}
                                </Text>
                                {isExpanded ? <ViewLess /> : <ViewMore />}
                            </View>
                        </TouchableOpacity>
                    )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    amountText: {
        color: BLUE_DARK,
        fontSize: RFPercentage(2.1)
    },
    block: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: RFPercentage(1),
        paddingHorizontal: RFPercentage(2.6)
    },
    call: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        width: '100%'
    },
    callDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: RFPercentage(0.2)
    },
    callTextKey: {
        color: DARK_GREY,
        flex: 12,
        padding: '1%',
        textTransform: 'capitalize'
    },
    callTextValue: {
        color: DARK_GREY,
        flex: 10,
        padding: '1%',
        textTransform: 'capitalize'
    },
    collapsibleText: {
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.5)
    },
    collapsibleWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: RFPercentage(1)
    },
    colon: {
        flex: 1,
        paddingHorizontal: RFPercentage(1)
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        elevation: 2,
        marginHorizontal: '4%',
        marginVertical: '2%'
    },
    contentWrapper: {
        paddingBottom: RFPercentage(1)
    },
    dateTimeWrapper: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    firstContentWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: RFPercentage(2.6),
        paddingTop: RFPercentage(2)
    },
    header: {
        alignItems: 'center',
        backgroundColor: '#4366AD',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: RFPercentage(2),
        paddingVertical: RFPercentage(1.1)
    },
    headerText: {
        color: '#fff'
    },
    heading: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    iconContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    rightView: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start'
    },
    rowContainer: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    separatorColon: {
        color: BLUE_DARK,
        paddingHorizontal: RFPercentage(1)
    },
    statusText: {
        color: '#fff',
        justifyContent: 'flex-end',
        paddingLeft: 5
    },
    timeText: {
        color: '#fff',
        paddingLeft: 5
    },
    totalAmountLabel: {
        color: BLUE_DARK,
        flex: 12,
        paddingHorizontal: '1%'
    },
    transactionTextKey: {
        color: DARK_GREY,
        flex: 12,
        fontSize: RFPercentage(1.7),
        textTransform: 'capitalize'
    },
    transactionTextValue: {
        color: DARK_GREY,
        flex: 10,
        fontSize: RFPercentage(1.7),
        padding: '1%',
        textTransform: 'capitalize'
    },
    typeText: {
        color: '#fff',
        paddingRight: 15,
        textTransform: 'capitalize'
    },
    value: {
        color: DARK_GREY,
        flex: 10,
        padding: '1%'
    }
});
