import React from 'react';
import { Text } from '../Themed';
import { Badge } from '@rneui/base';

export default function BadgeButton({
    value,
    textStyle,
    containerStyle,
    badgeStyle
}) {
    return (
        <Badge
            containerStyle={containerStyle}
            value={<Text style={textStyle}>{value}</Text>}
            badgeStyle={badgeStyle}
        />
    );
}
