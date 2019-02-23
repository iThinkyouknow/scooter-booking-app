import React from 'react';
import { StyleSheet, Text, View, Image, Animated } from 'react-native';

const {isString} = require('../utils/utils')


/**iphone X 375, 812 */

const SideBarContainer = (props) => {
    const {
        sideBarContentContainerStyle,
        customTextStyle,
        customText = '',
        children
    } = props;

    return (
            <View style={[styles.sideBarContentContainer, sideBarContentContainerStyle]}>
                {/* text goes here */}
                <Text style={[styles.textHeader, customTextStyle]}>
                    { isString(customText) ? customText : 'Timeline'}
                    </Text>
                {children}
            </View>
    );

}

const styles = StyleSheet.create({
    sideBarContentContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingLeft: 100,
        paddingTop: 50,
        justifyContent: 'center',
    },
    textHeader: {
        fontSize: 36,
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center'
    }
});
module.exports = SideBarContainer;