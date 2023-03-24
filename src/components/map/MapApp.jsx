import React, { useEffect, useRef, useState } from "react";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import Map from "./Map";
import ControlPanel from "./controlPanel";
// import DataPanel from "../dataPanel/dataPanel";

import insertModel from "@/utils/addObjModel";

const defaultMapCenter = [47.6165, -122.3548]; // Olympic Sculpture Park, Seattle
const [defaultLat, defaultLng] = defaultMapCenter;
const defaultZoomLevel = 18;
const defaultPitch = 60;
const mapStyles = {
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
};

export default function MapApp() {
  const [lng, setLng] = useState(defaultLng);
  const [lat, setLat] = useState(defaultLat);
  const [zoom, setZoom] = useState(defaultZoomLevel);
  const [mapStyle, setMapStyle] = useState(mapStyles.dark);
  const [model, setModel] = useState(null);
  
  const map = useRef(null);

  const fileUpload = useRef(null);


  const onToggleMapMode = (mapMode) => {
    setMapStyle(mapStyles[mapMode]);
  };

  const onImportModel = () => {
    fileUpload.current.click();
  };

const onFileChange = (event) => {
    const file = event.target.files[0];
    const modelLayer = insertModel(file,lat,lng,map);
}

  return (
    <div>
      <Map
        lng={lng}
        lat={lat}
        zoom={zoom}
        mapStyle={mapStyle}
        setLat={setLat}
        setLng={setLng}
        setZoom={setZoom}
        setMapStyle={setMapStyle}
        map={map}
      />
      {/* <DataPanel/> */}
      <ControlPanel
        onToggleMapMode={onToggleMapMode}
        onImportModel={onImportModel}
        mapStyles={mapStyles}
        mapStyle={mapStyle}
      />
        <input
        type="file"
        id="file"
        ref={fileUpload}
        style={{ display: "none" }}
        onChange={onFileChange}
      />
    </div>
  );
}
