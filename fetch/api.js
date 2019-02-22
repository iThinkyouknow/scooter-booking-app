// https://api.data.gov.sg/v1/environment/psi

import { Constants, Location, Permissions } from 'expo';

const randomDelta = 0.002;
const getPositive = () => Math.floor(Math.random() * 2) > 0;
const getLatOrLongValue = (delta) => (isPositive) => (val) => isPositive ? val + Math.random() * delta : val - Math.random() * delta;

const leftPad = (length) => (str) => str.length < length ? leftPad(length)(`0${str}`) : str;

const getScootersFromNetwork = ({ latitude, longitude }) => {
    return new Promise((resolve, reject) => {
        const scooters = Array.from({ length: 50 }, () => {
            return {
                latitude: getLatOrLongValue(randomDelta)(getPositive())(latitude),
                longitude: getLatOrLongValue(randomDelta)(getPositive())(longitude),
                batteryPercentage: Math.floor(Math.random() * 101),
                serialCode: leftPad(4)(`${Math.floor(Math.random() * 10000)}`)
            };
        });

        resolve(scooters);
    })
};

const getCurrentLocation = () => {
    return Permissions.askAsync(Permissions.LOCATION).then(({ status }) => {
        if (status !== 'granted') {
            throw 'Location Permission not granted'
        } else {
            return Location.getCurrentPositionAsync({})
        }
    })
}


module.exports = {
    getScootersFromNetwork,
    getCurrentLocation
}