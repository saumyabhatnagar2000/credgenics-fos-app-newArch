import React, { useEffect, useMemo, useState } from 'react';
import CustomAppBar from '../../components/common/AppBar';
import PortfolioHeaderDetails from '../../components/portfolio/PortfolioHeaderDetails';
import PortfolioList from '../../components/portfolio/PortfolioList';
import SortAndFilter from '../../components/portfolio/SortAndFilter';
import { EventScreens, Events } from '../../constants/Events';
import { ClockInNudgeInitPage } from '../../contexts/ClockInStatusContext';
import { useMixpanel } from '../../contexts/MixpanelContext';
import { useAction } from '../../hooks/useAction';
import { useClockIn } from '../../hooks/useClockIn';

export default function PortfolioScreen() {
    const { logEvent } = useMixpanel();
    const [filterScreenVisible, setFilterScreenVisible] = useState(false);
    const {
        portfolioFilterType,
        setPortfolioFilterType,
        activeFilterType,
        setPortfolioNBFCType,
        setPortfolioTagsType,
        portfolioNBFCType,
        portfolioTagsType
    } = useAction();

    const [filtersSelected, setFilterSelected] = useState(portfolioFilterType);
    const [nbfcFilterSelected, setNBFCfilterSelected] =
        useState(portfolioNBFCType);
    const [tagsFilterSelected, setTagsfilterSelected] =
        useState(portfolioTagsType);

    const { checkClockInNudge } = useClockIn();

    useEffect(() => {
        if (filterScreenVisible) {
            setFilterSelected(portfolioFilterType);
            setNBFCfilterSelected(portfolioNBFCType);
            setTagsfilterSelected(portfolioTagsType);
        }
    }, [
        filterScreenVisible,
        portfolioFilterType,
        portfolioNBFCType,
        portfolioTagsType
    ]);

    const setFilters = () => {
        logEvent(Events.filter, EventScreens.portfolio_list, {
            type: 'apply'
        });
        // Case when no filter selected
        if (Object.keys(filtersSelected).length == 0) {
            setPortfolioFilterType({});
        }
        if (Object.keys(nbfcFilterSelected).length == 0) {
            setPortfolioNBFCType({});
        }
        if (Object.keys(tagsFilterSelected).length == 0) {
            setPortfolioTagsType({});
        }
        if (Object.keys(filtersSelected).length > 0) {
            const filters = Object.keys(filtersSelected);

            // Mapping to the FilterType
            let dummyFilterOb: any = {};
            filters.forEach((filter) => {
                dummyFilterOb[filter] = true;
            });
            setPortfolioFilterType(dummyFilterOb);
        }
        if (Object.keys(nbfcFilterSelected).length > 0) {
            const filters = Object.keys(nbfcFilterSelected);
            // Mapping to the FilterType
            let dummyFilterOb: any = {};
            filters.forEach((filter) => {
                dummyFilterOb[filter] = true;
            });
            setPortfolioNBFCType(dummyFilterOb);
        }

        if (Object.keys(tagsFilterSelected).length > 0) {
            const filters = Object.keys(tagsFilterSelected);
            // Mapping to the FilterType
            let dummyFilterOb: any = {};
            filters.forEach((filter) => {
                dummyFilterOb[filter] = true;
            });
            setPortfolioTagsType(dummyFilterOb);
        }

        setFilterScreenVisible(!filterScreenVisible);
    };

    const resetFilters = () => {
        logEvent(Events.filter, EventScreens.portfolio_list, {
            type: 'reset'
        });
        setFilterSelected({});
        setNBFCfilterSelected({});
        setTagsfilterSelected({});
    };

    useEffect(() => {
        checkClockInNudge(ClockInNudgeInitPage.portfolio);
    }, []);

    const hasSelectedFilters = useMemo(() => {
        if (Object.keys(filtersSelected).length > 0) return true;
        if (Object.keys(nbfcFilterSelected).length > 0) return true;
        if (Object.keys(tagsFilterSelected).length > 0) return true;
        return false;
    }, [filtersSelected, nbfcFilterSelected, tagsFilterSelected]);

    return (
        <>
            <CustomAppBar
                title="Portfolio"
                search={false}
                options={false}
                notifications={false}
                backButton={false}
                menuButton={true}
                filter={false}
                calendar={false}
                add={false}
                sort={false}
                clockInStatus={true}
                reminders={true}
                inverted={false}
            />
            <PortfolioHeaderDetails />
            <SortAndFilter
                clearAllActive={hasSelectedFilters}
                filtersVisible={filterScreenVisible}
                setFiltersVisible={setFilterScreenVisible}
                setFilters={setFilters}
                resetFilters={resetFilters}
            />
            <PortfolioList
                filtersVisible={filterScreenVisible}
                setFiltersVisible={setFilterScreenVisible}
                setFilters={setFilters}
                resetFilters={resetFilters}
                filtersSelected={filtersSelected}
                setFiltersSelected={setFilterSelected}
                nbfcFiltersSelected={nbfcFilterSelected}
                setNBFCFiltersSelected={setNBFCfilterSelected}
                tagsFilterSelected={tagsFilterSelected}
                setTagsfilterSelected={setTagsfilterSelected}
            />
        </>
    );
}
