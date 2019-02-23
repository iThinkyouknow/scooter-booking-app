import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const BeamScooterIcon = (props) => {
    return (
        <Image source={props.source}
            style={[styles.image]}
            {...props} />)
};

const styles = StyleSheet.create({
    image: {
        width: 30,
        height: 45,
        marginTop : 8,
        resizeMode: 'contain'
    }
})

module.exports = BeamScooterIcon;