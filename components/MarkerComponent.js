import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';

import {
    MapView
} from 'expo';

const mock_fallbackCoordinate = {
    latitude: 1.296692,
    longitude: 103.786936,
};

const MarkerComponent = ({
    index = 0,
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



const styles = StyleSheet.create({
    
});

module.exports = MarkerComponent
