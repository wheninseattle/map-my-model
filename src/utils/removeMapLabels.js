export default function removeMapLabels(map) {
    const mapLayers = map.current.style._layers;
    for (const layer in mapLayers) {
        if (mapLayers[layer].type === "symbol") {
            map.current.removeLayer(mapLayers[layer].id)
        }
    }
}