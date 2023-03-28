# Map My Model

Map My Model is a web app built with [Next.js](https://nextjs.org/), [Mapbox-GL](https://docs.mapbox.com/mapbox-gl-js/api/), and an API from [OpenWeather](https://openweathermap.org/api). The app allows users to toggle between map modes, import a custom model in the OBJ format, and place location markers. Markers placed display the temperature at their location, and a panel displays information for all markers placed. [You can visit the staged deployment of the site here.](https://map-my-model.vercel.app) While this project was initially started as part of a [coding challenge for Perkins + Will](https://io.perkinswill.com/mapping-challenge/), I look forward to building upon the basic scope and adding features.

## Getting Started

To run Map My Model on your local machine, follow these steps:

1. Clone the repository:

    git clone https://github.com/wheninseattle/map-my-model.git

2. Install dependencies:

    cd map-my-model
    npm install

3. Create an environment file named `.env.local` in the root directory of your project. Inside the file, add your Mapbox and OpenWeather API keys:

    MAPBOX_API_KEY=YOUR_MAPBOX_API_KEY
    OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY

4. Run the app:

    npm run dev

The app should now be running on http://localhost:3000.

## Features

- Toggle between map modes: The app supports two map modes: Light and Dark. Users can switch between them by clicking the corresponding button in the top-right corner of the map.
- Import a custom model: Users can import a custom model in the OBJ format by clicking the "Import Model" button in the top-left corner of the map.
- Place location markers: Users can place location markers on the map by clicking anywhere on the map.
- Display temperature at marker location: When a marker is placed, the app fetches the temperature at the marker location using the OpenWeather API and displays it on the marker.
- Display panel information: The app displays a panel on the right side of the screen that shows information for all markers placed, including their latitude, longitude, and temperature.

## Technologies Used

- [Next.js](https://nextjs.org/)
- [Mapbox-GL](https://docs.mapbox.com/mapbox-gl-js/api/)
- [OpenWeather API](https://openweathermap.org/api)

## Known Limitations

- Custom model layer is lost on map style change
- There is a lack of error handling, and an alert interface for users to receive feedback.
- The UI is clunky, lacks proper accessability, and not meant for use on mobile.
- User location points do not persist between sessions. I experimented with using the [Mapbox dataset API](https://docs.mapbox.com/api/maps/datasets/); while I successful in implementing GET, POST, PUT, and DELETE requests in postman, I found that there was an unpredictable lag in the list dataset features API, which made it difficult to depend on the service. Will look into spinning up a lightweight database to use for this in the future.
- It is my understanding that object properties beginning with '_' are assumed not to be stable and should not be relied upon. This iteration uses the '_element' property of new map markers to assign an id value to provide users with the ability to modify and delete the marker.

## Next Steps

- Model: Preload a lightweight .obj model, so users who do not have a local model, can experiment with this functionality.
- Model: Persist model through map style changes
- Location Dashboard: Add a loading graphic for initializing and updating weather information.
- Alert Bar: Add an alert popover to display user feedback
