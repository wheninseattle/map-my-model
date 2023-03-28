import { useContext, createContext, useState } from "react";
import { createUniqueFeatureId } from "@/utils/mapBoxData";

export const MapContext = createContext();

export function MapState(props) {

    // const userId = "wheninseattle";
    // const datasetId = "clfk0wyz20e5y2amapa49hqgp";

    const [lngLat, setLngLat] = useState(null)
    const [map, setMap] = useState(null)

    const [locationPoints, setLocationPoints] = useState([]);

    const [markerList, setMarkerList] = useState([]);

    const [modelLayer, setModelLayer] = useState(null);

    // Create Point

    const addLocation = (lngLat) => {
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
        return pointData
    }

    // Update Point

    const updateLocation = (id, lngLat, weather) => {
        const { lng, lat } = lngLat;
        const coordinates = [lng, lat];
        setLocationPoints(previousState => {
            const updatedPoints = previousState.map(point => {
                if (point.id == id) {
                    return {
                        ...point,
                        geometry: {
                            ...point.geometry,
                            coordinates: coordinates,
                        },
                        properties: {
                            ...point.properties,
                            weather: weather
                        }
                    };
                }
                return point;
            })
            return updatedPoints
        })
    }

    // Delete Point

    const deleteLocation = (id) => {
        const updatedPoints = locationPoints.filter(point => point.id !== id);
        setLocationPoints(updatedPoints);
    }

    // Add Weather Data To Location Point

    const appendWeatherToLocationPoint = (id, weatherData) => {
        setLocationPoints(previousState => {
            const updatedPoints = previousState.map(point => {
                if (point.id == id) {
                    return {
                        ...point,
                        properties: {
                            ...point.properties,
                            weather: weatherData
                        }
                    };
                }
                return point;
            })
            return updatedPoints
        })
    }

    // Add Marker To Marker List

    const addMarker = (marker) => {
        setMarkerList([...markerList, marker]);
    }

    // Update Marker In Marker List

    const updateMarkerList = (marker, id) => {
        // const markerIndex = markerList.findIndex((marker) => marker.id == id);
        // const updatedMarkers = [
        //     ...markerList.slice(0, markerIndex),
        //     { ...marker },
        //     // { id: id, marker: marker },
        //     ...markerList.slice(markerIndex + 1),
        // ];
        // setMarkerList(updatedMarkers);
    }

    // Delete Marker

    const deleteMarker = (id) => {
        setMarkerList(markerList.filter(marker => marker._element.id !== id));
    }

    return (
        <MapContext.Provider value={{
            map: map,
            lngLat: lngLat,
            locationPoints: locationPoints,
            markerList: markerList,
            modelLayer: modelLayer,
            setModelLayer,
            setMap,
            addLocation,
            updateLocation,
            deleteLocation,
            setLocationPoints,
            setLngLat,
            addMarker,
            updateMarkerList,
            deleteMarker,
            appendWeatherToLocationPoint
        }}>
            {props.children}
        </MapContext.Provider>
    )
}

export function useMapContext() {
    return useContext(MapContext)
}