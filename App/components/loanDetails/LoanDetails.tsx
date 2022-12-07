import React, { useEffect, useState } from 'react';
import CustomAppBar from '../common/AppBar';
import { Tab } from '../ui/Tab';
import { RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuth } from '../../hooks/useAuth';
import { getLoanDetails } from '../../services/portfolioService';
import { ToastAndroid } from 'react-native';
import { AxiosError, AxiosResponse } from 'axios';
import { Details } from './Details';
import { LoanDetailsTabs } from '../../../enums';
import { SOMETHING_WENT_WRONG } from '../../constants/constants';

export const LoanDetails = ({ route }: { route: any }) => {
    const { loanData } = route.params;
    const { authData, allocationMonth } = useAuth();
    const [tab, setTab] = useState([
        {
            label: 'Loan Details',
            active: true
        },
        {
            label: 'Recovery Details',
            active: false
        },
        {
            label: 'Additional Details',
            active: false
        }
    ]);

    const [loanSummary, setLoanSummary] = useState({});
    const [loading, setLoading] = useState(false);

    const onRefresh = () => {
        if (tab[0].active) {
            getLoanData(LoanDetailsTabs.loan);
        } else if (tab[1].active) {
            getLoanData(LoanDetailsTabs.recovery);
        } else if (tab[2].active) {
            getLoanData(LoanDetailsTabs.additional_details);
        }
    };

    const getLoanData = (type: string) => {
        setLoading(true);
        getLoanDetails(authData!, loanData.loan_id, type, allocationMonth)
            .then((apiResponse?: AxiosResponse) => {
                if (apiResponse) {
                    const data = apiResponse.data;
                    const output = data.output;
                    setLoanSummary(output);
                }
            })
            .catch((error: AxiosError) => {
                let message = SOMETHING_WENT_WRONG;
                if (error.response) {
                    message =
                        error?.response?.data.output ??
                        error?.response?.data.message;
                }
                ToastAndroid.show(message, ToastAndroid.LONG);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (tab[0].active) {
            getLoanData(LoanDetailsTabs.loan);
        } else if (tab[1].active) {
            getLoanData(LoanDetailsTabs.recovery);
        } else if (tab[2].active) {
            getLoanData(LoanDetailsTabs.additional_details);
        }
    }, [tab]);

    const handleTabChange = (label: string) => {
        let tabDummy = tab;
        tabDummy.map((tab) => {
            tab.active = false;
            if (tab.label === label) {
                tab.active = true;
            }
        });
        setTab([...tabDummy]);
    };

    const getContent = () => {
        if (loading) return null;

        if (tab[0].active)
            return <Details loanDetails={loanSummary?.loan_details || {}} />;

        if (tab[1].active)
            return (
                <Details loanDetails={loanSummary?.recovery_details || {}} />
            );

        if (tab[2].active)
            return (
                <Details loanDetails={loanSummary?.additional_details || {}} />
            );

        return null;
    };

    return (
        <>
            <CustomAppBar
                title={'Loan Details'}
                filter={false}
                sort={false}
                calendar={false}
                search={false}
                backButton={true}
                add={false}
                notifications={false}
                options={false}
            />
            <Tab tabs={tab} handleTabChange={handleTabChange} />
            <ScrollView
                style={{ backgroundColor: '#F6F8FB' }}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                    />
                }
            >
                {getContent()}
            </ScrollView>
        </>
    );
};
