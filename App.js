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


const { get } = require('./utils/utils');
const { store, getScooters, updateLocation } = require('./redux/redux-index');

const mapStyle = require('./constants/mapStyle.json');

const Map = require('./components/Map');
const MarkerComponent = require('./components/MarkerComponent');
const Tooltip = require('./components/Tooltip');
const BeamScooterIcon = require('./components/BeamScooterIcon');
const BatteryBar = require('./components/BatteryBar');

const updateCurrentLocationAndScooters = (props) => (event) => {
    const coordinate = get(event, "nativeEvent.coordinate");
    [
        getScooters,
        updateLocation
    ].forEach((fn) => props.dispatch(fn(coordinate)))
};

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
                onUserLocationChange={updateCurrentLocationAndScooters(this.props)} >
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

const slideSideBarAnimation = () => {
    let isOpen = false;
    let sideBarAnimatedValue = new Animated.Value(0);
    let buttonAnimatedValue = new Animated.Value(0);

    const slide = (sideBarWidth) => (sideBarButtonEndValue) => () => {
        const slideToValue = isOpen ? 0 : sideBarWidth;
        const slideButtonValue = isOpen ? 0 : sideBarButtonEndValue
        Animated.stagger(300, [
            Animated.spring(sideBarAnimatedValue, {
                toValue: slideToValue,
                friction: 4,
                useNativeDriver: true,
            }),
            Animated.timing(buttonAnimatedValue, {
                toValue: slideButtonValue,
                useNativeDriver: true,
            })
        ]).start();

        isOpen = !isOpen
    };

    return {
        sideBarAnimatedValue,
        buttonAnimatedValue,
        slide
    }
};

const { sideBarAnimatedValue, buttonAnimatedValue, slide } = slideSideBarAnimation();

const KeyExtractor = (item, index) => item.id;

const getFlatList = (props) => {
    //A) date the trip was taken, 2) trip length, 3) a price that is computed based on some function of the trip length
    const mockData = Array.from({ length: 10 }, (_, i) => {
        
        return {
            id: `trip-${i}`,
            date: `22 February`,
            length: `${Math.floor(Math.random() * 10)}.0 km`,
            price: `$${Math.floor(Math.random() * 10)}.00`
        }
    });

    const FlatListItem = ({ item }) => {
        const { id, date, length, price } = item;
        const textStyle = {
            color: 'white',
            fontSize: 20,
            lineHeight: 24 * 1.3
        }

        const subTextStyle = {
            paddingVertical: 4,
            color: 'white',
            fontSize: 12,
            textAlign: 'center'
        };
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 32
            }}>
                <View style={{
                    marginRight: 24,
                    alignItems: 'center'
                }}>
                    <View style={{
                        backgroundColor: 'blue',
                        width: 2,
                        borderRadius: 5,
                        flex: 1
                    }}>

                    </View>
                    <Text style={subTextStyle}>
                        {length}
                    </Text>
                    <View style={{
                        backgroundColor: 'blue',
                        width: 2,
                        borderRadius: 5,
                        flex: 1
                    }}></View>
                </View>
                <View style={{paddingVertical: 16}}>
                    <Text style={textStyle}>{date}</Text>

                    <Text style={textStyle}>{price}</Text>
                </View>

            </View>
        );
    };
    return (
        <FlatList
            data={mockData}
            keyExtractor={KeyExtractor}
            renderItem={FlatListItem}
        />
    )
}

class SideBar extends React.Component {
    render() {
        const { height, width } = Dimensions.get('window');
        const extraSpacingLeft = 100;
        const barWidth = Math.floor(0.75 * width + 30 + extraSpacingLeft);

        const sideBarStyle = {
            flexDirection: 'row',
            left: -barWidth + 30,
            width: barWidth,
            height,
            backgroundColor: 'transparent',
            position: 'absolute',
            transform: [
                { translateX: sideBarAnimatedValue }
            ]

        };

        const mainSideBarStyle = {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            paddingLeft: extraSpacingLeft,
            paddingTop: 50,
            justifyContent: 'center',
            // flexDirection: 'column'
        }

        const buttonHeight = 100;
        const buttonTop = height * 0.5 - buttonHeight * 0.5;
        const buttonTopWhenAnimated = buttonTop - buttonHeight;



        return (
            <Animated.View style={sideBarStyle}>
                <View style={mainSideBarStyle}>
                    {/* text goes here */}
                    <Text style={{
                        fontSize: 36,
                        color: 'white',
                        textAlign: 'center',
                        alignSelf: 'center'
                    }}>
                        History
                    </Text>
                    {getFlatList(this.props)}
                </View>
                <TouchableOpacity onPress={slide(barWidth - 30 - extraSpacingLeft)(buttonTopWhenAnimated)}>
                    <Animated.View style={{
                        top: buttonTop,
                        height: buttonHeight,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 30,
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        transform: [{
                            translateY: buttonAnimatedValue,
                        }]
                    }}
                    >
                        <Animated.Image source={require('./assets/arrow.png')} style={{
                            height: buttonHeight - 30,
                            width: 20,
                            resizeMode: 'stretch',
                            transform: [
                                {
                                    rotate: buttonAnimatedValue.interpolate({
                                        inputRange: [0, buttonTopWhenAnimated],
                                        outputRange: ["180deg", "0deg"]  // 0 : 150, 0.5 : 75, 1 : 0
                                    })
                                }
                            ]
                        }} />
                    </Animated.View>
                </TouchableOpacity>
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});




