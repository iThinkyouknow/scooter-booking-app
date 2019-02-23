const express = require('express')
const app = express()
const port = 3000

const {
    compose
} = require('../utils/utils');

app.get('/', (req, res) => res.send('Hello Scooter!'));

const randomDelta = 0.002;
const getPositive = () => Math.floor(Math.random() * 2) > 0;
const getLatOrLongValue = (delta) => (isPositive) => (val) => isPositive 
    ? val + Math.random() * delta 
    : val - Math.random() * delta;

const leftPad = (length) => (str) => str.length < length ? leftPad(length)(`0${str}`) : str;
const strToFloat = str => parseFloat(str);

app.get('/scooters', (req, res) => {
    const {latitude, longitude} = req.query || {};
    const [latitude_number, longitude_number] = [latitude, longitude].map(strToFloat)
    const returnArray = Array.from({ length: 50 }, () => {
        return {
            latitude: getLatOrLongValue(randomDelta)(getPositive())(latitude_number),
            longitude: getLatOrLongValue(randomDelta)(getPositive())(longitude_number),
            batteryPercentage: Math.floor(Math.random() * 101),
            serialCode: leftPad(4)(`${Math.floor(Math.random() * 10000)}`)
        };
    });

    res.json(returnArray);
});

const getPrice = (fixedPrice = 1) => (perMinutePrice = 0.15) => (timeTakenInMinutes = 0) => (timeTakenInMinutes * perMinutePrice + fixedPrice);
const getPriceWithoutMinutes = getPrice(1)(0.15);
const roundPriceTo5Cents = (price) => (Math.ceil(price * 20) / 20).toFixed(2);
const getPriceString = (price) => `$${price}`;

const getHHandMinsArrayFromMinutesTime = (timeTakenInMinutes) => {
    return [
        Math.floor(timeTakenInMinutes / 60),
        timeTakenInMinutes % 60
    ];
};

const getHHMinsDurationString = ([hours, mins]) => {
    return hours === 0 ? `${mins} mins` : `${hours} h ${mins} m`;
};

const date = Date.now();
const millisecondsInYear = 365 * 24 * 60 * 60 * 1000;
const options = { month: 'long', day: 'numeric' };

app.get('/history', (_, res) => {

    const historyArray = Array
        .from({ length: 50 }, () => {
            return date - Math.floor(Math.random() * millisecondsInYear)
        })
        .sort((a, b) => b - a)
        .map((dateMilliseconds, i) => {
            const timeTakenInMinutes = Math.floor(Math.random() * 5 * 60);
            const lengthStr = compose([
                getHHandMinsArrayFromMinutesTime,
                getHHMinsDurationString
            ])(timeTakenInMinutes);

            const price = compose([
                getPriceWithoutMinutes,
                roundPriceTo5Cents,
                getPriceString
            ])(timeTakenInMinutes);

            return {
                id: `trip-${50 - i}`,
                date: new Date(dateMilliseconds).toLocaleDateString('en-GB', options),
                length: lengthStr,
                price
            };
        });

    res.json(historyArray);
})

app.listen(port, () => console.log(`Beam Server app listening on port ${port}!`))