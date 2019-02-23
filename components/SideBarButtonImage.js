import React from 'react';
import { StyleSheet, Text, View, Image, Animated, TouchableOpacity } from 'react-native';

const SideBarButtonImage = (props) => {
    const {
        source,
        customStyle,
    } = props;

    const style = [
        styles.sideBarButtonImage,
        customStyle
    ]

    /**{
            height: buttonHeight - 30,
            width: 20,

            transform: [
                {
                    rotate: buttonAnimatedValue.interpolate({
                        inputRange: [0, buttonTopWhenAnimated],
                        outputRange: ["180deg", "0deg"]  // 0 : 150, 0.5 : 75, 1 : 0
                    })
                }
            ]
        } */
    return (
        <Animated.Image source={source || require('../assets/arrow.png')} style={style} />
    );
};

const styles = StyleSheet.create({
    sideBarButtonImage: {
        height: 70,
        width: 20,
        resizeMode: 'stretch',
        transform: [
            {
                rotate: '180deg'
            }
        ]
    }
})
module.exports = SideBarButtonImage;