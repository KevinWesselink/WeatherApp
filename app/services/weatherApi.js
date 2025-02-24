import axios from 'axios';

const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = '4cb2d3849235eba8a9798324431e16b2';

export const getWeather = async (city) => {
    try {
        const response = await axios.get(apiUrl, {
            params: {
                q: city,
                appid: apiKey,
                units: 'metric',
                lang: 'nl'
            }
        });

        console.log(response.data);
    
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data', error);
    }
}

export const getFutureWeather = async (city, targetDate) => {
    try {
        const response = await axios.get(apiUrl, {
            params: {
                q: city,
                appid: apiKey,
                units: 'metric',
                lang: 'nl'
            }
        });

        const forecast = response.data;
        filteredForecast = forecast.list.filter(item => item.dt_txt.includes(targetDate));

        return filteredForecast;    
    } catch (error) {
        console.error('Error fetching future weather data', error);
    }
}