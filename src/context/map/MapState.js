import axios from "axios";
import { useContext, createContext, useReducer, useState } from "react";
import mapReducer from "./MapReducer";
import { GET_LOCATION_POINTS, MAP_ERROR, SET_LNG, SET_LAT } from '../types'

export const MapContext = createContext();

export function MapState(props) {
    let publicKey = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;


    const initialState = {
        lng: null,
        lat: null,
        locationPoints: [],
    }

    //Initialize state and useDispatch
    const [state, dispatch] = useReducer(mapReducer, initialState)
    const [map, setMap] = useState(null)

    const setLng = (lng) => {
        dispatch({
            type: SET_LNG,
            payload: lng
        })
    }
    const setLat = (lat) => {
        dispatch({
            type: SET_LAT,
            payload: lat
        })
    }

    //Get Points From Mapbox user dataset
    const getLocationPoints = async (userId, datasetId) => {
        try {
            const url = `https://api.mapbox.com/datasets/v1/${userId}/${datasetId}/features?access_token=${publicKey}`
            const res = await axios.get(url);
            console.log('res.data', res.data)
            const points = [];
            if (res.data.features && res.data.features.length > 0) {
                res.data.features.map((feature) => {
                    const newPoint = {
                        id: feature.id,
                        coordinates: feature.geometry.coordinates,
                    }
                    points.push(newPoint);
                })
                console.log('points', points)
                dispatch({
                    type: GET_LOCATION_POINTS,
                    payload: points
                })
            }
        } catch (error) {
            console.log('error', error)
            dispatch({
                type: MAP_ERROR,
                payload: error.response.message
            })
        }
    }

    return (
        <MapContext.Provider value={{
            lng: state.lng,
            lat: state.lat,
            locationPoints: state.locationPoints,
            map: map,
            setMap,
            getLocationPoints,
            setLng,
            setLat
        }}>
            {props.children}
        </MapContext.Provider>
    )
}

export function useMapContext() {
    return useContext(MapContext)
}