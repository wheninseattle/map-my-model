import React from "react";
import { useRef, useState, useEffect } from "react";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import ControlPanel from "./controlPanel";

import styles from "@/styles/Map.module.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const defaultMapCenter = [47.6165, -122.3548]; // Olympic Sculpture Park, Seattle
const [defaultLat, defaultLng] = defaultMapCenter;
const defaultZoomLevel = 9;
const defaultPitch = 60;

const mapStyles = {
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
};

export default function Map() {
  //Map default state
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [lng, setLng] = useState(defaultLng);
  const [lat, setLat] = useState(defaultLat);
  const [zoom, setZoom] = useState(defaultZoomLevel);
  const [mapStyle, setMapStyle] = useState(mapStyles.dark);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

  useEffect(() => {
    if (map.current) {
      map.current.on("move", () => {
        setLat(map.current.getCenter().lat.toFixed(4));
        setLng(map.current.getCenter().lng.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });
    } else {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [lng, lat],
        zoom: zoom,
        pitch: defaultPitch,
        antialias: true,
      });

      map.current.on("style.load", () => {
        // Programmatically remove all map labels per instructions
        const mapLayers = map.current.style._layers;
        for (const layer in mapLayers) {
          if (mapLayers[layer].type === "symbol") {
            console.log(mapLayers[layer].id);
            map.current.removeLayer(mapLayers[layer].id);
          }
        }
        console.log(map.current);
        // Load 3D buildings
        map.current.addLayer({
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 12,
          paint: {
            "fill-extrusion-color": "#ECF0F1",

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.8,
          },
        });
      });
    }
  });

  const onToggleMapMode = (mapMode) => {
    console.log(mapMode)
    setMapStyle(
      mapStyles[mapMode]
    );
  };

  return (
    <div>
      <div className={`${styles.panel} ${styles.dataPanel}`}>
        Latitude: {lat} | Longitude: {lng} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className={styles.mapContainer}></div>
      <div className={styles.controlPanel}>
      </div>
      <ControlPanel onToggleMapMode={onToggleMapMode} mapStyles={mapStyles} mapStyle={mapStyle} />
    </div>
  );
}
