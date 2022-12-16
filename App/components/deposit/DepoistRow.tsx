import React, { FC, useState } from 'react';
import { Text } from '../Themed';
import { Icon } from '@rneui/base';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { DepositHistoryItemType, DepositRowType } from '../../../types';
import { getOnlyDate } from '../../services/utils';
import DepositStatusCapsule from '../common/Capsules/DepositStatusCapsule';
import DepositsImages from '../common/DepositsIcon';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { DepositStatuses } from '../../../enums';
import Typography, { TypographyVariants } from '../ui/Typography';
import { BLUE_DARK, GREY } from '../../constants/Colors';
import CurrencyTypography from '../ui/CurrencyTypography';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ChevronDown } from '../common/Icons/ChevronDown';
import { ChevronUp } from '../common/Icons/ChevronUp';
import { loadDepostHistory } from '../../services/depositService';
import { useAuth } from '../../hooks/useAuth';
import moment from 'moment';

const CONNECTING_LINK_COLOR = '#043E9080';

const Item = ({ heading, value }: { heading: string; value: string }) => {
    return (
        <View style={styles.historyRow}>
            <Typography
                style={{
                    flex: 2,
                    marginRight: RFPercentage(2)
                }}
                variant={TypographyVariants.body3}
            >
                {heading ?? '-'}
            </Typography>
            {heading == 'Deposit Status' ? (
                <View style={{ flex: 3, alignItems: 'flex-start' }}>
                    <DepositStatusCapsule status={value as string} />
                </View>
            ) : (
                <Typography
                    style={{ flex: 3 }}
                    variant={TypographyVariants.body2}
                >
                    {value && value.length > 0 ? value : '-'}
                </Typography>
            )}
        </View>
    );
};

const DepositHistoryRowItem = ({
    isFirst,
    isLast,
    data
}: {
    isFirst: boolean;
    isLast: boolean;
    data: DepositHistoryItemType;
}) => {
    const RowData = {
        'Deposit Id': data.deposit_id,
        'Date-Time': moment(data.created).format('DD/MM/YYYY, h:mm a'),
        'Deposit Status': data.verification_status,
        'Verified By': data.verified_by,
        Remarks: data.verification_remark ?? '-'
    };

    return (
        <View style={styles.depositHistoryRowItemContainer}>
            <View style={styles.linksArea}>
                <View style={{ flex: 1 }}>
                    {isFirst || <View style={styles.verticalLink} />}
                </View>

                <View style={styles.row}>
                    <View style={{ flex: 1 }} />
                    <View style={styles.linkDot} />
                    <View style={styles.horizontalLink} />
                </View>
                <View style={{ flex: 1 }}>
                    {isLast || <View style={styles.verticalLink} />}
                </View>
            </View>
            <View style={styles.historyDataContainer}>
                {Object.keys(RowData).map((rowItemKey: string) => (
                    <Item
                        heading={rowItemKey}
                        key={rowItemKey}
                        value={RowData[rowItemKey]}
                    />
                ))}
            </View>
        </View>
    );
};

