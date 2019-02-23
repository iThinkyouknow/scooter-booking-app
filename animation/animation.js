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

module.exports = {
    batteryBarScale,
    slideSideBarAnimation
}