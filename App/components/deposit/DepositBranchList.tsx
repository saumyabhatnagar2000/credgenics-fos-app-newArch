import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '../../hooks/useAuth';
import { ErrorPlaceholder } from '../common/ErrorPlaceholder';
import { DepositBranchType } from '../../../types';
import { SelectBankListItem } from '../common/ExpandableView/SelectBankListItem';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BankBranchType } from '../../../enums';
import CustomSearchBar from '../common/CustomSearchBar';
import {
    BankBranchDepositSearchTypes,
    CompanyBranchDepositSearchTypes
} from '../../constants/constants';
import { capitalizeFirstLetter } from '../../services/utils';

const keyExtractor = (item: DepositBranchType, index: number) =>
    item.branch_id.toString();

export default function DepositBranchList({
    branchType,
    companyBranch,
    bankBranch
}: {
    branchType: string;
    companyBranch: Array<string>;
    bankBranch: Array<string>;
}) {
    const { depositBranch, setDepositBranch } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState(
        branchType == BankBranchType.bank
            ? BankBranchDepositSearchTypes.bank_name
            : CompanyBranchDepositSearchTypes.branch_name
    );
    const [searchedData, setSearchedData] = useState<any>();
    const navigation = useNavigation();
    const [disable, setDisable] = useState(false);
    let clicked = false;

    const data = useMemo(
        () => (branchType == BankBranchType.bank ? bankBranch : companyBranch),
        [branchType]
    );

    useEffect(() => {
        setSearchQuery('');
        setSearchedData(data);
    }, [searchType]);

    const handleSearch = (e: string) => {
        const formattedQuery = e.toLowerCase();
        const formattedData = data.filter((_item: any) => {
            return (
                _item.branch_details[searchType]
                    ?.toLowerCase()
                    ?.includes(formattedQuery) ?? ''
            );
        });
        setSearchedData(formattedData);
        setSearchQuery(e);
    };

    return (
        <>
            <CustomSearchBar
                searchQuery={searchQuery}
                setSearchQuery={handleSearch}
                searchType={
                    branchType == BankBranchType.bank
                        ? BankBranchDepositSearchTypes
                        : CompanyBranchDepositSearchTypes
                }
                searchTypeName={searchType}
                setSearchTypeName={setSearchType}
            />
            <FlatList
                keyExtractor={keyExtractor}
                data={searchedData ?? data}
                contentContainerStyle={{
                    flexGrow: 1,
                    backgroundColor: 'white'
                }}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: 'gray' }} />
                )}
                ListEmptyComponent={
                    <ErrorPlaceholder
                        type="empty"
                        message={`No ${capitalizeFirstLetter(
                            branchType
                        )} Branch Found!`}
                    />
                }
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        disabled={disable}
                        style={{
                            margin: RFPercentage(0.4)
                        }}
                        activeOpacity={0.5}
                        onPress={() => {
                            setDisable(true);
                            if (!clicked) {
                                clicked = true;
                                setDepositBranch(item);
                                if (navigation.canGoBack()) {
                                    navigation.goBack();
                                }
                            }
                        }}
                    >
                        <SelectBankListItem
                            selector={true}
                            selected={
                                item.branch_id === depositBranch?.branch_id
                            }
                            dataDict={item.branch_details}
                        />
                    </TouchableOpacity>
                )}
            />
        </>
    );
}
