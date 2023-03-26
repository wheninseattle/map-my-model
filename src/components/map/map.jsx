import React from "react";
import { useRef, useState, useEffect, useContext } from "react";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import openWeatherData from "@/utils/weatherData";

import addExtrudedBuildingLayer from "@/utils/addExtrudedBuildings";

import ControlPanel from "./controlPanel";
import DataPanel from "../dataPanel/dataPanel";

import styles from "@/styles/Map.module.css";
import removeMapLabels from "@/utils/removeMapLabels";
import addModelLayer from "@/utils/addCustomModel";
import { MapContext } from "@/context/map/MapState";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const defaultMapCenter = [47.6165, -122.3548]; // Olympic Sculpture Park, Seattle
const [defaultLat, defaultLng] = defaultMapCenter;
const defaultZoomLevel = 18;
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
  const fileUpload = useRef(null);

  const mapContext = useContext(MapContext);

  const { lng, lat, setLng, setLat, setMap } = mapContext;
  // const [lng, setLng] = useState(defaultLng);
  // const [lat, setLat] = useState(defaultLat);
  const [zoom, setZoom] = useState(defaultZoomLevel);
  const [mapStyle, setMapStyle] = useState(mapStyles.dark);
  // const [model, setModel] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle);
      removeMapLabels(map);
    }
  }, [mapStyle, map]);

  useEffect(() => {
    if (map.current) {
      map.current.on("move", () => {
        setLat(map.current.getCenter().lat.toFixed(4));
        setLng(map.current.getCenter().lng.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });
    } else {
      setLng(defaultLng);
      setLat(defaultLat);
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [defaultLng, defaultLat],
        zoom: zoom,
        pitch: defaultPitch,
        antialias: true,
      });
      map.current.on("load", () => {
        const canvas = map.current.getCanvasContainer();
        const weather = new openWeatherData();
        weather.writeData();
        weather.readData();
      });

      map.current.on("styledata", () => {
        console.log("mapAfterStyleChange", map);
        // Programmatically remove all map labels per instructions
        removeMapLabels(map);
        // Load 3D buildings
        addExtrudedBuildingLayer(map);
        // TODO: Reestablish model after set style - check out: https://stackoverflow.com/questions/52031176/in-mapbox-how-do-i-preserve-layers-when-using-setstyle
        if (file) {
          console.log("Style changed... trying to reload model...");
          console.log("file", file);
          addModelLayer(file, lng, lat, map);
        }
        setMap(map);
      });
    }
  });

  const onToggleMapMode = (mapMode) => {
    console.log("mapBeforeStyleChange", map);

    setMapStyle(mapStyles[mapMode]);
  };

  const onImportModel = () => {
    if (file) {
      setFile(null);
    }
    fileUpload.current.click();
    console.log("Trying to upload 1");
  };

  const onFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
    console.log("File Uploaded");
    addModelLayer(file, lng, lat, map);
  };

  return (
    <div>
      <input
        type="file"
        id="file"
        ref={fileUpload}
        style={{ display: "none" }}
        onChange={onFileUpload}
      />
      {/* <DataPanel lat={lat} lng={lng} zoom={zoom} map={map} /> */}
      <div ref={mapContainer} className={styles.mapContainer}></div>
      <div className={styles.controlPanel}></div>
      <ControlPanel
        onToggleMapMode={onToggleMapMode}
        onImportModel={onImportModel}
        mapStyles={mapStyles}
        mapStyle={mapStyle}
      />
    </div>
  );
}
