
const serverConfigs = require('../constants/serverConfigs')

const api_getScooters = ({ latitude, longitude }) => {
    return fetch(`http://${serverConfigs.host}/scooters?latitude=${latitude}&longitude=${longitude}`)
        .then(res => res.json())
        .catch((err) => console.warn(`Couldn't fetch from scooters api with ${err}`));
};

const api_getPreviousRides = () => {
    return fetch(`http://${serverConfigs.host}/history`)
        .then(res => res.json())
        .catch((err) => console.warn(`Couldn't fetch from history api with ${err}`));
}


module.exports = {
    api_getScooters,
    api_getPreviousRides
}