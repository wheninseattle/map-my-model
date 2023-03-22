export default function addExtrudedBuildingLayer(map) {

    const extrudedLayerName = '3d-buildings'
    const extrudedLayerAbsent = !(Object.keys(map.current.style._layers).find(layer => layer == extrudedLayerName))
    if (extrudedLayerAbsent) {
        map.current.addLayer({
            id: extrudedLayerName,
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
    }
}