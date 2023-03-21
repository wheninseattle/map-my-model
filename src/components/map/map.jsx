import React from "react";
import { useRef, useState, useEffect } from "react";
import styles from "@/styles/Map.module.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken =
  "pk.eyJ1Ijoid2hlbmluc2VhdHRsZSIsImEiOiJjbGZoaHlzMGwwNnBmM3hsamd1MWI0cHNtIn0.4-cC5OgYn3Sy93DB7F4Gpg";
// mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

const defaultMapCenter = [47.6165, -122.3548];
const [defaultLat, defaultLng] = defaultMapCenter;
const defaultZoomLevel = 9;

export default function Map() {
  //Map default state
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [lng, setLng] = useState(defaultLng);
  const [lat, setLat] = useState(defaultLat);
  const [zoom, setZoom] = useState(defaultZoomLevel);

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
        style: "mapbox://styles/mapbox/light-v11",
        // style: 'mapbox://styles/mapbox/satellite-streets-v12',
        // style: "mapbox://styles/mapbox/dark-v11",
        center: [lng, lat],
        zoom: zoom,
      });

      // Programmatically remove all map labels per instructions 
      map.current.on("load", () => {
        const mapLayers = map.current.style._layers;
        for (const layer in mapLayers) {
          if (mapLayers[layer].type === "symbol") {
            console.log(mapLayers[layer].id);
            map.current.removeLayer(mapLayers[layer].id);
          }
        }
      });
    }
  });

  return (
    <div>
      <div className={styles.dataPanel}>
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className={styles.mapContainer}></div>
    </div>
  );
}
