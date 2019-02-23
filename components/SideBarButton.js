import React from 'react';
import { StyleSheet, Animated, TouchableOpacity } from 'react-native';

const {
    noOp
} = require('../utils/utils')

const SideBarButton = (props) => {
    const {
        onPress = noOp,
        customStyle = {},
        children
    } = props;

    /**
    {
        top: buttonTop,
        height: buttonHeight,
        transform: [{
            translateY: buttonAnimatedValue,
        }]
    }, 
    */

    const style = [
        styles.sideBarButton,
        customStyle
    ];

    return (
        <TouchableOpacity onPress={onPress}>
            <Animated.View style={style}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    sideBarButton: {
        justifyContent: 'center',
        alignItems: 'center',
        top: 50,
        height: 100,
        width: 30,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        transform: [
            { translateY: new Animated.Value(0) }
        ]
    }
});

module.exports = SideBarButton;

