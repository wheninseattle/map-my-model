import React from "react";
import { useState } from "react";
import styles from "@/styles/Map.module.css";
import mapboxgl from "mapbox-gl";

import AddPointForm from "./addPointForm";
import LocationEntry from "./locationEntry";

export default function DataPanel({ lat, lng, zoom, map }) {
  const [currentPoint, setCurrentPoint] = useState(null);
  const [lastId, setLastId] = useState(0);
  const [points, SetPoints] = useState([]);
  const [markers, SetMarkers] = useState([]);
  const onAddPoint = () => {
    setCurrentPoint({
      lat: lat,
      lng: lng,
    });
  };
  const onAddPointSubmit = () => {
    const newId = lastId + 1;
    createMaker(lng, lat, newId);
    const currentPoint = {
      id: newId,
      coordinates: [lng, lat],
    };
    SetPoints((points) => {
      return [...points, currentPoint];
    });
    setLastId(newId);
    setCurrentPoint(null);
  };

  const createMaker = (markerLng, markerLat, id) => {
    const marker = new mapboxgl.Marker({
      color: "#FFFFFF",
      draggable: true,
    })
      .setLngLat([markerLng, markerLat])
      .addTo(map.current);

    SetMarkers((markers) => {
      const currentMarker = {
        id: id,
        marker: marker,
      };
      return [...markers, currentMarker];
    });
  };

  const updateMarker = (coordinates, id) => {
    const currentMarker = markers.filter((marker) => {
      return marker.id == id;
    })[0];
    console.log('currentMarker', currentMarker)
    console.log('coordinates', coordinates)
    // currentMarker.marker.setLngLat(coordinates).addTo(map.current)
  };
  const flyToPoint = (lng, lat) => {
    map.current.flyTo({
      center: [lng, lat],
      essential: true,
    });
  };

  return (
    <div className={`${styles.panel} ${styles.dataPanel}`}>
      <h3>DataPanel</h3>
      <div>
        Latitude: {lat} | Longitude: {lng} | Zoom: {zoom}
      </div>
      {!currentPoint && <button onClick={onAddPoint}>Add Point</button>}
      {currentPoint && (
        <AddPointForm
          currentPoint={currentPoint}
          setCurrentPoint={setCurrentPoint}
          onAddPointSubmit={onAddPointSubmit}
        />
      )}
      <div>
        {points.length > 0 &&
          points.map((point) => {
            return (
              <LocationEntry
                key={point.id}
                point={point}
                updateMarker={updateMarker}
                flyToPoint={flyToPoint}
              />
            );
          })}
      </div>
    </div>
  );
}
