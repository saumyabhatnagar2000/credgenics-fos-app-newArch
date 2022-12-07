import * as React from 'react';
import CustomAppBar from '../common/AppBar';
import DashboardDetails from './DashboardDetails';

export default function Dashboard() {
    return (
        <>
            <CustomAppBar
                title="Dashboard"
                search={false}
                options={false}
                calendar={false}
                notifications={false}
                backButton={true}
                add={false}
                sort={false}
                filter={false}
            />
            <DashboardDetails />
        </>
    );
}
