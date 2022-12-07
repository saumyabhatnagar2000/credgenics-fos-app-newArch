import React from 'react';
import CustomAppBar from '../components/common/AppBar';
import { DispostionForm } from '../components/disposition/DispositionForm';

export const DispositionFormScreen = ({ route }) => {
    const { shootId, phoneNumber } = route?.params;
    return (
        <>
            <CustomAppBar
                title="Disposition Form"
                backButton={false}
                menuButton={false}
            />
            <DispostionForm shootId={shootId} phoneNumber={phoneNumber} />
        </>
    );
};
