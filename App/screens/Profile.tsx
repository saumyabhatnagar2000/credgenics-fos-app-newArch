import * as React from 'react';
import { Divider } from 'react-native-paper';
import CustomAppBar from '../components/common/AppBar';
import UserProfile from '../components/profile/UserProfile';

export default function Profile() {
    return (
        <>
            <CustomAppBar
                title="Profile"
                search={false}
                options={false}
                calendar={false}
                notifications={false}
                backButton={true}
                add={false}
                sort={false}
                filter={false}
            />
            <Divider />
            <UserProfile />
        </>
    );
}
