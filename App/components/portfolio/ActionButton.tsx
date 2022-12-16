import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ToastAndroid } from 'react-native';
import { SpeedDial } from '@rneui/base';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { LoanStatusType, ScreenName, TaskTypes } from '../../../enums';
import { ActionButtonType, PortfolioLoan } from '../../../types';
import { BLUE } from '../../constants/Colors';
import { LOAN_IS_CLOSED, Overall } from '../../constants/constants';
import { useAction } from '../../hooks/useAction';
import { useAuth } from '../../hooks/useAuth';
import useLoanDetails from '../../hooks/useLoanData';
import { StringCompare } from '../../services/utils';
import { TypographyFontFamily } from '../ui/Typography';

const color = BLUE;
const titleStyles = {
    fontFamily: TypographyFontFamily.medium,
    fontSize: RFPercentage(2)
};

export default function ActionButton(config: ActionButtonType) {
    const [isOpen, setOpen] = useState(false);
    const navigation = useNavigation();
    const { setSelectedLoanData } = useLoanDetails();
    const { allocationMonth } = useAuth();

    const openNewTask = () => {
        let closedLoanIDs: any = [];
        config?.loanData?.map((loan_data: PortfolioLoan) => {
            if (StringCompare(loan_data?.final_status, LoanStatusType.closed)) {
                closedLoanIDs.push(loan_data?.loan_id);
            }
        });
        if (closedLoanIDs?.length > 0) {
            let errorMsg = '';
            if (
                StringCompare(config?.screenName, ScreenName.portfolio_details)
            ) {
                errorMsg = LOAN_IS_CLOSED;
            } else if (
                StringCompare(config?.screenName, ScreenName.portfolio_list)
            ) {
                errorMsg =
                    closedLoanIDs?.length > 1
                        ? `Remove Loan IDs ${closedLoanIDs.join(
                              ', '
                          )} from selection to proceed as loans are closed.`
                        : `Remove Loan ID ${closedLoanIDs.join(
                              ', '
                          )} from selection to proceed as loan is closed.`;
            }
            ToastAndroid.show(errorMsg, ToastAndroid.LONG);
            return;
        }
        setOpen(false);
        if (StringCompare(allocationMonth, Overall)) {
            ToastAndroid.show(
                `Visit cannot be scheduled at ‘Overall’ allocation month, please select an individual month.`,
                ToastAndroid.LONG
            );
            return;
        }
        if (config.loanData.length == 1)
            setSelectedLoanData({ ...config.loanData[0] });

        navigation.navigate('NewTaskScreen', {
            loanData: config.loanData,
            address: config?.address,
            taskType: TaskTypes.visit,
            allocationMonth: config.allocationMonth
        });
    };

    const fieldVisitButton = (
        <SpeedDial.Action
            icon={{ name: 'add-business', color: '#fff' }}
            title="Schedule Visit"
            titleStyle={titleStyles}
            color={color}
            onPress={() => openNewTask()}
        />
    );

    const toggle = () => setOpen(!isOpen);

    return (
        <SpeedDial
            disabled={!!config?.disabled}
            isOpen={isOpen}
            icon={{ name: 'add', color: 'white' }}
            openIcon={{ name: 'close', color: 'white' }}
            onClose={toggle}
            onOpen={toggle}
            color={color}
        >
            {fieldVisitButton}
        </SpeedDial>
    );
}
