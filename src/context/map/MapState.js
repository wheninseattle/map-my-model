import axios from "axios";
import { useContext, createContext, useReducer, useState } from "react";
import mapReducer from "./MapReducer";
import { GET_LOCATION_POINTS, MAP_ERROR, SET_LNG, SET_LAT } from '../types'
import { createUniqueFeatureId } from "@/utils/mapBoxData";

export const MapContext = createContext();

export function MapState(props) {

    // let publicKey = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    // const userId = "wheninseattle";
    // const datasetId = "clfk0wyz20e5y2amapa49hqgp";

    const [lngLat, setLngLat] = useState(null)
    const [map, setMap] = useState(null)

    //location points
    //markers
    //model
    const initialState = {
        lng: null,
        lat: null,
        locationPoints: [],
    }

    const [locationPoints, setLocationPoints] = useState([]);
    //Initialize state and useDispatch
    const [state, dispatch] = useReducer(mapReducer, initialState)

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

    // const getLocationPoints = async (userId, datasetId) => {
    //     // https://docs.mapbox.com/api/maps/datasets/
    //     // This method of storing points is not secured. TODO: Use oauth to enable users to create their own list
    //     // The api route for retrieving dataset features seems slow to update after adding, modifying, or deleting points.
    //     try {
    //         const url = `https://api.mapbox.com/datasets/v1/${userId}/${datasetId}/features?access_token=${publicKey}`
    //         const res = await axios.get(url);
    //         const points = [];
    //         if (res.data.features && res.data.features.length > 0) {
    //             res.data.features.map((feature) => {
    //                 const newPoint = {
    //                     id: feature.id,
    //                     coordinates: feature.geometry.coordinates,
    //                 }
    //                 points.push(newPoint);
    //             })
    //             dispatch({
    //                 type: GET_LOCATION_POINTS,
    //                 payload: points
    //             })
    //         }
    //     } catch (error) {
    //         console.log('error', error)
    //         dispatch({
    //             type: MAP_ERROR,
    //             payload: error.response.message
    //         })
    //     }
    // }

    // Create Point

    const addPoint = async (lngLat) => {
        const uniqueId = createUniqueFeatureId(locationPoints);
        const { lng, lat } = lngLat;
        const pointData = {
            "id": uniqueId,
            "type": "Feature",
            "properties": {
            },
            "geometry": {
                "coordinates": [lng, lat],
                "type": "Point"
            }
        };

        setLocationPoints([...locationPoints, pointData]);

        // const uniqueId = 2;
        // const { lng, lat } = lngLat;
        // console.log('lng', lng)
        // console.log('lat', lat)
        // console.log('[lng,lat]', [lng,lat])
        // console.log('userId', userId)
        // console.log('datasetId', datasetId)
        // console.log('publicKey', publicKey)
        // try {
        //     const url = `https://api.mapbox.com/datasets/v1/${userId}/${datasetId}/features?access_token=${publicKey}`
        //     console.log('url', url)
        //     const idStr = uniqueId.toString()
        //     console.log('idStr', idStr)
        //     console.log(typeof idStr)
        //     const pointData = {
        //         "type": "Feature",
        //         "properties": {
        //         },
        //         "geometry": {
        //             "coordinates": [-122,47],
        //             "type": "Point"
        //         }
        //     };
        //     // const res = fetch(url,
        //     //     {
        //     //         method: "POST", // *GET, POST, PUT, DELETE, etc.
        //     //         mode: "cors", // no-cors, *cors, same-origin
        //     //         cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        //     //         credentials: "same-origin", // include, *same-origin, omit
        //     //         headers: {
        //     //           "Content-Type": "application/json",
        //     //           // 'Content-Type': 'application/x-www-form-urlencoded',
        //     //         },
        //     //         redirect: "follow", // manual, *follow, error
        //     //         referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //     //         body: JSON.stringify(pointData), // body data type must match "Content-Type" header
        //     //       })
        //     const res = await axios.post(url, pointData
        //     );
        //     console.log('res.data', res.data)
        // } catch (error) {
        //     console.log('error', error)
        //     dispatch({
        //         type: MAP_ERROR,
        //         payload: error.response.message
        //     })
        // }
    }



    // Update Point

    // Delete Point


    return (
        <MapContext.Provider value={{
            lng: state.lng,
            lat: state.lat,
            locationPoints: state.locationPoints,
            map: map,
            lngLat: lngLat,
            locationPoints: locationPoints,
            setMap,
            getLocationPoints,
            setLng,
            setLat,
            addPoint,
            setLngLat
        }}>
            {props.children}
        </MapContext.Provider>
    )
}

export function useMapContext() {
    return useContext(MapContext)
}