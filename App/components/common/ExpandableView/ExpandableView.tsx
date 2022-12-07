import React, { useEffect, useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    ExpandableViewType,
    digitalNoticeHistoryType
} from '../../../../types';
import { ChevronDown } from '../Icons/ChevronDown';
import { ChevronUp } from '../Icons/ChevronUp';
import { SideChevron } from '../Icons/SideChevron';
import { ItemRow } from './ItemRow';
import { TableRow } from './TableRow';
import Typography, { TypographyVariants } from '../../ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import ExpandableCard from '../ExpandableCard/ExpandableCard';

export default function ExpandableView(config: ExpandableViewType) {
    const [isExpanded, setIsExpanded] = useState(false);
    useEffect(() => {
        if (config.expanded) {
            setIsExpanded(config.expanded);
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

    const convertData = () => {
        const data = config.dataList;
        let count = 0;
        let keygenerator = Math.random();
        if (data?.length == 0) {
            return (
                <View style={styles.block}>
                    <Typography variant={TypographyVariants.body1}>
                        No Data Available
                    </Typography>
                </View>
            );
        }

        if (config.type === 'table')
            return (
                <View style={styles.table}>
                    <TableRow dataDict={config?.dataList} color />
                </View>
            );

        if (config.showCards) {
            return config.dataList.map((history: digitalNoticeHistoryType) => {
                return (
                    <ExpandableCard
                        key={history.delivered_time}
                        dataList={history}
                        type={config.extraData}
                    />
                );
            });
        }

        return (
            <View style={styles.block}>
                {data.map((item: any) => {
                    count += 1;
                    keygenerator = Math.random();
                    return (
                        <View style={{ width: '94%' }} key={keygenerator}>
                            {count != 1 && (
                                <View
                                    style={styles.separator}
                                    key={keygenerator}
                                />
                            )}
                            <ItemRow
                                extraData={config.extraData}
                                key={count}
                                dataDict={item}
                                type="visit"
                            />
                        </View>
                    );
                })}
            </View>
        );
    };

    return (
        <View>
            {config.headerNotReq ? null : (
                <TouchableOpacity activeOpacity={0.8} onPress={toggleExpand}>
                    <View style={[styles.container, config.styles]}>
                        <Typography
                            variant={TypographyVariants.body3}
                            style={[
                                styles.title,
                                config.styles && { textTransform: 'capitalize' }
                            ]}
                        >
                            {config.name}
                        </Typography>
                        {config.hasChevron ? (
                            <View style={styles.iconContainer}>
                                <SideChevron />
                            </View>
                        ) : (
                            <View style={styles.iconContainer}>
                                {isExpanded ? <ChevronUp /> : <ChevronDown />}
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            )}
            {!config.hasChevron && isExpanded && convertData()}
        </View>
    );
}

const styles = StyleSheet.create({
    block: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginHorizontal: '2%',
        padding: '4%'
    },
    container: {
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F6FA',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '4%',
        marginTop: RFPercentage(1.4)
    },
    iconContainer: {
        paddingRight: 15
    },
    separator: {
        backgroundColor: '#e0e0e0',
        height: 2,
        marginBottom: 10,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 10,
        width: '95%'
    },
    table: {
        paddingHorizontal: 10
    },
    title: {
        flex: 1,
        padding: RFPercentage(2.2),
        textTransform: 'uppercase'
    }
});
