import React from "react";

import styles from "@/styles/Map.module.css";

function ControlPanel(props) {
  const { onToggleMapMode, mapStyles, mapStyle } = props;
  const currentMapMode = Object.keys(mapStyles).find(
    (key) => mapStyles[key] === mapStyle
  );
  return (
    <div className={`${styles.panel} ${styles.controlPanel}`}>
      {Object.keys(mapStyles).map((mapMode) => {
        return (
          <button
            onClick={() => onToggleMapMode(mapMode)}
            className={"btn " + (currentMapMode == mapMode ? "btnActive" : "")}
            key={mapMode}
          >
            {`Toggle ${mapMode} mode`}
            {console.log("mapMode", mapMode)}
          </button>
        );
      })}
    </div>
  );
}

export default ControlPanel;
