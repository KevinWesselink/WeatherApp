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
    
            const dailyForecasts = response.list.filter(item => item.dt_txt.includes("12:00:00"));
            setFutureWeather(dailyForecasts.slice(0, 5));
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
            {weather && (
                <SafeAreaView style={styles.weatherContainer}>
                    <Text>📍 Locatie: {weather.name}, {weather.sys.country}</Text>
                    <Text>🌡 Temperatuur: {weather.main.temp}°C</Text>
                    <Text>🌦 {weather.weather[0].description}</Text>
                    <Text>💨 Wind: {weather.wind.speed} m/s</Text>
                </SafeAreaView>
            )}
            
            {futureWeather.length > 0 && (
                <FlatList
                    data={futureWeather}
                    horizontal
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.futureWeatherItem}>
                            <Text>{new Date(item.dt * 1000).toLocaleDateString()}</Text>
                            <Text>{new Date(item.dt * 1000).toLocaleDateString()} - {Math.round(item.main.temp)}°C</Text>
                            <Text>🌦 {item.weather[0].description}</Text>
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