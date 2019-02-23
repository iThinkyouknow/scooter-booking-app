import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

const DashedVerticalLinesWithDetails = ({ item }) => {
    const { id, date, length, price } = item;
    return (
        <View style={styles.container}>
            <View style={styles.dashedLinesContainer}>
                <View style={styles.dashedLines}/> 
                <Text style={styles.subTextStyle}>
                    {length}
                </Text>
                <View style={styles.dashedLines} />
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.textStyle}>{date}</Text>
                <Text style={styles.textStyle}>{price}</Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32
    },
    dashedLinesContainer: {
        marginRight: 24,
        alignItems: 'center'
    },
    dashedLines: {
        backgroundColor: 'blue',
        width: 2,
        borderRadius: 5,
        flex: 1
    },
    detailsContainer: { paddingVertical: 16 },
    textStyle: {
        color: 'white',
        fontSize: 20,
        lineHeight: 24 * 1.3
    },
    subTextStyle: {
        paddingVertical: 4,
        color: 'white',
        fontSize: 12,
        textAlign: 'center'
    }
})
module.exports = DashedVerticalLinesWithDetails;