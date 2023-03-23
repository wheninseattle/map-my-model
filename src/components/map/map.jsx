import React from "react";
import { useRef, useState, useEffect } from "react";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import openWeatherData from "@/utils/weatherData";

import addExtrudedBuildingLayer from "@/utils/addExtrudedBuildings";

import ControlPanel from "./controlPanel";
import DataPanel from "../dataPanel/dataPanel";

import styles from "@/styles/Map.module.css";
import removeMapLabels from "@/utils/removeMapLabels";
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

  const [lng, setLng] = useState(defaultLng);
  const [lat, setLat] = useState(defaultLat);
  const [zoom, setZoom] = useState(defaultZoomLevel);
  const [mapStyle, setMapStyle] = useState(mapStyles.dark);
  const [three, setThree] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle);
      removeMapLabels(map);
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
      map.current.on("load", () => {
        const canvas = map.current.getCanvasContainer();
        const weather = new openWeatherData();
        weather.writeData();
        weather.readData();
      });

      map.current.on("styledata", () => {
        // Programmatically remove all map labels per instructions
        removeMapLabels(map);
        // Load 3D buildings
        addExtrudedBuildingLayer(map);
        // TODO: Reestablish model after set style - check out: https://stackoverflow.com/questions/52031176/in-mapbox-how-do-i-preserve-layers-when-using-setstyle
        if (model) {
          map.current.addLayer(userModelLayer, "tunnel-steps");
        }
      });
    }
  });

  const onToggleMapMode = (mapMode) => {
    setMapStyle(mapStyles[mapMode]);
  };

  const onImportModel = () => {
    fileUpload.current.click();
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    // Documentation for Three.js OBJLoader: https://threejs.org/docs/#examples/en/loaders/OBJLoader
    if (file.type == "model/obj") {
      // parameters to ensure the model is georeferenced correctly on the map
      const modelOrigin = [lng, lat];
      const modelAltitude = 0;
      const modelRotate = [Math.PI / 2, 0, 0];

      const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
        modelOrigin,
        modelAltitude
      );

      // transformation parameters to position, rotate and scale the 3D model onto the map
      const modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],
        /* Since the 3D model is in real world meters, a scale transform needs to be
         * applied since the CustomLayerInterface expects units in MercatorCoordinates.
         */
        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
      };

      const userModelLayer = {
        id: "userModel",
        type: "custom",
        renderingMode: "3d",
        onAdd: function (map, gl) {
          this.camera = new THREE.Camera();
          this.scene = new THREE.Scene();
          // create two three.js lights to illuminate the model
          const directionalLight = new THREE.DirectionalLight(0xffffff);
          directionalLight.position.set(0, -70, 100).normalize();
          this.scene.add(directionalLight);

          const directionalLight2 = new THREE.DirectionalLight(0xffffff);
          directionalLight2.position.set(0, 70, 100).normalize();
          this.scene.add(directionalLight2);

          // Use three.js ObjLoader
          const loader = new OBJLoader();
          const fileURL = URL.createObjectURL(file);
          loader.load(fileURL, (obj) => {
            const model = this.scene.add(obj);
          });
          this.map = map.current;

          // use the Mapbox GL JS map canvas for three.js
          this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true,
          });

          this.renderer.autoClear = false;
        },
        render: function (gl, matrix) {
          const rotationX = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, 0),
            modelTransform.rotateX
          );
          const rotationY = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 1, 0),
            modelTransform.rotateY
          );
          const rotationZ = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 0, 1),
            modelTransform.rotateZ
          );

          const m = new THREE.Matrix4().fromArray(matrix);
          const l = new THREE.Matrix4()
            .makeTranslation(
              modelTransform.translateX,
              modelTransform.translateY,
              modelTransform.translateZ
            )
            .scale(
              new THREE.Vector3(
                modelTransform.scale,
                -modelTransform.scale,
                modelTransform.scale
              )
            )
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);

          this.camera.projectionMatrix = m.multiply(l);
          this.renderer.resetState();
          this.renderer.render(this.scene, this.camera);
          map.current.triggerRepaint();
        },
      };
      setModel(userModelLayer);
      map.current.addLayer(userModelLayer, "tunnel-steps");
    }
  };

  return (
    <div>
      <input
        type="file"
        id="file"
        ref={fileUpload}
        style={{ display: "none" }}
        onChange={onFileChange}
      />
      <DataPanel lat={lat} lng={lng} zoom={zoom} map={map} />
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
