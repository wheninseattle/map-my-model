import React, {useContext} from "react";
import { MapContext } from "@/context/map/MapState";

import styles from "@/styles/Map.module.css";

export default function AddPointForm({
  currentPoint,
  setCurrentPoint,
  onAddPointSubmit,
}) {
  const mapContext = useContext(MapContext);
  const {addPoint,lngLat} = mapContext;
  const { lng, lat } = lngLat;
  console.log('lngLat', lngLat)
  const onChange = (e) => {
    setCurrentPoint((currentPoint) => {
      return {
        ...currentPoint,
        [e.target.name]: e.target.value,
      };
    });
  };
  const onCancel = () => {
    setCurrentPoint(null);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // onAddPointSubmit();
    console.log('adding point at:', lngLat)
    addPoint(lngLat);
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
