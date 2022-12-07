import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Button, Icon} from '@rneui/base';
import {SortTaskTypes, SortValue} from '../../../enums';
import {BLUE_DARK} from '../../constants/Colors';
import Typography, {
  TypographyFontFamily,
  TypographyVariants,
} from '../ui/Typography';
import FilterIcon from '../common/Icons/FilterIcon';
import {useTaskHistoryFilter} from '../../hooks/useTaskHistoryFilter';
import {useMixpanel} from '../../contexts/MixpanelContext';
import {EventScreens, Events} from '../../constants/Events';
const BLUE = BLUE_DARK;

enum SortTaskTypeButtonTexts {
  created = 'Created',
  distance = 'Distance',
  visit_date = 'Visit Date',
  date_of_default = 'DPD',
  total_claim_amount = 'Amount',
  amount_recovered = 'Amount',
}

export enum FilterTaskTypesText {
  today = 'Today',
  tomorrow = 'Tomorrow',
  this_week = 'This Week',
  this_month = 'This Month',
  overall = 'Overall',
}

enum TaskSortAndFilterActiveType {
  sort_by = 'sort_by',
  filter = 'filter',
}

function FilterStateButton({type}: {type: SortTaskTypes}) {
  const {logEvent} = useMixpanel();
  const {taskSortType, setTaskSortType} = useTaskHistoryFilter();
  const selected = taskSortType.type === type;
  const value = taskSortType.value;

  const onClick = () => {
    if (!selected) {
      setTaskSortType({type, value: SortValue.ascending});
      logEvent(Events.sort_by, EventScreens.task_history_list, {
        type,
        value: SortValue.ascending,
      });
      return;
    }

    if (value == SortValue.ascending) {
      setTaskSortType({type, value: SortValue.descending});
      logEvent(Events.sort_by, EventScreens.task_history_list, {
        type,
        value: SortValue.descending,
      });
    } else if (value === SortValue.descending) {
      setTaskSortType({type, value: SortValue.ascending});
      logEvent(Events.sort_by, EventScreens.task_history_list, {
        type,
        value: SortValue.ascending,
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.sortTypeButton, selected && {backgroundColor: '#486DB6'}]}>
      <Typography
        variant={TypographyVariants.caption}
        style={[{fontSize: RFPercentage(1.5)}, selected && {color: 'white'}]}>
        {SortTaskTypeButtonTexts[type]}
      </Typography>

      {selected && (
        <Icon
          size={RFPercentage(2)}
          name={value === SortValue.ascending ? 'arrow-up' : 'arrow-down'}
          type="ionicon"
          color="white"
          style={{marginLeft: RFPercentage(0.2)}}
        />
      )}
    </TouchableOpacity>
  );
}

export default function TaskHistorySortAndFilter() {
  const {
    activeType,
    setActiveType,
    finalTaskHistoryFilterData,
    selectedTaskFilterData,
    clearAllFilters,
    setFilters,
    setFilterActive,
  } = useTaskHistoryFilter();
  let totalFilters = useMemo(() => {
    let count = 0;
    Object.values(finalTaskHistoryFilterData).map(filterData => {
      const len = Object.keys(filterData).filter(
        data => filterData[data],
      ).length;
      count += len;
    });
    return count;
  }, [finalTaskHistoryFilterData]);

  const filtersText = totalFilters > 0 ? `Filters(${totalFilters})` : `Filter`;

  const isFilterActive = activeType == TaskSortAndFilterActiveType.filter;
  const isSortActive = activeType == TaskSortAndFilterActiveType.sort_by;

  const onClick = (type: TaskSortAndFilterActiveType) => {
    if (isSortActive && type == TaskSortAndFilterActiveType.sort_by)
      setActiveType(null);
    else if (isFilterActive && type == TaskSortAndFilterActiveType.filter) {
      setActiveType(null);
      setFilterActive(false);
    } else {
      if (type == TaskSortAndFilterActiveType.filter) setFilterActive(true);
      setActiveType(type);
    }
  };

  const isClearAllActive = useMemo(() => {
    let res = false;
    Object.values(selectedTaskFilterData).forEach(val => {
      if (Object.keys(val).length > 0) res = true;
    });
    return res;
  }, [selectedTaskFilterData]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            {!isFilterActive && (
              <TouchableOpacity
                onPress={() => onClick(TaskSortAndFilterActiveType.sort_by)}
                style={
                  isSortActive
                    ? styles.sortByButton
                    : styles.sortByButtonDeactive
                }>
                <Icon
                  size={RFPercentage(2)}
                  name="swap-vertical"
                  type="ionicon"
                  color={BLUE}
                />
                <Typography
                  style={
                    isSortActive
                      ? styles.sortByButtonText
                      : styles.sortByButtonDeactiveText
                  }>
                  Sort By
                </Typography>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => onClick(TaskSortAndFilterActiveType.filter)}
              style={
                isFilterActive || totalFilters > 0
                  ? [
                      styles.sortByButton,
                      {
                        paddingHorizontal: RFPercentage(0.8),
                      },
                    ]
                  : styles.sortByButtonDeactive
              }>
              <FilterIcon color={BLUE} />
              <Typography
                style={
                  isFilterActive
                    ? styles.sortByButtonText
                    : styles.sortByButtonDeactiveText
                }>
                {filtersText}
              </Typography>
            </TouchableOpacity>
          </View>
          {isFilterActive ? (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 4,
              }}>
              <Button
                buttonStyle={[
                  styles.buttonContainer,
                  {
                    marginRight: RFPercentage(1),
                  },
                ]}
                title="Apply"
                titleStyle={styles.buttonTitle}
                onPress={() => setFilters()}
              />
            </View>
          ) : null}
        </View>
        {isSortActive && (
          <View style={styles.sortByRow}>
            <FilterStateButton type={SortTaskTypes.visit_date} />
            <FilterStateButton type={SortTaskTypes.amount_recovered} />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#043E90',
    padding: RFPercentage(0.6),
    paddingHorizontal: RFPercentage(1.1),
  },
  buttonTitle: {
    fontFamily: TypographyFontFamily.normal,
    fontSize: RFPercentage(1.5),
    paddingHorizontal: RFPercentage(0.3),
  },
  clearButtonContainer: {
    alignItems: 'center',
    backgroundColor: '#F6F8FB',
    bottom: 0,
    elevation: 30,
    flexDirection: 'row',
    height: RFPercentage(5),
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  container: {
    alignItems: 'flex-start',
    backgroundColor: '#F6F8FB',
    justifyContent: 'center',
    paddingVertical: RFPercentage(0.75),
  },
  deactiveButtonContainer: {
    backgroundColor: '#f6f8fb',
    marginRight: RFPercentage(0.5),
    padding: RFPercentage(0.7),
    paddingHorizontal: RFPercentage(1.2),
  },
  itemSeparator: {
    backgroundColor: '#00000010',
    height: RFPercentage(3),
    width: 1,
  },
  menuTitle: {
    color: BLUE_DARK,
    fontFamily: TypographyFontFamily.medium,
    fontSize: RFPercentage(2),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: RFPercentage(1),
    width: '100%',
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
    paddingHorizontal: RFPercentage(0.8),
    paddingVertical: RFPercentage(0.4),
  },
  sortByButtonDeactive: {
    alignItems: 'center',
    borderColor: '#033D8F',
    borderRadius: 4,
    borderWidth: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 5,
    margin: RFPercentage(0.5),
    paddingHorizontal: RFPercentage(0.8),
    paddingVertical: RFPercentage(0.4),
  },
  sortByButtonDeactiveText: {
    color: BLUE,
    fontFamily: TypographyFontFamily.medium,
    fontSize: RFPercentage(1.75),
    marginLeft: RFPercentage(0.4),
  },
  sortByButtonText: {
    fontFamily: TypographyFontFamily.medium,
    fontSize: RFPercentage(1.75),
    marginLeft: RFPercentage(0.4),
  },
  sortByRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: RFPercentage(1),
    width: '100%',
  },
  sortTypeButton: {
    alignItems: 'center',
    borderColor: '#033D8F33',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 5,
    margin: RFPercentage(0.4),
    padding: RFPercentage(0.5),
    paddingHorizontal: RFPercentage(1),
  },
});
