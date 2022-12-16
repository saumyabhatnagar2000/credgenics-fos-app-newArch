import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ErrorPlaceholder } from '../common/ErrorPlaceholder';
import { CheckBox } from '@rneui/base';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors, { BLUE_2, BLUE_DARK } from '../../constants/Colors';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TaskHistoryFilterType } from '../../../enums';
import RadioButtonIcon from '../common/Icons/RadioButton';
import { useTaskHistoryFilter } from '../../hooks/useTaskHistoryFilter';
import { TaskHistoryFiltersObject } from '../../contexts/TaskHistoryFilterContext';
import { TaskHistoryFiltersTypeList } from './TaskHistoryFiltersTypeList';

const showRadioButton = (activeFilterTab: string) => {
    return (
        activeFilterTab != TaskHistoryFilterType.submitted &&
        activeFilterTab != TaskHistoryFilterType.recovery_done
    );
};

export default function TaskHistoryFilters() {
    const {
        selectedTaskFilterData,
        checkBoxClicked,
        activeFilterTab,
        radioButtonClicked,
        clearAllFilters,
        setActiveType,
        setFilterActive
    } = useTaskHistoryFilter();

    const FilterRow = ({
        filter,
        checked,
        onCheckboxClicked
    }: {
        filter: string;
        checked: boolean;
        onCheckboxClicked: any;
    }) => {
        return (
            <TouchableOpacity
                style={styles.filterRowContainer}
                onPress={onCheckboxClicked}
                activeOpacity={0.7}
            >
                <View style={{ flex: 5 }}>
                    <Typography
                        variant={TypographyVariants.body2}
                        style={{
                            color: checked
                                ? Colors.filterRow.active
                                : Colors.filterRow.inactive,
                            fontSize: RFPercentage(1.7)
                        }}
                    >
                        {filter}
                    </Typography>
                </View>
                <View style={{ flex: 1 }}>
                    {showRadioButton(activeFilterTab) ? (
                        <CheckBox
                            uncheckedColor={Colors.common.uncheckedCheckBox}
                            checkedColor={BLUE_2}
                            size={RFPercentage(2.5)}
                            iconType="material"
                            checkedIcon="check-box"
                            uncheckedIcon="check-box-outline-blank"
                            checked={checked}
                            onPress={onCheckboxClicked}
                        />
                    ) : (
                        <CheckBox
                            center
                            size={RFPercentage(1.75)}
                            checkedIcon={<RadioButtonIcon />}
                            uncheckedIcon="circle-o"
                            checked={checked}
                            uncheckedColor={Colors.common.uncheckedCheckBox}
                            checkedColor={BLUE_DARK}
                            onPress={onCheckboxClicked}
                        />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <View style={styles.container}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}
                >
                    <View style={styles.filterNamesList}>
                        <TaskHistoryFiltersTypeList />
                    </View>
                    <View style={{ flexDirection: 'row', flex: 6 }}>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                flexGrow: 1
                            }}
                        >
                            <FlatList
                                data={
                                    TaskHistoryFiltersObject?.[
                                        activeFilterTab
                                    ] ?? []
                                }
                                ListEmptyComponent={
                                    <ErrorPlaceholder
                                        type="empty"
                                        message="No Filters found!"
                                    />
                                }
                                ItemSeparatorComponent={() => {
                                    return (
                                        <View style={styles.itemSeparator} />
                                    );
                                }}
                                renderItem={({ item }) => {
                                    let present =
                                        !!selectedTaskFilterData?.[
                                            activeFilterTab
                                        ]?.[item] ?? false;

                                    const onCheckboxClicked = () => {
                                        if (showRadioButton(activeFilterTab))
                                            checkBoxClicked(
                                                activeFilterTab,
                                                item
                                            );
                                        else
                                            radioButtonClicked(
                                                activeFilterTab,
                                                item
                                            );
                                    };

                                    return (
                                        <FilterRow
                                            filter={item}
                                            onCheckboxClicked={() =>
                                                onCheckboxClicked()
                                            }
                                            checked={!!present}
                                            setChecked={() =>
                                                onCheckboxClicked()
                                            }
                                        />
                                    );
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.clearButtonContainer}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                        setActiveType(null);
                        setFilterActive(false);
                    }}
                >
                    <Typography
                        variant={TypographyVariants.body3}
                        style={{
                            color: '#909195',
                            textAlign: 'center'
                        }}
                    >
                        Close
                    </Typography>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.clearAllButton}
                    onPress={() => clearAllFilters()}
                >
                    <Typography
                        variant={TypographyVariants.body3}
                        style={{
                            color: '#909195',
                            textAlign: 'center'
                        }}
                    >
                        Clear All
                    </Typography>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: BLUE_DARK
    },
    buttonTitle: {
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(1.2),
        paddingHorizontal: RFPercentage(0.5)
    },
    clearAllButton: {
        flex: 1,
        justifyContent: 'center',
        minWidth: '50%'
    },
    clearButtonContainer: {
        backgroundColor: '#F6F8FB',
        bottom: 0,
        elevation: 30,
        flexDirection: 'row',
        height: RFPercentage(5),
        position: 'absolute',
        width: '100%'
    },
    closeButton: {
        borderColor: '#00000010',
        borderRightWidth: 1,
        flex: 1,
        justifyContent: 'center',
        minWidth: '50%'
    },
    container: {
        backgroundColor: Colors.table.grey,
        flex: 1
    },
    filterNameContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: RFPercentage(2),
        marginVertical: RFPercentage(1.6)
    },
    filterNamesList: {
        backgroundColor: 'rgba(203, 203, 206, 0.1)',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingTop: RFPercentage(1.5)
    },
    filterRowContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: RFPercentage(0.25)
    },
    inputContainer: {
        backgroundColor: Colors.light.background,
        borderColor: Colors.light.background,
        borderRadius: 8,
        borderWidth: 1,
        height: RFPercentage(5),
        paddingHorizontal: RFPercentage(1),
        width: '100%'
    },
    inputOuterContainer: {
        flexDirection: 'row',
        marginRight: RFPercentage(0.5),
        width: '100%'
    },
    itemSeparator: {
        backgroundColor: '#486DB640',
        height: 0.5,
        width: '100%'
    },
    loanStatusTitle: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(1.3)
    },
    searchBarContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: RFPercentage(1)
    }
});
