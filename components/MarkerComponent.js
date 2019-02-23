import React from 'react';
import { Marker } from 'react-native-maps';

const mock_fallbackCoordinate = {
    latitude: 1.296692,
    longitude: 103.786936,
};

const MarkerComponent = ({
    scooterDetail = mock_fallbackCoordinate,
    children
}) => {
    return (
        <Marker
            coordinate={scooterDetail}
        >
            {children}
        </Marker>
    )
};

module.exports = MarkerComponent
