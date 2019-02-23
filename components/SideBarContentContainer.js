import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const { isString } = require('../utils/utils')

const SideBarContainer = (props) => {
    const {
        sideBarContentContainerStyle,
        customTextStyle,
        customText = '',
        children
    } = props;

    return (
        <View style={[styles.sideBarContentContainer, sideBarContentContainerStyle]}>
            <Text style={[styles.textHeader, customTextStyle]}>
                {isString(customText) ? customText : 'The Good Times we have!'}
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
        marginHorizontal: 8,
        fontSize: 32,
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center'
    }
});
module.exports = SideBarContainer;