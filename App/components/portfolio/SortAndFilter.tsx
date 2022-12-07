import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Icon} from '@rneui/base';
import {useAction} from '../../hooks/useAction';
import {CompanyType, SortPortfolioTypes, SortValue} from '../../../enums';
import {ScrollView} from 'react-native-gesture-handler';
import {useAuth} from '../../hooks/useAuth';
import Typography, {
  TypographyFontFamily,
  TypographyVariants,
} from '../ui/Typography';
import {BLUE_DARK} from '../../constants/Colors';
import FilterIcon from '../common/Icons/FilterIcon';
import {Button} from '@rneui/base';
import {useMixpanel} from '../../contexts/MixpanelContext';
import {EventScreens, Events} from '../../constants/Events';

const BLUE = BLUE_DARK;

enum SortPortfolioTypeButtonTexts {
  created = 'Created',
  distance = 'Distance',
  date_of_default = 'DPD',
  total_claim_amount = 'Amount',
  remark = 'Remark',
  number_of_transactions = 'Transactions',
}

function FilterStateButton({type}: {type: SortPortfolioTypes}) {
  const {logEvent} = useMixpanel();
  const {portfolioSortType, setPortfolioSortType} = useAction();
  const selected = portfolioSortType.type === type;
  const value = portfolioSortType.value;

  const onClick = () => {
    if (!selected) {
      setPortfolioSortType({type, value: SortValue.ascending});
      logEvent(Events.sort_by, EventScreens.portfolio_list, {
        type,
        value: SortValue.ascending,
      });
      return;
    }

    if (value == SortValue.ascending) {
      setPortfolioSortType({type, value: SortValue.descending});
      logEvent(Events.sort_by, EventScreens.portfolio_list, {
        type,
        value: SortValue.descending,
      });
    } else if (value == SortValue.descending) {
      setPortfolioSortType({type, value: SortValue.ascending});
      logEvent(Events.sort_by, EventScreens.portfolio_list, {
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
        style={[selected && {color: 'white'}]}>
        {SortPortfolioTypeButtonTexts[type]}
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

export default function SortAndFilter({
  filtersVisible,
  setFiltersVisible,
  setFilters,
  resetFilters,
  clearAllActive,
}: {
  filtersVisible: boolean;
  setFiltersVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: Function;
  resetFilters: Function;
  clearAllActive: boolean;
}) {
  const {portfolioFilterType, portfolioNBFCType, portfolioTagsType} =
    useAction();
  const [sortOptionsVisible, setSortOptionsVisible] = useState(true);
  const [showMonthPicker, setShowMonthPicker] = React.useState(false);
  const [activeButton, setActiveButton] = React.useState(true);

  const onClick = () => {
    setSortOptionsVisible(!sortOptionsVisible);
    setActiveButton(true);
    setFiltersVisible(false);
  };
  const {companyType} = useAuth();

  let filterLength =
    Object.keys(portfolioFilterType).length +
    Object.keys(portfolioNBFCType).length +
    Object.keys(portfolioTagsType).length;

  const filtersText = filterLength > 0 ? `Filters(${filterLength})` : `Filter`;

  return (
    <>
      <View style={styles.container}>
        <View>
          <View style={styles.options}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={onClick}
                style={
                  activeButton
                    ? styles.sortByButton
                    : styles.sortByButtonDeactive
                }>
                <Icon
                  size={RFPercentage(2.2)}
                  name="swap-vertical"
                  type="ionicon"
                  color={activeButton ? BLUE : '#8899A8'}
                />
                <Typography
                  style={
                    activeButton
                      ? styles.sortByButtonText
                      : styles.sortByButtonDeactiveText
                  }>
                  Sort By
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFiltersVisible(!filtersVisible);
                  setActiveButton(false);
                  setSortOptionsVisible(false);
                }}
                style={
                  !activeButton
                    ? styles.sortByButton
                    : styles.sortByButtonDeactive
                }>
                <FilterIcon color={!activeButton ? BLUE : '#8899A8'} />
                <Typography
                  style={
                    !activeButton
                      ? styles.sortByButtonText
                      : styles.sortByButtonDeactiveText
                  }>
                  {filtersText}
                </Typography>
              </TouchableOpacity>
            </View>
            {filtersVisible ? (
              <View style={{flexDirection: 'row'}}>
                <Button
                  disabled={!clearAllActive}
                  disabledTitleStyle={{color: '#bbb'}}
                  buttonStyle={styles.deactiveButtonContainer}
                  title="Clear All"
                  titleStyle={[
                    styles.buttonTitle,
                    {
                      color: '#043E90',
                      textDecorationLine: 'underline',
                    },
                  ]}
                  onPress={() => {
                    resetFilters();
                  }}
                />
                <Button
                  buttonStyle={[
                    styles.buttonContainer,
                    {
                      marginRight: RFPercentage(1),
                    },
                  ]}
                  title="Apply"
                  titleStyle={styles.buttonTitle}
                  onPress={() => {
                    setFilters();
                  }}
                />
              </View>
            ) : null}
          </View>
        </View>
        {sortOptionsVisible && (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <FilterStateButton type={SortPortfolioTypes.created} />
            <FilterStateButton type={SortPortfolioTypes.date_of_default} />
            <FilterStateButton type={SortPortfolioTypes.total_claim_amount} />
            <FilterStateButton type={SortPortfolioTypes.distance} />
            {companyType == CompanyType.credit_line && (
              <FilterStateButton
                type={SortPortfolioTypes.number_of_transactions}
              />
            )}
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#043E90',
    padding: RFPercentage(0.7),
    paddingHorizontal: RFPercentage(1.2),
  },
  buttonTitle: {
    fontFamily: TypographyFontFamily.normal,
    fontSize: RFPercentage(1.6),
    paddingHorizontal: RFPercentage(0.3),
  },
  container: {
    alignContent: 'center',
    backgroundColor: '#F6F8FB',
    justifyContent: 'space-between',
    paddingVertical: RFPercentage(0.5),
  },
  deactiveButtonContainer: {
    backgroundColor: '#f6f8fb',
    marginRight: RFPercentage(0.5),
    padding: RFPercentage(0.7),
    paddingHorizontal: RFPercentage(1.2),
  },
  menuTitle: {
    color: BLUE_DARK,
    fontFamily: TypographyFontFamily.medium,
    fontSize: RFPercentage(2),
  },
  monthPickerContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginVertical: RFPercentage(1),
  },
  monthPickerView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 10,
  },
  monthText: {
    color: '#043E90',
    marginRight: 5,
  },
  options: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    padding: RFPercentage(0.6),
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
    padding: RFPercentage(0.6),
  },
  sortByButtonDeactiveText: {
    color: '#8899A8',
    fontFamily: TypographyFontFamily.medium,
    fontSize: RFPercentage(1.9),
    marginLeft: RFPercentage(0.4),
  },
  sortByButtonText: {
    fontFamily: TypographyFontFamily.medium,
    fontSize: RFPercentage(1.9),
    marginLeft: RFPercentage(0.4),
  },
  sortTypeButton: {
    alignItems: 'center',
    borderColor: '#033D8F33',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 5,
    margin: RFPercentage(0.5),
    padding: RFPercentage(0.7),
    paddingHorizontal: RFPercentage(1.2),
  },
});
