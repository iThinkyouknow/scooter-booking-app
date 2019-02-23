import React from 'react';
import {
    StyleSheet,
    Dimensions,
    Animated,
    FlatList,
} from 'react-native';

import { Provider, connect } from 'react-redux';


const { get, compose, isArray } = require('./utils/utils');
const {
    slideSideBarAnimation
} = require('./animation/animation');
const { store, getScooters, updateLocation, getPreviousRides } = require('./redux/redux-index');

const mapStyle = require('./constants/mapStyle.json');

const Map = require('./components/Map');
const MarkerComponent = require('./components/MarkerComponent');
const Tooltip = require('./components/Tooltip');
const BeamScooterIcon = require('./components/BeamScooterIcon');
const BatteryBar = require('./components/BatteryBar');

const SideBarContentContainer = require('./components/SideBarContentContainer');
const SideBarButton = require('./components/SideBarButton');
const SideBarButtonImage = require('./components/SideBarButtonImage');
const DashedVerticalLinesWithDetails = require('./components/DashedVerticalLinesWithDetails')


const threshold = 0.0005
const getIsGreaterThanLocationThreshold = (threshold) => (p1) => (p2) => {
    return Math.abs(p1 - p2) > threshold
};

const getIsGreaterThanThresholdwThreshold = getIsGreaterThanLocationThreshold(threshold)

const updateCurrentLocationAndScooters = (prevCoordinateCache = { latitude: 0, longitude: 0 }) => (props) => (event) => {
    const coordinate = get(event, "nativeEvent.coordinate");

    const areNewCoordinatesGreaterThanThreshold = [
        [coordinate.longitude, prevCoordinateCache.longitude],
        [coordinate.latitude, prevCoordinateCache.latitude],
    ]
        .map(([p1, p2]) => getIsGreaterThanThresholdwThreshold(p1)(p2))
        .reduce((currentResult, result) => {
            return currentResult ? currentResult : result
        }, false);

    if (areNewCoordinatesGreaterThanThreshold) {
        [
            getScooters,
            updateLocation
        ].forEach((fn) => props.dispatch(fn(coordinate)));

        prevCoordinateCache = coordinate;
    }

};

const updateCurrentLocationAndScootersWithCache = updateCurrentLocationAndScooters();

const getMarkerComponents = (props) => {
    return props.scootersDetails
        .map((scooterDetail, i) => (
            <MarkerComponent key={scooterDetail.longitude} scooterDetail={scooterDetail}>
                <BeamScooterIcon source={require('./assets/beam_scooter.png')} />
                <BatteryBar scooterDetail={scooterDetail} />
                <Tooltip scooterDetail={scooterDetail} />
            </MarkerComponent>
        ));
};


class MapViewComponent extends React.Component {

    render() {
        return (
            <Map mapStyle={mapStyle}
                currentLocation={this.props.currentLocation}
                onUserLocationChange={updateCurrentLocationAndScootersWithCache(this.props)} >
                {getMarkerComponents(this.props)}
            </Map>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        currentLocation: get(state, 'currentLocation', {
            latitude: 1.295852,
            longitude: 103.786936,
        }),
        scootersDetails: get(state, 'scootersDetails', []),
        previousRides: get(state, 'previousRides', [])
    }
};

const ConnectedMapView = connect(mapStateToProps)(MapViewComponent);

const KeyExtractor = (item, index) => item.id;

const getFlatList = (props) => {
    const {
        previousRides = []
    } = props;
    //A) date the trip was taken, 2) trip length, 3) a price that is computed based on some function of the trip length
    /** 
     * previousRides: [{
        id: String,
        date: String,
        length: String,
        price: String
    }]**/
    return (
        <FlatList
            data={previousRides}
            keyExtractor={KeyExtractor}
            renderItem={DashedVerticalLinesWithDetails}
        />
    )
};

const { sideBarAnimatedValue, buttonAnimatedValue, slide } = slideSideBarAnimation();

class SideBar extends React.Component {

    componentDidMount() {
        this.props.dispatch(getPreviousRides());
    }

    render() {
        const { height, width } = Dimensions.get('window');
        const extraSpacingLeft = 100;
        const barWidth = Math.floor(0.75 * width + 30 + extraSpacingLeft);

        const sideBarStyle = {
            left: -barWidth + 30,
            width: barWidth,
            height,
            transform: [
                { translateX: sideBarAnimatedValue }
            ],
        };

        const mainSideBarStyle = {
            paddingLeft: extraSpacingLeft,
        };

        const buttonHeight = 100;
        const buttonTop = height * 0.5 - buttonHeight * 0.5;
        const buttonTopWhenAnimated = buttonTop - buttonHeight;

        const slideWithDimensions = slide(barWidth - 30 - extraSpacingLeft)(buttonTopWhenAnimated);

        return (
            <Animated.View style={[styles.sideBarContainer, sideBarStyle]}>
                <SideBarContentContainer sideBarContentContainerStyle={mainSideBarStyle}>
                    {getFlatList(this.props)}
                </SideBarContentContainer>

                <SideBarButton
                    onPress={slideWithDimensions}
                    customStyle={{
                        top: buttonTop,
                        height: buttonHeight,
                        transform: [{
                            translateY: buttonAnimatedValue,
                        }]
                    }}>
                    <SideBarButtonImage customStyle={{
                        height: buttonHeight - 30,
                        transform: [
                            {
                                rotate: buttonAnimatedValue.interpolate({
                                    inputRange: [0, buttonTopWhenAnimated],
                                    outputRange: ["180deg", "0deg"]  // 0 : 150, 0.5 : 75, 1 : 0
                                })
                            }
                        ]
                    }} />
                </SideBarButton>
            </Animated.View>

        )
    }
}

const ConnectedSideBar = connect(mapStateToProps)(SideBar);

export default class App extends React.Component {

    render() {
        return (
            <Provider store={store}>
                <ConnectedMapView />
                <ConnectedSideBar />
            </Provider>
        )
    }
}

const styles = StyleSheet.create({
    sideBarContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        position: 'absolute',
    }
});