const DepositRow: FC<DepositRowType> = ({ data, onPress }): JSX.Element => {
    const { authData } = useAuth();

    const [showHistory, setShowHistory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const historyAvailable = !!data.linked_deposit_id;
    const historyColor = historyAvailable ? BLUE_DARK : '#C7C9D9';

    const getHistory = async (linked_deposit_id: string) => {
        if (historyAvailable) {
            if (history.length == 0) {
                setLoading(true);
                try {
                    const data = await loadDepostHistory(
                        linked_deposit_id,
                        authData
                    );
                    setHistory(data?.data ?? []);
                } catch (e) {
                    setHistory([]);
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    const onHistoryClick = () => {
        setShowHistory((h) => !h);
        if (data?.linked_deposit_id) getHistory(data.linked_deposit_id);
    };

    return (
        <View style={styles.containerStyle}>
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => onPress?.()}
                key={data.deposit_id}
                style={styles.main}
            >
                <View style={styles.container}>
                    <View style={styles.left}>
                        <View>
                            <View style={styles.row}>
                                <DepositsImages
                                    type={data.deposit_method}
                                    size={16}
                                />
                                <CurrencyTypography
                                    amount={data.total_amount}
                                    variant={TypographyVariants.title1}
                                    style={[
                                        styles.heading,
                                        {
                                            marginLeft: RFPercentage(1.2)
                                        }
                                    ]}
                                />
                            </View>
                            <View style={[styles.row, { marginVertical: 2 }]}>
                                <Typography
                                    style={styles.text}
                                    variant={TypographyVariants.caption1}
                                >
                                    ID: {data.deposit_id} |{' '}
                                    {getOnlyDate(data.created)}
                                </Typography>
                            </View>
                        </View>
                        <View
                            style={[
                                styles.row,
                                { paddingTop: 3, marginTop: 1 }
                            ]}
                        >
                            <View style={[styles.row, { marginRight: 25 }]}>
                                <Icon
                                    name="place"
                                    color="#909195"
                                    size={14}
                                    style={{ marginRight: RFPercentage(0.6) }}
                                    type="material"
                                />

                                <Typography
                                    variant={TypographyVariants.caption5}
                                >
                                    {data.branch_details?.branch_name ??
                                        data.branch_details?.bank_name ??
                                        data.branch_details?.account_name ??
                                        data.branch_id}
                                </Typography>
                            </View>
                        </View>
                    </View>
                    <View style={styles.right}>
                        <View style={styles.detailsContainer}>
                            <Typography
                                style={styles.detailsText}
                                variant={TypographyVariants.caption}
                            >
                                View Details
                            </Typography>

                            {data.verification_status ==
                            DepositStatuses.rejected ? (
                                <DepositStatusCapsule
                                    status={data.verification_status as string}
                                />
                            ) : (
                                <View style={styles.paymentContainer}>
                                    <Text style={[styles.depositMethod]}>
                                        {data.deposit_method}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.historyContainer}
                disabled={!historyAvailable}
                onPress={onHistoryClick}
            >
                <Typography
                    style={{ color: historyColor }}
                    variant={TypographyVariants.body4}
                >
                    History
                </Typography>
                {!showHistory ? (
                    <ChevronDown color={historyColor} height={8} width={8} />
                ) : (
                    <ChevronUp color={historyColor} height={8} width={8} />
                )}
            </TouchableOpacity>
            {showHistory && (
                <View style={styles.historyListContainer}>
                    {loading ? (
                        <ActivityIndicator color={BLUE_DARK} size="small" />
                    ) : (
                        history?.map(
                            (
                                historyItem: DepositHistoryItemType,
                                index: number
                            ) => (
                                <DepositHistoryRowItem
                                    data={historyItem}
                                    key={historyItem.deposit_id}
                                    isFirst={index == 0}
                                    isLast={index == history.length - 1}
                                />
                            )
                        )
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    containerStyle: {
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 4,
        marginHorizontal: RFPercentage(1),
        marginVertical: RFPercentage(0.6),
        overflow: 'hidden'
    },
    depositHistoryRowItemContainer: {
        borderRadius: 8,
        flexDirection: 'row'
    },
    depositMethod: {
        color: '#06C270',
        fontFamily: 'Avenir Next',
        fontSize: RFPercentage(1.5),
        marginHorizontal: 8,
        textTransform: 'capitalize'
    },
    detailsContainer: {
        alignItems: 'flex-end',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 5
    },
    detailsText: {
        marginBottom: 10
    },
    heading: {
        paddingVertical: 2
    },
    historyContainer: {
        alignItems: 'center',
        backgroundColor: '#D9D9D926',
        borderColor: '#0000001A',
        borderStyle: 'solid',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: RFPercentage(1.2),
        paddingHorizontal: RFPercentage(2)
    },
    historyDataContainer: {
        backgroundColor: 'white',
        borderColor: CONNECTING_LINK_COLOR,
        borderRadius: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        flex: 1,
        justifyContent: 'space-around',
        marginVertical: 4,
        paddingHorizontal: RFPercentage(1),
        padding: 4
    },
    historyListContainer: {
        backgroundColor: '#D9D9D926',
        paddingBottom: RFPercentage(1.2),
        paddingHorizontal: RFPercentage(2.2),
        paddingLeft: RFPercentage(0.4)
    },
    historyRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2,
        padding: 2
    },
    horizontalLink: {
        backgroundColor: CONNECTING_LINK_COLOR,
        flex: 1,
        height: 1
    },
    left: {
        flex: 1,
        justifyContent: 'center'
    },
    linkDot: {
        backgroundColor: BLUE_DARK,
        borderRadius: 10,
        height: RFPercentage(1.8),
        width: RFPercentage(1.8)
    },
    linksArea: {
        alignItems: 'center',
        width: '8%'
    },
    main: {
        alignItems: 'center',
        padding: RFPercentage(1.4),
        paddingHorizontal: RFPercentage(2)
    },
    paymentContainer: {
        alignItems: 'center',
        backgroundColor: '#E3FFF1',
        borderColor: '#A6E0C3',
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 1
    },
    right: {
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    text: {
        color: GREY,
        marginTop: RFPercentage(0.4)
    },
    verticalLink: {
        backgroundColor: CONNECTING_LINK_COLOR,
        flex: 1,
        width: 1
    }
});

export default DepositRow;
