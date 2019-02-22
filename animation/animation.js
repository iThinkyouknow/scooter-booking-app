import React from 'react';
import { StyleSheet, Text, View, Image, Animated } from 'react-native';

const batteryBarScale = (initialValue) => {
    let initialAnimatedValue = new Animated.Value(initialValue);
    const start = (finalValue) => {

        Animated.timing(initialAnimatedValue,
            {
                toValue: finalValue,
                duration: 1000,
                useNativeDriver: true,
            }
        ).start()
    }

    return {
        initialAnimatedValue,
        start
    }
};

module.exports = {
    batteryBarScale
}