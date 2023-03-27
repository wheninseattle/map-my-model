import React, {useContext} from "react";
import Map from "./map/map";
import { MapContext } from "@/context/map/MapState";
import DataPanel from "./dataPanel/dataPanel";


export default function MapApp() {

  const mapContext = useContext(MapContext);

  return (
    <div>
      <Map />
      <DataPanel/>
    </div>
  );
}
