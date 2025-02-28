import axios from 'axios';

export const getWeather = async (city) => {

    const apiKey = '4cb2d3849235eba8a9798324431e16b2';
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

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

export const getFutureWeather = async (city) => {
    const API_KEY = "4cb2d3849235eba8a9798324431e16b2";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=nl&appid=${API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Weersvoorspelling kon niet worden opgehaald");
    }

    return response.json();
};
