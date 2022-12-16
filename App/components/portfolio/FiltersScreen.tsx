import React, { useCallback, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    ToastAndroid,
    View
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { getFilterStatuses } from '../../services/portfolioService';
import { ErrorPlaceholder } from '../common/ErrorPlaceholder';
import { CheckBox } from '@rneui/base';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors, { BLUE_2, BLUE_DARK } from '../../constants/Colors';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAction } from '../../hooks/useAction';
import { Input } from '@rneui/base';
import { Icon } from '@rneui/base';
import { PortfolioFilterType } from '../../../enums';
import { useFocusEffect } from '@react-navigation/native';
import { FiltersTypeList } from './FiltersTypeList';
import { useMixpanel } from '../../contexts/MixpanelContext';
import { EventScreens, Events } from '../../constants/Events';

export function FiltersScreen({
    visible,
    setVisible,
    setFilters,
    resetFilters,
    selected,
    setSelected,
    nbfcFiltersSelected,
    setNBFCFiltersSelected,
    tagsFilterSelected,
    setTagsfilterSelected
}: {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setFilters: Function;
    resetFilters: Function;
    selected: any;
    setSelected: any;
    nbfcFiltersSelected: any;
    setNBFCFiltersSelected: any;
    tagsFilterSelected: any;
    setTagsfilterSelected: any;
}) {
    const {
        portfolioFilterType,
        setPortfolioFilterType,
        activeFilterType,
        setActiveFilterType
    } = useAction();
    const { authData, allocationMonth, companyType } = useAuth();
    const { logEvent } = useMixpanel();
    const [statuses, setStatuses] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    const [tab, setTab] = useState([
        {
            label: PortfolioFilterType.status,
            data: []
        },
        {
            label: PortfolioFilterType.nbfc,
            data: []
        },
        {
            label: PortfolioFilterType.tags,
            data: []
        }
    ]);

    useFocusEffect(
        useCallback(() => {
            getFilterList(activeFilterType);
        }, [allocationMonth])
    );

    const getFilterList = async (type?: string) => {
        setStatuses([]);
        setSearchData([]);
        setSearchText('');
        setLoading(true);

        try {
            const [statusApiResponse, nbfcApiResponse, tagsApiResponse] =
                await Promise.all([
                    getFilterStatuses(
                        allocationMonth,
                        companyType,
                        PortfolioFilterType.status,
                        authData
                    ),
                    getFilterStatuses(
                        allocationMonth,
                        companyType,
                        PortfolioFilterType.nbfc,
                        authData
                    ),
                    getFilterStatuses(
                        allocationMonth,
                        companyType,
                        PortfolioFilterType.tags,
                        authData
                    )
                ]);

            let statusTabData = [];
            let nbfcTabData = [];
            let tagsTabData = [];

            if (statusApiResponse?.data)
                statusTabData = statusApiResponse?.data?.output?.statuses;
            if (nbfcApiResponse?.data)
                nbfcTabData = nbfcApiResponse?.data?.output?.loan_nbfc_name;
            if (tagsApiResponse?.data)
                tagsTabData = tagsApiResponse?.data?.output?.tag_name;

            setTab([
                {
                    label: PortfolioFilterType.status,
                    data: statusTabData
                },
                {
                    label: PortfolioFilterType.nbfc,
                    data: nbfcTabData
                },
                {
                    label: PortfolioFilterType.tags,
                    data: tagsTabData
                }
            ]);

            switch (type) {
                case PortfolioFilterType.tags:
                    setActiveFilterType(PortfolioFilterType.tags);
                    setStatuses(tagsTabData);
                    setSearchData(tagsTabData);
                    break;
                case PortfolioFilterType.nbfc:
                    setActiveFilterType(PortfolioFilterType.nbfc);
                    setStatuses(nbfcTabData);
                    setSearchData(nbfcTabData);
                    break;
                default:
                    setActiveFilterType(PortfolioFilterType.status);
                    setStatuses(statusTabData);
                    setSearchData(statusTabData);
            }
        } catch (e: any) {
            ToastAndroid.show(
                e?.response?.data?.output ?? 'Some error occurred',
                ToastAndroid.SHORT
            );
        }

        setLoading(false);
    };

    const handleTabChange = (label: PortfolioFilterType) => {
        const data = tab.filter((a) => a.label == label)[0].data;
        setStatuses(data);
        setSearchData(data);
        setActiveFilterType(label);
    };

    const handleSearch = (text: string) => {
        const formattedQuery = text.toLowerCase();
        const filteredData = statuses.filter((status) => {
            if (activeFilterType == PortfolioFilterType.status)
                return String(status.text)
                    .toLowerCase()
                    .includes(formattedQuery);
            else if (activeFilterType == PortfolioFilterType.nbfc)
                return String(status.loan_nbfc_name)
                    .toLowerCase()
                    .includes(formattedQuery);
            else return String(status).toLowerCase().includes(formattedQuery);
        });
        setSearchData(filteredData);
        setSearchText(text);
    };

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
                            fontSize: RFPercentage(1.7),
                            textTransform: 'capitalize'
                        }}
                    >
                        {filter}
                    </Typography>
                </View>
                <View style={{ flex: 1 }}>
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
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <View style={styles.container}>
                <View>
                    <View
                        style={{
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end'
                        }}
                    />
                    <View style={styles.searchBarContainer}>
                        <Input
                            placeholder="Filter Search"
                            containerStyle={styles.inputOuterContainer}
                            inputContainerStyle={styles.inputContainer}
                            value={searchText}
                            onChangeText={(e) => handleSearch(e)}
                            inputStyle={{
                                fontFamily: TypographyFontFamily.normal,
                                fontSize: RFPercentage(1.8)
                            }}
                            leftIcon={
                                <Icon
                                    name="search-outline"
                                    type="ionicon"
                                    color={BLUE_DARK}
                                    size={RFPercentage(2)}
                                />
                            }
                        />
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}
                >
                    <View style={styles.filterNamesList}>
                        <FiltersTypeList
                            tabs={tab}
                            onTabChange={handleTabChange}
                            activeFilterType={activeFilterType}
                        />
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
                                data={searchData}
                                ListEmptyComponent={
                                    !loading ? (
                                        <ErrorPlaceholder
                                            type="empty"
                                            message="No Filters found!"
                                        />
                                    ) : null
                                }
                                ItemSeparatorComponent={() => (
                                    <View style={styles.itemSeparator} />
                                )}
                                refreshControl={
                                    <RefreshControl
                                        progressViewOffset={10}
                                        refreshing={loading}
                                        colors={[BLUE_DARK]}
                                        onRefresh={() =>
                                            getFilterList(activeFilterType)
                                        }
                                    />
                                }
                                renderItem={(status) => {
                                    let present: any =
                                        activeFilterType ==
                                        PortfolioFilterType.status
                                            ? selected[status.item.text]
                                            : activeFilterType ==
                                              PortfolioFilterType.nbfc
                                            ? nbfcFiltersSelected[status.item]
                                            : tagsFilterSelected[status.item];

                                    const onCheckboxClicked = () => {
                                        const type = activeFilterType;
                                        let value;
                                        let select;

                                        if (
                                            activeFilterType ==
                                            PortfolioFilterType.status
                                        ) {
                                            value = status.item.text;

                                            if (!present) {
                                                setSelected({
                                                    ...selected,
                                                    [status.item.text]: !present
                                                });
                                                select = true;
                                            } else {
                                                delete selected[
                                                    status.item.text
                                                ];
                                                setSelected({ ...selected });
                                                select = false;
                                            }
                                        } else if (
                                            activeFilterType ==
                                            PortfolioFilterType.nbfc
                                        ) {
                                            value = status.item;

                                            if (!present) {
                                                setNBFCFiltersSelected({
                                                    ...nbfcFiltersSelected,
                                                    [status.item]: !present
                                                });
                                                select = true;
                                            } else {
                                                delete nbfcFiltersSelected[
                                                    status.item
                                                ];
                                                setNBFCFiltersSelected({
                                                    ...nbfcFiltersSelected
                                                });
                                                select = false;
                                            }
                                        } else {
                                            value = status.item;

                                            if (!present) {
                                                setTagsfilterSelected({
                                                    ...tagsFilterSelected,
                                                    [status.item]: !present
                                                });
                                                select = true;
                                            } else {
                                                delete tagsFilterSelected[
                                                    status.item
                                                ];
                                                setTagsfilterSelected({
                                                    ...tagsFilterSelected
                                                });
                                                select = false;
                                            }
                                        }
                                        logEvent(
                                            Events.filter,
                                            EventScreens.portfolio_list,
                                            {
                                                type,
                                                value,
                                                select
                                            }
                                        );
                                    };

                                    const filterText =
                                        activeFilterType ==
                                        PortfolioFilterType.status
                                            ? status.item.text
                                            : activeFilterType ==
                                              PortfolioFilterType.nbfc
                                            ? status.item
                                            : status.item;

                                    return (
                                        <FilterRow
                                            key={`${activeFilterType}-${filterText}`}
                                            filter={filterText}
                                            onCheckboxClicked={
                                                onCheckboxClicked
                                            }
                                            checked={!!present}
                                            setChecked={
                                                activeFilterType ==
                                                PortfolioFilterType.status
                                                    ? setSelected
                                                    : activeFilterType ==
                                                      PortfolioFilterType.nbfc
                                                    ? setNBFCFiltersSelected
                                                    : setTagsfilterSelected
                                            }
                                        />
                                    );
                                }}
                            />
                        </View>
                    </View>
                </View>
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
        paddingHorizontal: 10
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
        backgroundColor: '#486DB6',
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
