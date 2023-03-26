import axios from "axios";
let publicKey = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
export function getDataSets() {
    console.log('Testing...')
    const username = 'wheninseattle'
    const dataset = 'clfk0wyz20e5y2amapa49hqgp'
    const url = `https://api.mapbox.com/datasets/v1/${username}/${dataset}?access_token=${publicKey}`
    const dataSets = axios.get(url).then(response => {
        // console.log('response.data', response.data)
        return response.data;
    }).catch(error => {
        console.log('error', error)
    })
    console.log('dataSets', dataSets)
}
export function getDatasetFeatures() {
    const username = 'wheninseattle'
    const dataset = 'clfk0wyz20e5y2amapa49hqgp'
    // const url = `https://api.mapbox.com/datasets/v1/${username}/${dataset}?access_token=${publicKey}`
    const url = `https://api.mapbox.com/datasets/v1/${username}/${dataset}/features?access_token=${publicKey}`
    const datasetFeatures = axios.get(url).then(response => {
        // console.log('response.data', response.data)
        return response.data;
    }).catch(error => {
        console.log('error', error)
    })
    return datasetFeatures;
}

export function createUniqueFeatureId(points) {
    let featureId = null;
    if (points.length == 0) {
        featureId = 0;
    }
    if (points.length > 0) {
        let sorted = points.sort((a, b) => b.id - a.id)
        return +sorted[0].id + 1;
    }
    return featureId + 1;
}