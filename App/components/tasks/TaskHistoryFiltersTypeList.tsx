import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, { TypographyVariants } from '../ui/Typography';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TaskHistoryFilterType } from '../../../enums';
import { useTaskHistoryFilter } from '../../hooks/useTaskHistoryFilter';

const TABS = [
    {
        label: TaskHistoryFilterType.submitted
    },
    {
        label: TaskHistoryFilterType.visit_purpose
    },
    {
        label: TaskHistoryFilterType.visit_creator
    },
    {
        label: TaskHistoryFilterType.recovery_done
    },
    {
        label: TaskHistoryFilterType.recovery_mode
    }
];

export function TaskHistoryFiltersTypeList() {
    const { activeFilterTab, setActiveFilterTab } = useTaskHistoryFilter();

    const getFilterName = (text: string) => {
        return text;
    };

    const onTabChange = (text: TaskHistoryFilterType) =>
        setActiveFilterTab(text);

    return (
        <FlatList
            data={TABS}
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
                                style={{
                                    color:
                                        activeFilterTab == filterName.item.label
                                            ? '#043E90'
                                            : '#909195'
                                }}
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
        backgroundColor: '#486DB640',
        height: 0.5,
        width: '100%'
    }
});
