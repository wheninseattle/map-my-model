import React, { useContext } from "react";
import { MapContext } from "@/context/map/MapState";

import styles from "@/styles/Map.module.css";

export default function AddPointForm({
  currentPoint,
  setCurrentPoint,
  newCoordinates,
  setNewCoordinates,
  point,
  onAddLocation,
  onUpdateLocation,
}) {
  const mapContext = useContext(MapContext);

  const { lngLat } = mapContext;
  let lat = 0;
  let lng = 0;

  // Assign initial values to the form inputs depending on whether the user is adding a new point or editing an existing one
  if (currentPoint) {
    lat = currentPoint.lat;
    lng = currentPoint.lng;
  } else {
    lat = newCoordinates.lat;
    lng = newCoordinates.lng;
  }

  const onChange = (e) => {
    const updateCoordinates = (coordinates) => ({
      ...coordinates,
      [e.target.name]: parseFloat(e.target.value),
    });
    currentPoint
      ? setCurrentPoint(updateCoordinates)
      : setNewCoordinates(updateCoordinates);
  };

  const onCancel = () => {
    if (currentPoint) {
      setCurrentPoint(null);
    } else {
      setNewCoordinates(null);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (currentPoint) {
      onAddLocation(currentPoint);
      setCurrentPoint(null);
    } else {
      onUpdateLocation(point.id, newCoordinates);
      setNewCoordinates(null);
    }
  };

  return (
    <form action="" className={styles.addForm}>
      <label htmlFor="lat">Latitude</label>
      <input
        type="number"
        step="any"
        onChange={onChange}
        name="lat"
        id="lat"
        min={-90}
        max={90}
        value={lat}
      />
      <label htmlFor="lng">Longitude</label>
      <input
        type="number"
        step="any"
        onChange={onChange}
        name="lng"
        id="lng"
        min={-180}
        max={180}
        value={lng}
      />
      <div className={styles.formSection}>
        <button type="reset" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </form>
  );
}
