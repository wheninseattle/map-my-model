import React, { useState } from "react";
import AddPointForm from "./addPointForm";

export default function LocationEntry({
  point,
  updateMarker,
  flyToPoint,
  deleteLocation,
}) {
  const { coordinates, id } = point;
  const [newCoordinates, setNewCoordinates] = useState(null);
  const [lng, lat] = coordinates;
  const onFlyToPoint = () => {
    flyToPoint(lng, lat);
  };

  const onEdit = () => {
    setNewCoordinates({lng:lng,lat:lat});
  };
  const onUpdateMarker = () => {
    updateMarker(newCoordinates, id);
    setNewCoordinates(null)
  };

  const onDeleteMarker = () => {
    deleteLocation(id);
  };

  return (
    <div>
      <h3>{`Location ${id}`}</h3>
      <p>
        Lat: {lat} | Lng: {lng}
      </p>
      <button onClick={onFlyToPoint}>Fly</button>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDeleteMarker}>Delete</button>
      {newCoordinates && (
        <AddPointForm
          currentPoint={newCoordinates}
          setCurrentPoint={setNewCoordinates}
          onAddPointSubmit={onUpdateMarker}
        />
      )}
    </div>
  );
}
