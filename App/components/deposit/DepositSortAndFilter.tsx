import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useAction } from '../../hooks/useAction';
import Colors, { BLUE_DARK } from '../../constants/Colors';
import Typography, { TypographyFontFamily } from '../ui/Typography';
import { Menu } from 'react-native-paper';
import { ChevronDown } from '../common/Icons/ChevronDown';
import { FilterDepositTypes } from '../../../enums';

const FILTERS = [
    FilterDepositTypes.today,
    FilterDepositTypes.this_week,
    FilterDepositTypes.this_month,
    FilterDepositTypes.overall
];

export default function DepositSortAndFilter() {
    const [filtersVisible, setFiltersVisible] = useState(false);
    const { depositFilterType, setDepositFilterType } = useAction();

    const filter = (type: FilterDepositTypes) => {
        setDepositFilterType(type);
        setFiltersVisible(false);
    };

    return (
        <View style={styles.container}>
            <Menu
                visible={filtersVisible}
                onDismiss={() => setFiltersVisible(!filtersVisible)}
                contentStyle={{
                    backgroundColor: Colors.table.grey
                }}
                anchor={
                    <TouchableOpacity
                        onPress={() => setFiltersVisible(!filtersVisible)}
                        style={styles.sortByButton}
                    >
                        <Typography
                            style={[
                                styles.sortByButtonText,
                                { marginRight: RFPercentage(0.5) }
                            ]}
                        >
                            {depositFilterType}
                        </Typography>
                        <ChevronDown />
                    </TouchableOpacity>
                }
            >
                {FILTERS.map((filterType) => (
                    <Menu.Item
                        key={filterType}
                        onPress={() => filter(filterType)}
                        titleStyle={styles.menuTitle}
                        title={filterType}
                    />
                ))}
            </Menu>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: RFPercentage(0.5)
    },
    menuTitle: {
        color: BLUE_DARK,
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2)
    },
    sortByButton: {
        alignItems: 'center',
        borderColor: '#033D8F',
        borderRadius: 4,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 5,
        margin: RFPercentage(0.5),
        padding: RFPercentage(0.8),
        paddingVertical: RFPercentage(0.5)
    },
    sortByButtonText: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2),
        marginLeft: RFPercentage(0.4)
    }
});
