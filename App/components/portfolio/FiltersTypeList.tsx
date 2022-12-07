import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, { TypographyVariants } from '../ui/Typography';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PortfolioFilterType } from '../../../enums';
import { useAuth } from '../../hooks/useAuth';
import { CENTER_ID_COMPANIES } from '../../constants/CustomConfig';

export function FiltersTypeList({
    tabs,
    onTabChange,
    activeFilterType
}: {
    tabs: {
        label: PortfolioFilterType;
        data: any[];
    }[];
    onTabChange: (label: PortfolioFilterType) => void;
    activeFilterType: PortfolioFilterType;
}) {
    const { authData } = useAuth();

    const getFilterName = (text: string) => {
        if (
            text == PortfolioFilterType.tags &&
            CENTER_ID_COMPANIES.includes(authData?.company_id ?? '')
        ) {
            return 'Center';
        }
        return text;
    };

    return (
        <FlatList
            data={tabs}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            renderItem={(filterName) => {
                return (
                    <TouchableOpacity
                        onPress={() => onTabChange(filterName.item.label)}
                        style={styles.filterNameContainer}
                    >
                        <View>
                            <Typography
                                variant={TypographyVariants.body2}
                                style={
                                    activeFilterType == filterName.item.label
                                        ? {
                                              color: '#043E90'
                                          }
                                        : { color: '#909195' }
                                }
                            >
                                {getFilterName(filterName.item.label)}
                            </Typography>
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    filterNameContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: RFPercentage(2),
        marginVertical: RFPercentage(1.6)
    },
    itemSeparator: {
        backgroundColor: '#486DB6',
        height: 0.5,
        width: '100%'
    }
});
