import React, { useState } from "react";
import AddPointForm from "./addPointForm";

export default function LocationEntry({ point, updateMarker, flyToPoint }) {
  const { coordinates, id } = point;
  const [newCoordinates, setNewCoordinates] = useState(null);
  const [lng, lat] = coordinates;
    console.log('coordinates', coordinates)
  const onFlyToPoint = () => {
    flyToPoint(lng, lat);
  };

  const onEdit = () => {
    setNewCoordinates([lng, lat]);
  };
  const onUpdateMarker = () => {
    updateMarker(newCoordinates, id);
  };

  return (
    <div>
      <h3>{`Location ${id}`}</h3>
      <p>
        Lat: {lat} | Lng: {lng}
      </p>
      <button onClick={onFlyToPoint}>Fly</button>
      <button onClick={onEdit}>Edit</button>
      <button>Delete</button>
      {newCoordinates && (
        <AddPointForm
          currentPoint={coordinates}
          setCurrentPoint={setNewCoordinates}
          onAddPointSubmit={onUpdateMarker}
        />
      )}
    </div>
  );
}
