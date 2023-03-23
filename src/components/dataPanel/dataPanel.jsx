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
      lng: lng,
      lat: lat,
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
    console.log(coordinates);
    const markerIndex = markers.findIndex((marker) => marker.id == id);
    if (markerIndex != -1) {
      const markerToUpdate = markers[markerIndex];
      const updatedMarker = markerToUpdate.marker
        .setLngLat(coordinates)
        .addTo(map.current);

      const updatedMarkers = [
        ...markers.slice(0, markerIndex),
        { id: id, marker: updatedMarker },
        ...markers.slice(markerIndex + 1),
      ];
      SetMarkers(updatedMarkers);
    }
    const pointIndex = points.findIndex((point) => point.id == id);
    if (pointIndex != -1) {
      const pointToUpdate = {
        id: id,
        coordinates: [coordinates.lng, coordinates.lat],
      };
      const updatedPoints = [
        ...points.slice(0, pointIndex),
        pointToUpdate,
        ...points.slice(pointIndex + 1),
      ];
      console.log("updatedPoints", updatedPoints);
      SetPoints(updatedPoints);
    }
  };

  const deleteLocation = (id) => {
    const markerIndex = markers.findIndex((marker) => marker.id == id);
    if (markerIndex != -1) {
      const markerToRemove = markers[markerIndex];
      markerToRemove.marker.remove();
    }

    SetMarkers((markers) => {
      return markers.filter((marker) => {
        return marker.id != id;
      });
    });

    SetPoints((points) => {
      return points.filter((point) => {
        return point.id != id;
      });
    });
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
                deleteLocation={deleteLocation}
              />
            );
          })}
      </div>
    </div>
  );
}