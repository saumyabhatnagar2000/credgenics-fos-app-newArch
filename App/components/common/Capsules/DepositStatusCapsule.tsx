import React from 'react';
import {
    AgentMarkedStatusTypes,
    DepositStatuses,
    TaskStatusTypes
} from '../../../../enums';
import Colors, {
    CAPSULE_BLUE_PRIMARY,
    CAPSULE_BLUE_SECONDARY
} from '../../../constants/Colors';
import StatusCapsule from '../StatusCapsule';

const PrimaryColors = {
    rejected: Colors.common.red4,
    approved: Colors.common.green4,
    'not required': Colors.common.light0,
    'partially recovered': CAPSULE_BLUE_PRIMARY,
    pending: Colors.common.orange4,
    closed: Colors.common.green4,
    open: Colors.common.red4,
    missed: Colors.common.red2
};

const SecondaryColors = {
    rejected: Colors.common.red2,
    approved: Colors.common.green1,
    'not required': Colors.common.dark3,
    'partially recovered': CAPSULE_BLUE_SECONDARY,
    pending: Colors.common.orange2,
    closed: Colors.common.green1,
    open: Colors.common.red2,
    missed: Colors.light.background
};

const Title = {
    rejected: 'Failed',
    approved: 'Success',
    'not required': 'Not Required',
    'partially recovered': 'Partially Recovered',
    pending: 'Pending',
    closed: 'Closed',
    open: 'Open',
    missed: 'Missed'
};

const getPrimaryColor = (key: string) => {
    if (key in DepositStatuses) return PrimaryColors[key as DepositStatuses];
    else if (key in TaskStatusTypes)
        return PrimaryColors[key as TaskStatusTypes];
    else if (key in AgentMarkedStatusTypes)
        return PrimaryColors[key as AgentMarkedStatusTypes];
    return PrimaryColors['not required'];
};

const getSecondaryColor = (key: string) => {
    if (key in DepositStatuses) return SecondaryColors[key as DepositStatuses];
    else if (key in TaskStatusTypes)
        return SecondaryColors[key as TaskStatusTypes];
    else if (key in AgentMarkedStatusTypes)
        return SecondaryColors[key as AgentMarkedStatusTypes];
    return SecondaryColors['not required'];
};

const getTitle = (key: string) => {
    if (key in DepositStatuses) return Title[key as DepositStatuses];
    else if (key in TaskStatusTypes) return Title[key as TaskStatusTypes];
    else if (key in AgentMarkedStatusTypes)
        return Title[key as AgentMarkedStatusTypes];
    return key;
};

const DepositStatusCapsule = ({ status }: { status: string }) => {
    return (
        <StatusCapsule
            primaryColor={getPrimaryColor(status)}
            secondaryColor={getSecondaryColor(status)}
            title={getTitle(status)}
        />
    );
};

export default DepositStatusCapsule;
