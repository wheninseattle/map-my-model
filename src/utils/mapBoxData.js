import axios from "axios";
let publicKey = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
export default class mapboxData {
    getDataSets() {
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
    getDatasetFeatures() {
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
}