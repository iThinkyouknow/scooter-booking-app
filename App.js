import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';

import {
    MapView
} from 'expo';

import { Provider, connect } from 'react-redux';

import { createStore } from 'redux';
const reducer1 = (state, action) => {
    return state;
};
const store = createStore(reducer1);

const mapStyle = [
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]

const MapViewComponent = (props) => (
    <MapView
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
            latitude: 1.296692,
            longitude: 103.786936,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
        }}
        customMapStyle={mapStyle} >
        {Array.from({ length: 10 }, (_, i) => (
            <Marker
                coordinate={{
                    latitude: 1.296692 + i * 0.0005,
                    longitude: 103.786936 + i * 0.0005,

                }}
            >
                <Callout tooltip={true}>
                    <View style={{ width: 100 }}>
                        <Text>{props.a}</Text>
                        <Text>Description</Text>
                        <Text>Description 2</Text>
                        <Text>Description 3</Text>
                    </View>
                </Callout>
                <Image source={require('./assets/beam_scooter.png')} style={{ resizeMode: 'contain', width: 30 }}></Image>
            </Marker>
        ))}

    </MapView>
);

const mapStateToProps = (state) => {
    return {
        a: 'abc'
    }
};

const ConnectedMapView = connect(mapStateToProps)(MapViewComponent);

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <ConnectedMapView />
            </Provider>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});




