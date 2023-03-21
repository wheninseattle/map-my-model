import React from "react";
import { useRef, useState, useEffect } from "react";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import * as THREE from 'three';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"


import addExtrudedBuildingLayer from "@/utils/addExtrudedBuildings";

import ControlPanel from "./controlPanel";

import styles from "@/styles/Map.module.css";
// import importModel from "@/utils/importModel";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const defaultMapCenter = [47.6165, -122.3548]; // Olympic Sculpture Park, Seattle
const [defaultLat, defaultLng] = defaultMapCenter;
const defaultZoomLevel = 12;
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
        // Programmatically remove all map labels per instructions
        const mapLayers = map.current.style._layers;
        for (const layer in mapLayers) {
          if (mapLayers[layer].type === "symbol") {
            console.log(mapLayers[layer].id);
            map.current.setLayoutProperty(mapLayers[layer].id, 'visibility', 'none');
            // map.current.removeLayer(mapLayers[layer].id);
          }
        }
        console.log(map.current);
        // Load 3D buildings
        addExtrudedBuildingLayer(map);
      });
    }
  });

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // const controls = new OrbitControls(camera, renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(light);

    const three = { renderer, scene, camera };
    setThree(three);

    return () => {
      three.renderer.dispose();
    };
  }, []);

  const onToggleMapMode = (mapMode) => {
    setMapStyle(mapStyles[mapMode]);
  };

  const onImportModel = () => {
    // importModel(map,lng,lat)
    fileUpload.current.click();
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    // Documentation for Three.js OBJLoader: https://threejs.org/docs/#examples/en/loaders/OBJLoader
    if(file.type == 'model/obj'){
      const loader = new OBJLoader();
      const fileURL = URL.createObjectURL(file);
      console.log('fileURL', fileURL)
      loader.load(fileURL,
        (obj)=>{
          console.log('obj', obj)
          if(map){
            const model = three.scene.add(obj);
            // Go here - do we want to do stuff before we add to scene?
            console.log('model', model)
            model.position.set(0,0,0);
            three.scene.add(model)
            setModel(model);
          }
        })
      console.log('Let us do this')
    }else{
      console.log('Error: .Obj files only please.')
    }
    // if(three && map){
    //   const loader = new GLTFLoader();
    //   loader.load(

    //   )
    // }
  }

  return (
    <div>
      <input type="file" id="file" ref={fileUpload} style={{display:'none'}} onChange={onFileChange}/>
      <div className={`${styles.panel} ${styles.dataPanel}`}>
        Latitude: {lat} | Longitude: {lng} | Zoom: {zoom}
      </div>
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
