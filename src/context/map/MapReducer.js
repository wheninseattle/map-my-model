import {
    SET_LNG,
    SET_LAT,
    GET_LOCATION_POINTS
} from '../types';

export default (state, action) => {
    switch (action.type) {
        case SET_LNG:
            console.log('action', action)
            return {
                ...state,
                lng: action.payload
            }
        case SET_LAT:
            return {
                ...state,
                lat: action.payload
            }
        case GET_LOCATION_POINTS:
            console.log('action', action)
            return {
                ...state,
                locationPoints: action.payload
            }
    }
}