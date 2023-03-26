import React, {useContext} from "react";
import Map from "./map/Map";
import { MapContext } from "@/context/map/MapState";
import DataPanel from "./dataPanel/dataPanel";


export default function MapApp() {

  const mapContext = useContext(MapContext);
  console.log('mapContext', mapContext)


  return (
    <div>
      <Map />
      <DataPanel/>
    </div>
  );
}
