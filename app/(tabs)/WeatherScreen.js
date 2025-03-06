import { useEffect } from "react";
import { SafeAreaView, View, FlatList } from "react-native";
import { StyleSheet, Text, TextInput, Button } from "react-native";
import React, { useState } from 'react';

import { getWeather, getFutureWeather } from "../services/weatherApi";

export default function WeatherScreen() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [futureWeather, setFutureWeather] = useState([]);

    const fetchWeather = async () => {
        try {
            const filteredCity = city.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    
            if (!filteredCity.trim()) {
                alert("Voer een stad in zonder nummers of speciale tekens");
                return;
            }
    
            const response = await getWeather(filteredCity);
            setWeather(response);
    
            fetchFutureWeather(filteredCity);
        } catch (error) {
            alert("Er is een fout opgetreden bij het ophalen van de weersvoorspelling.");
            console.error('Error fetching weather data', error);
        }
    };
    
    const fetchFutureWeather = async (cityName) => {
        try {
            const response = await getFutureWeather(cityName);      
            console.log('Future Weather Response: ', response);
    
            const now = new Date();
            const threeDaysLater = new Date();
            threeDaysLater.setDate(now.getDate() + 3);

            const hourlyForecasts = response.filter(item => {
                const forecastDate = new Date(item.time.replace(" ", "T"));
                return forecastDate >= now && forecastDate <= threeDaysLater;
            });

            setFutureWeather(hourlyForecasts);
        } catch (error) {
            console.error("Error fetching future weather data:", error);
            alert("Er is een fout opgetreden bij het ophalen van de weersvoorspelling.");
        }
    };        

    const handleCityChange = (input) => {
        setCity(input);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Weer App</Text>
            <Text style={styles.text}>Voer een stad in om het weer op te halen</Text>
            <Text style={styles.text}>Nummers of speciale tekens zijn niet toegestaan</Text>
            <TextInput
                style={styles.input}
                placeholder="Voer een stad in"
                value={city}
                onChangeText={handleCityChange}
            />
            <Button title="Weer ophalen" onPress={fetchWeather} />
            {weather?.name && (
                <SafeAreaView style={styles.weatherContainer}>
                    <Text>📍 Locatie: {weather.name}, {weather.country}</Text>
                    <Text>🌡 Temperatuur: {weather.temperature}°C</Text>
                    <Text>🌦 {weather.description}</Text>
                    <Text>💨 Wind: {weather.wind} m/s</Text>
                    <Text>🌧 Regen: {weather?.rain} mm</Text>
                    <Text>❄️ Sneeuw: {weather?.snow} mm</Text>
                </SafeAreaView>
            )}
            
            {futureWeather.length > 0 && (
                <FlatList
                    data={futureWeather}
                    horizontal
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.futureWeatherItem}>
                            <Text>{new Date(item.time.replace(" ", "T")).toLocaleString()}</Text>
                            <Text>{Math.round(item.temperature)}°C</Text>
                            <Text>🌦 {item.description}</Text>
                            <Text>🌧 Regen: {item.rain} mm</Text>
                            <Text>❄️ Sneeuw: {item.snow} mm</Text>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },

    text: {
        marginBottom: 5,
    },

    input: {
        borderWidth: 1,
        padding: 10,
        width: '80%',
        marginBottom: 10
    },

    weatherContainer: {
        marginTop: 20,
        alignItems: 'center'
    },

    futureWeatherItem: {
        backgroundColor: "#ddd",
        padding: 8,
        margin: 4,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        maxHeight: 100,
    },
    
    futureWeatherText: {
        fontSize: 14,
    },
    
});