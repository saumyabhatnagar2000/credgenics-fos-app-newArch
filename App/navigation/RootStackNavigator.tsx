import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import { RootStackParamList } from '../../types';
import PortfolioDetail from '../screens/portfolio/PortfolioDetails';
import NewTask from '../screens/portfolio/NewTask/NewTask';
import TaskDetails from '../screens/tasks/TaskDetails';
import CreditTaskDetails from '../screens/tasks/CreditTaskDetails';
import DepositBranchScreen from '../screens/deposit/DepositBranchScreen';
import DepositSubmitScreen from '../screens/deposit/DepositSubmitScreen';
import ReceiptPDFScreen from '../screens/history/ReceiptPDFScreen';
import { LoanDetails } from '../components/loanDetails/LoanDetails';
import { CustomerProfile } from '../screens/CustomerProfile';
import QuestionnaireScreen from '../screens/QuestionnaireScreen';
import { AddAddressScreen } from '../screens/AddAddressScreen';
import { DispositionFormScreen } from '../screens/DispositionFormScreen';
import { CombineHistory } from '../screens/CombineHistory';
import MapScreen from '../screens/MapScreen';
import HelpSectionScreen from '../screens/HelpSectionScreen';
import HelpSectionDetailsScreen from '../screens/HelpSectionDetailsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import DepositHistoryScreen from '../screens/deposit/DepositHistoryScreen';
import TaskHistoryScreen from '../screens/history/TaskHistoryScreen';
import { DepositTimerScreen } from '../screens/deposit/DepositTimerScreen';

const RootStackNavigator = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
    return (
        <RootStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <RootStackNavigator.Screen
                options={({ navigation }) => {}}
                name="Drawer"
                component={DrawerNavigator}
            />
            <RootStackNavigator.Screen
                name="PortfolioDetailScreen"
                component={PortfolioDetail}
            />
            <RootStackNavigator.Screen
                name="NewTaskScreen"
                component={NewTask}
            />
            <RootStackNavigator.Screen
                name="TaskDetailScreen"
                component={TaskDetails}
            />
            <RootStackNavigator.Screen name="MapScreen" component={MapScreen} />
            <RootStackNavigator.Screen
                name="DepositBranchScreen"
                component={DepositBranchScreen}
            />
            <RootStackNavigator.Screen
                name="DepositSubmitScreen"
                component={DepositSubmitScreen}
            />
            <RootStackNavigator.Screen
                name="ReceiptPDFScreen"
                component={ReceiptPDFScreen}
            />
            <RootStackNavigator.Screen
                name="CustomerProfileScreen"
                component={CustomerProfile}
            />
            <RootStackNavigator.Screen
                name="LoanDetailsScreen"
                component={LoanDetails}
            />
            <RootStackNavigator.Screen
                name="QuestionnaireScreen"
                component={QuestionnaireScreen}
            />
            <RootStackNavigator.Screen
                name="AddAddressScreen"
                component={AddAddressScreen}
            />
            <RootStackNavigator.Screen
                name="DispositionFormScreen"
                component={DispositionFormScreen}
            />
            <RootStackNavigator.Screen
                name="CreditTaskDetails"
                component={CreditTaskDetails}
            />
            <RootStackNavigator.Screen
                name="CombineHistoryScreen"
                component={CombineHistory}
            />
            <RootStackNavigator.Screen
                name="HelpSectionScreen"
                component={HelpSectionScreen}
            />
            <RootStackNavigator.Screen
                name="HelpSectionDetailsScreen"
                component={HelpSectionDetailsScreen}
            />
            <RootStackNavigator.Screen
                name="HistoryScreen"
                component={HistoryScreen}
            />
            <RootStackNavigator.Screen
                name="FieldVisitHistory"
                component={TaskHistoryScreen}
            />
            <RootStackNavigator.Screen
                name="DepositHistory"
                component={DepositHistoryScreen}
            />
            <RootStackNavigator.Screen
                name="DepositTimerScreen"
                component={DepositTimerScreen}
            />
        </RootStackNavigator.Navigator>
    );
}
