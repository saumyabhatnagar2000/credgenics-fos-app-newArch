import React, { createContext, useState } from 'react';
import {
    FilterDepositTypes,
    PortfolioFilterType,
    SortPortfolioTypes,
    SortValue
} from '../../enums';
import { ActionContextData, SortBy } from '../../types';

const ActionContext = createContext<ActionContextData>({} as ActionContextData);

const ActionProvider: React.FC = ({ children }) => {
    const [portfolioSortType, setPortfolioSortType] = useState<SortBy>({
        type: SortPortfolioTypes.distance,
        value: SortValue.ascending
    });

    const [portfolioFilterType, setPortfolioFilterType] = useState({});
    const [portfolioNBFCType, setPortfolioNBFCType] = useState({});
    const [portfolioTagsType, setPortfolioTagsType] = useState({});

    const [depositFilterType, setDepositFilterType] = useState(
        FilterDepositTypes.overall
    );

    const [portfolioSearchType, setPortfolioSearchType] =
        useState('applicant_name');
    const [activeFilterType, setActiveFilterType] = useState(
        PortfolioFilterType.status
    );

    const [contextLoanData, setContextLoanData] = useState<any>({});
    const [newAddressAdded, setNewAddressAdded] = useState(false);
    return (
        <ActionContext.Provider
            value={{
                portfolioSortType,
                setPortfolioSortType,
                portfolioSearchType,
                setPortfolioSearchType,
                portfolioFilterType,
                setPortfolioFilterType,
                depositFilterType,
                setDepositFilterType,
                portfolioNBFCType,
                setPortfolioNBFCType,
                portfolioTagsType,
                setPortfolioTagsType,
                activeFilterType,
                setActiveFilterType,
                contextLoanData,
                setContextLoanData,
                newAddressAdded,
                setNewAddressAdded
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};

export { ActionContext, ActionProvider };
