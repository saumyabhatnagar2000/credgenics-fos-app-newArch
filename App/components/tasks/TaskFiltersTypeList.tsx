import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, { TypographyVariants } from '../ui/Typography';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TaskFilterType } from '../../../enums';
import { useTaskFilter } from '../../hooks/useTaskFilter';

const TABS = [
    {
        label: TaskFilterType.scheduled_date
    },
    {
        label: TaskFilterType.visit_purpose
    },
    {
        label: TaskFilterType.visit_creator
    }
];

export function TaskFiltersTypeList() {
    const { activeFilterTab, setActiveFilterTab } = useTaskFilter();

    const getFilterName = (text: string) => {
        return text;
    };

    const onTabChange = (text: TaskFilterType) => setActiveFilterTab(text);

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
