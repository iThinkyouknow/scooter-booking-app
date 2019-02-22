import React from 'react';
import { StyleSheet, Text, View, Image, Animated } from 'react-native';

const {batteryBarScale} = require('../animation/animation');

const getBatteryBarColor = (batteryPercentage) => {
    if (batteryPercentage < 20) {
        return 'red';
    } else if (batteryPercentage > 40) {
        return 'green'
    } else {
        return 'orange'
    }
};

const BatteryBar = (props) => {
    const width = 30;
    const { batteryPercentage = 0 } = props.scooterDetail || {};
    const translateX = batteryPercentage / 100 * width - width;
    const batteryColor = getBatteryBarColor(batteryPercentage);

    const batteryBarScaleAnimate = batteryBarScale(width * - 1);
    const translateXAnimatedValue = batteryBarScaleAnimate.initialAnimatedValue;
    batteryBarScaleAnimate.start(translateX);
    return (
        <View style={[styles.batteryBarOuter, { borderColor: batteryColor}]}>
            <Animated.View style={[styles.batteryBarInner, {
                backgroundColor: batteryColor,
                transform: [
                    {
                        translateX: translateXAnimatedValue
                    },
                    { perspective: 1000 } // for android
                ]
            }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    batteryBarOuter: {
        position: 'absolute',
        top: 30,
        left: 8,
        width: 30,
        height: 4,
        borderWidth: 1,
        borderRadius: 2,
        overflow: 'hidden'
    },
    batteryBarInner: {
        width: 30,
        height: 3,
        
        borderRadius: 2
    }
})

module.exports = BatteryBar;