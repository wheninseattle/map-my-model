import axios from 'axios';
export default function getWeatherData(lngLat) {
    const { lng, lat } = lngLat;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=imperial`;
    const weatherData = axios.get(url).then(response => {
        return response.data;
    }).catch(error => {
        console.log('error', error)
    })
    return weatherData;
}