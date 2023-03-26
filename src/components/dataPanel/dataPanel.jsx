import React, { useEffect } from "react";
import { useState } from "react";
import styles from "@/styles/Map.module.css";
import mapboxgl from "mapbox-gl";
import AddPointForm from "./addPointForm";
import LocationEntry from "./locationEntry";
import mapboxData from "@/utils/mapBoxData";

export default function DataPanel({ lat, lng, zoom, map }) {
  const [currentPoint, setCurrentPoint] = useState(null);
  const [lastId, setLastId] = useState(0);
  const [points, SetPoints] = useState([]);
  const [markers, SetMarkers] = useState([]);

  const mapboxDataClient = new mapboxData();

  useEffect(() => {
    console.log('Pulling data...') // Do we need to move this component out of map, so it doesn't rerender as the map's state changes? - App?
    mapboxDataClient.getDatasetFeatures().then((data) => {
      if (data.features && data.features.length > 0) {
        data.features.map((feature) => {
          const newPoint = {
            id: feature.id,
            coordinates: feature.geometry.coordinates,
          };
          const pointExists = points.find((point) => point.id == feature.id);
          if (!pointExists) {
            SetPoints([...points, newPoint]);
          }
          const  markerExists = markers.find(marker => marker.id == feature.id)
          if(!markerExists){
            const [lng,lat] = feature.geometry.coordinates;
            createMaker(lng,lat,feature.id)
          }
        });
      }
    });
  });

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

    marker._element.id = id;

    const onDragEnd = () => {
      const lngLat = marker.getLngLat();
      const lngFixed = lngLat.lng;
      const latFixed = lngLat.lat;
      const lngLatFixed = { lng: lngFixed, lat: latFixed };
      const id = marker._element.id;
      updateMarker(lngLatFixed, id);
    };
    marker.on("dragend", onDragEnd);

    SetMarkers((markers) => {
      const currentMarker = {
        id: id,
        marker: marker,
      };
      return [...markers, currentMarker];
    });
  };

  const updateMarker = (coordinates, id) => {
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
    const pointToUpdate = {
      id: id,
      coordinates: [coordinates.lng, coordinates.lat],
    };
    if (pointIndex != -1) {
      const updatedPoints = [
        ...points.slice(0, pointIndex),
        pointToUpdate,
        ...points.slice(pointIndex + 1),
      ];
      SetPoints(updatedPoints);
    } else {
      const filteredPoints = points.filter((point) => {
        return point.id != id;
      });
      const updatedPoints = [...filteredPoints, pointToUpdate];
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
