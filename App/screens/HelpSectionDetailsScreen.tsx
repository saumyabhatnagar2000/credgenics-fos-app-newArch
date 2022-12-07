import React from 'react';
import CustomAppBar from '../components/common/AppBar';
import HelpSectionDetailsComponent from '../components/common/HelpSection/HelpSectionDetailsComponent';

export default function HelpSectionDetailsScreen({ route }) {
    const { headerName, questionsList, indexOpened } = route.params;
    return (
        <>
            <CustomAppBar
                title={headerName}
                search={false}
                options={false}
                notifications={false}
                backButton={true}
                menuButton={false}
                filter={false}
                calendar={false}
                add={false}
                sort={false}
                clockInStatus={false}
                reminders={false}
                inverted={false}
            />
            <HelpSectionDetailsComponent
                indexOpened={indexOpened}
                headerName={headerName}
                questionsList={questionsList}
            />
        </>
    );
}
