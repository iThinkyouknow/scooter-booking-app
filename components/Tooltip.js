import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';

const Tooltip = ({ scooterDetail, onPress }) => {

    const { distance, serialCode, batteryPercentage } = scooterDetail;
    return (
        <Callout tooltip={true} onPress={onPress}>
            <View style={styles.tooltip}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Just {distance}m from you!</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{batteryPercentage}% juice left</Text>
                </View>
                <View style={[styles.textContainer, styles.extraMarginTop]}>
                    <Text style={[styles.text, styles.codeText]}>{serialCode}</Text>
                    <Text style={styles.text}>to Beam away</Text>
                </View>
               
            </View>
        </Callout>
    );
}

const styles = StyleSheet.create({
    tooltip: {
        width: 200,
        // height: 200,
        padding: 8,
        borderRadius: 15,
        backgroundColor: 'black'
    },
    text: {
        color: 'white',
        fontSize: 16
    },
    codeText: {
        fontSize: 24
    },
    textContainer: {
        padding: 4,
        alignItems: 'center'
    },
    extraMarginTop: {
        padding: 8
    }
});

module.exports = Tooltip;