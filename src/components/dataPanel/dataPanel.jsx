import React, { useState, useContext } from "react";
import mapboxgl from "mapbox-gl";

import { MapContext } from "@/context/map/MapState";

import AddPointForm from "./addPointForm";
import LocationEntry from "./locationEntry";

import getWeatherData from "@/utils/weatherData";

import styles from "@/styles/Map.module.css";

export default function DataPanel({}) {
  const [currentPoint, setCurrentPoint] = useState(null);

  const mapContext = useContext(MapContext);
  const {
    lngLat,
    addLocation,
    updateLocation,
    deleteLocation,
    locationPoints,
    setLocationPoints,
    map,
    addMarker,
    updateMarkerList,
    deleteMarker,
    markerList,
    appendWeatherToLocationPoint,
  } = mapContext;

  const toggleAddLocation = () => {
    const { lng, lat } = lngLat;
    setCurrentPoint({
      lng: lng,
      lat: lat,
    });
  };

  const onAddLocation = async (lngLat) => {
    const newLocation = await addLocation(lngLat);
    const id = newLocation.id;
    let weather = await getWeatherData(lngLat).then((res) => res);
    appendWeatherToLocationPoint(id, weather);
    const temperature = weather.main.temp.toFixed(0);
    createMaker(newLocation.geometry.coordinates, id, temperature);
  };

  const onUpdateLocation = async (id, newCoordinates) => {
    const weather = await getWeatherData(newCoordinates).then((res) => res);
    const idStr = id.toString();
    updateLocation(id, newCoordinates, weather);
    updateMarker(newCoordinates, idStr, false);
  };

  // Function to execute when a marker drag is finished
  const onDragEnd = async (marker) => {
    const markerLngLat = marker.getLngLat();
    const id = marker._element.id;
    const idNum = parseInt(id);
    const weather = await getWeatherData(markerLngLat).then((res) => res);
    const temp = weather.main.temp.toFixed(0) || null;
    // Update custom weather marker with temperature
    marker._element.innerHTML = `${temp == null ? "" : temp}${
      temp == null ? "" : "\u00b0F"
    }`;

    updateLocation(idNum, markerLngLat, weather);
    updateMarker(markerLngLat, id, true);
  };

  const createMaker = async (coordinates, id, temp) => {
    const createTemperatureMarker = (temp) => {
      const el = document.createElement("div");
      el.className = styles.temperatureMarker;
      el.innerHTML = `${temp == null ? "" : temp}${
        temp == null ? "" : "\u00b0F"
      }`;
      return el;
    };

    const marker = new mapboxgl.Marker({
      color: "#3498DB",
      draggable: true,
      element: createTemperatureMarker(temp),
    })
      .setLngLat(coordinates)
      .addTo(map.current);
    marker._element.id = id;

    marker.on("dragend", () => {
      onDragEnd(marker);
    });

    addMarker(marker);
  };
  const updateMarker = (coordinates, id, drag = true) => {
    const markerIndex = markerList.findIndex(
      (marker) => marker._element.id == id
    );
    if (markerIndex != -1) {
      const markerToUpdate = markerList[markerIndex];
      const updatedMarker = markerToUpdate.setLngLat(coordinates);
      updateMarkerList(updatedMarker, id);
    }
    //If marker is dragged, update locationPoints
    if (drag) {
      const idNum = parseInt(id);

      const pointIndex = locationPoints.findIndex((point) => point.id == idNum);
      const pointToUpdate = {
        id: id,
        coordinates: [coordinates.lng, coordinates.lat],
      };
      if (pointIndex != -1) {
        const updatedPoints = [
          ...locationPoints.slice(0, pointIndex),
          pointToUpdate,
          ...locationPoints.slice(pointIndex + 1),
        ];
        setLocationPoints(updatedPoints);
      }
    }
  };

  const onDeleteLocation = (id) => {
    const idStr = id.toString();
    const markerIndex = markerList.findIndex(
      (marker) => marker._element.id == idStr
    );
    if (markerIndex != -1) {
      const markerToRemove = markerList[markerIndex];
      markerToRemove.remove();
    }
    deleteMarker(idStr);
    deleteLocation(id);
  };

  const flyToPoint = (lng, lat) => {
    map.current.flyTo({
      center: [lng, lat],
      essential: true,
    });
  };

  return (
    <div className={`${styles.panel} ${styles.dataPanel}`}>
      <div className={styles.panelHeading}>
        <h3>Map Locations</h3>
        {!currentPoint && (
          <button onClick={toggleAddLocation}>Add Point</button>
        )}
      </div>
      {currentPoint && (
        <AddPointForm
          currentPoint={currentPoint}
          setCurrentPoint={setCurrentPoint}
          createMaker={createMaker}
          onAddLocation={onAddLocation}
        />
      )}
      <div>
        {locationPoints.length > 0 &&
          locationPoints
            .sort((a, b) => a.id - b.id)
            .map((point, i) => {
              return (
                <LocationEntry
                  index={i}
                  key={point.id}
                  point={point}
                  flyToPoint={flyToPoint}
                  currentPoint={currentPoint}
                  setCurrentPoint={setCurrentPoint}
                  onUpdateLocation={onUpdateLocation}
                  onDeleteLocation={onDeleteLocation}
                />
              );
            })}
      </div>
    </div>
  );
}
