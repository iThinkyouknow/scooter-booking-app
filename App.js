import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    Animated,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import { Provider, connect } from 'react-redux';


const { get, compose } = require('./utils/utils');
const {
    slideSideBarAnimation
} = require('./animation/animation');
const { store, getScooters, updateLocation } = require('./redux/redux-index');

const mapStyle = require('./constants/mapStyle.json');

const Map = require('./components/Map');
const MarkerComponent = require('./components/MarkerComponent');
const Tooltip = require('./components/Tooltip');
const BeamScooterIcon = require('./components/BeamScooterIcon');
const BatteryBar = require('./components/BatteryBar');

const SideBarContentContainer = require('./components/SideBarContentContainer');
const SideBarButton = require('./components/SideBarButton');
const SideBarButtonImage = require('./components/SideBarButtonImage');


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
        console.log('render' + this.props.currentLocation.latitude)
        //todo: debounce!
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
        currentLocation: get(state, "currentLocation", {
            latitude: 1.295852,
            longitude: 103.786936,
        }),
        scootersDetails: get(state, "scootersDetails", [])
    }
};

const ConnectedMapView = connect(mapStateToProps)(MapViewComponent);


/** for the server */

const getPrice = (fixedPrice = 1) => (perMinutePrice = 0.15) => (timeTakenInMinutes = 0) => (timeTakenInMinutes * perMinutePrice + fixedPrice);
const getPriceWithoutMinutes = getPrice(1)(0.15);
const roundPriceTo5Cents = (price) => (Math.ceil(price * 20) / 20).toFixed(2);
const getPriceString = (price) => `$${price}`;

const getHHandMinsArrayFromMinutesTime = (timeTakenInMinutes) => {
    return [
        Math.floor(timeTakenInMinutes / 60),
        timeTakenInMinutes % 60
    ];
};

const getHHMinsDurationString = ([hours, mins]) => {
    return hours === 0 ? `${mins} mins` : `${hours} h ${mins} m`;
}

const mockData = Array.from({ length: 10 }, (_, i) => {
    const timeTakenInMinutes = Math.floor(Math.random() * 5 * 60);
    const lengthStr = compose([
        getHHandMinsArrayFromMinutesTime,
        getHHMinsDurationString
    ])(timeTakenInMinutes);


    const price = compose([
        getPriceWithoutMinutes,
        roundPriceTo5Cents,
        getPriceString
    ])(timeTakenInMinutes);

    return {
        id: `trip-${i}`,
        date: `22 February`,
        length: lengthStr,
        price
    }
});
/** server / redux*/
const KeyExtractor = (item, index) => item.id;

const getFlatList = (props) => {
    //A) date the trip was taken, 2) trip length, 3) a price that is computed based on some function of the trip length
    return (
        <FlatList
            data={mockData}
            keyExtractor={KeyExtractor}
            renderItem={require('./components/DashedVerticalLinesWithDetails')}
        />
    )
}

const { sideBarAnimatedValue, buttonAnimatedValue, slide } = slideSideBarAnimation();

class SideBar extends React.Component {
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




