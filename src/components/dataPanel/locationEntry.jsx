import React, { useState } from "react";
import AddPointForm from "./addPointForm";
import styles from "@/styles/Map.module.css";

export default function LocationEntry({
  point,
  flyToPoint,
  onUpdateLocation,
  onDeleteLocation,
}) {
  const { id } = point;
  const [lng, lat] = point.geometry.coordinates;
  const weather = point.properties.weather || null;
  const [newCoordinates, setNewCoordinates] = useState(null);

  const onFlyToPoint = () => {
    flyToPoint(lng, lat);
  };

  const onEditLocation = () => {
    setNewCoordinates({ lng: lng, lat: lat });
  };

  return (
    <div className={styles.panelCard}>
      <h4 className={styles.locationWeather}>
        {weather
          ? `${weather.name}: ${weather.main.temp.toFixed(1)} \u00b0F`
          : `Location ${id}`}
      </h4>
      <p className={styles.locationPosition}>
        Lat: {lat.toFixed(4)} | Lng: {lng.toFixed(4)}
      </p>
      <button onClick={onFlyToPoint}>Fly</button>
      <button onClick={onEditLocation}>Edit</button>
      <button
        onClick={() => {
          onDeleteLocation(id);
        }}
      >
        Delete
      </button>
      {newCoordinates && (
        <AddPointForm
          setCurrentPoint={setNewCoordinates}
          newCoordinates={newCoordinates}
          setNewCoordinates={setNewCoordinates}
          point={point}
          onUpdateLocation={onUpdateLocation}
        />
      )}
    </div>
  );
}
