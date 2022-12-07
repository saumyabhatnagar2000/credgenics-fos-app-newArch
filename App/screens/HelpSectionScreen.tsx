import React from 'react';
import CustomAppBar from '../components/common/AppBar';
import HelpSectionComponent from '../components/common/HelpSection/HelpSectionComponent';

export default function HelpSectionScreen() {
    return (
        <>
            <CustomAppBar
                title="Help"
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
            <HelpSectionComponent />
        </>
    );
}
