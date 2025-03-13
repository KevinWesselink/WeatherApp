import axios from 'axios';

export const getEarthquakeData = async () => {
    const apiUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        console.log('Data from earthquake API: ', data);

        const earthquakes = data.features.map(item => ({
            id: item.id,
            place: item.properties.place,
            magnitude: item.properties.mag,
            time: item.properties.time,
            url: item.properties.url
        }));

        console.log('Earthquakes: ', earthquakes);

        return earthquakes;
    } catch (error) {
        console.error('Error fetching earthquake data', error);
    }
}