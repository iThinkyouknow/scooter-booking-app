/** It could be separated into different files* but for simplicity sakes, it is combined into one
    * index, actions, 1 file for each reducer, actionConstants, reduxConfigs etc
    * **/

import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise-middleware';
import logger from 'redux-logger'

const {
    compose
} = require('../utils/utils')

const {
    api_getScooters,
    api_getPreviousRides
} = require('../fetch/api');

const generateActionTypesConstants = (type) => {
    const pending = `${type}_PENDING`;
    const fulfilled = `${type}_FULFILLED`;
    const rejected = `${type}_REJECTED`;
    return {
        [type]: type,
        [pending]: pending,
        [fulfilled]: fulfilled,
        [rejected]: rejected
    };
};

const actionTypes = {
    "GET_SCOOTERS": {
        "GET_SCOOTERS": "GET_SCOOTERS",
        "GET_SCOOTERS_PENDING": "GET_SCOOTERS_PENDING",
        "GET_SCOOTERS_FULFILLED": "GET_SCOOTERS_FULFILLED",
        "GET_SCOOTERS_REJECTED": "GET_SCOOTERS_REJECTED"
    },
    "UPDATE_CURRENT_LOCATION": {
        "UPDATE_CURRENT_LOCATION": "UPDATE_CURRENT_LOCATION",
        "UPDATE_CURRENT_LOCATION_PENDING": "UPDATE_CURRENT_LOCATION_PENDING",
        "UPDATE_CURRENT_LOCATION_FULFILLED": "UPDATE_CURRENT_LOCATION_FULFILLED",
        "UPDATE_CURRENT_LOCATION_REJECTED": "UPDATE_CURRENT_LOCATION_REJECTED"
    },
    "GET_PREVIOUS_RIDES": generateActionTypesConstants("GET_PREVIOUS_RIDES")

};

//actions
const getScooters = (currentLocation) => {
    return {
        type: actionTypes.GET_SCOOTERS.GET_SCOOTERS,
        payload: api_getScooters(currentLocation)
    }
}

const updateLocation = (location) => {
    return {
        type: actionTypes.UPDATE_CURRENT_LOCATION.UPDATE_CURRENT_LOCATION,
        payload: location
    }
};

const getPreviousRides = () => {
    return {
        type: actionTypes.GET_PREVIOUS_RIDES.GET_PREVIOUS_RIDES,
        payload: api_getPreviousRides()
    }
};

// helper
const getDistance = (currentLocation) => (anotherLocation) => {
    //https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((anotherLocation.latitude - currentLocation.latitude) * p) / 2 +
        c(currentLocation.latitude * p) * c(anotherLocation.latitude * p) *
        (1 - c((anotherLocation.longitude - currentLocation.longitude) * p)) / 2;

    return 12742000 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371000 m

};

const addDistanceToDetails = (scooterDetails) => (distanceStr) => {
    return {
        ...scooterDetails,
        distance: distanceStr
    }
};


// reducer
const reducer1 = (state = {}, action) => {

    if (action.type === actionTypes.UPDATE_CURRENT_LOCATION.UPDATE_CURRENT_LOCATION) {
        const { latitude, longitude } = action.payload || require('../constants/fallbackCurrentLocation.json');
        return {
            ...state,
            currentLocation: {
                latitude,
                longitude
            }
        }
    } else if (action.type === actionTypes.GET_SCOOTERS.GET_SCOOTERS_FULFILLED) {
        const getDistanceWithCurrLocation = getDistance(state.currentLocation);
        /**
         * scooterDetail: [{
                latitude: Number,
                longitude: Number,
                batteryPercentage: Number,
                serialCode: String,
                distance: Number (in meters)
            }]
         */
        return {
            ...state,
            scootersDetails: action.payload
                .map(scooterDetail => {
                    return compose([
                        getDistanceWithCurrLocation,
                        Math.round,
                        addDistanceToDetails(scooterDetail)
                    ])(scooterDetail);
                })
                .sort((a, b) => b.distance - a.distance) || []
        };
    } else if (action.type === actionTypes.GET_PREVIOUS_RIDES.GET_PREVIOUS_RIDES_FULFILLED) {
        /**
         * [{
                id: String,
                date: String,
                length: String,
                price: String
            }]
         */
        return {
            ...state,
            previousRides: action.payload || []
        }
    }
    return state || {};
};
const store = createStore(reducer1, applyMiddleware(promise, logger));

//combine reducers

module.exports = {
    store,
    actionTypes,
    getScooters,
    updateLocation,
    getPreviousRides
};