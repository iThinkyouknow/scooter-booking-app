import React from 'react';
import { StyleSheet } from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps';

import {
    MapView
} from 'expo';

const {
    noOp
} = require('../utils/utils')

const fallbackInitialRegion = require('../constants/fallbackCurrentLocation.json')

const insertDeltaToLocation = ({ latitude = fallbackInitialRegion.latitude, longitude = fallbackInitialRegion.longitude }) => {
    return {
        latitude,
        longitude,
        latitudeDelta: 0.00522,
        longitudeDelta: 0.00221
    };
}

const Map = ({
    mapStyle = [],
    initialRegion = fallbackInitialRegion,
    currentLocation,
    onUserLocationChange = noOp,
    children = {}
}) => (
        <MapView
            style={styles.container}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            initialRegion={initialRegion}
            region={insertDeltaToLocation(currentLocation)}
            onUserLocationChange={onUserLocationChange}
            customMapStyle={mapStyle} >
            {children}
        </MapView>
    );

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
module.exports = Map;