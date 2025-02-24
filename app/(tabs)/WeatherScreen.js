import { useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import { StyleSheet, Text, TextInput, Button } from "react-native";
import React, { useState } from 'react';

import { getWeather } from "../services/weatherApi";

export default function WeatherScreen() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);

    const fetchWeather = async () => {
        const response = await getWeather(city);
        setWeather(response);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Weer App</Text>
            <TextInput
                style={styles.input}
                placeholder="Voer een stad in"
                value={city}
                onChangeText={setCity}
            />
            <Button title="Weer ophalen" onPress={fetchWeather} />
            {weather && (
                <SafeAreaView style={styles.weatherContainer}>
                    <Text>🌡 Temperatuur: {weather.main.temp}°C</Text>
                    <Text>🌦 {weather.weather[0].description}</Text>
                    <Text>💨 Wind: {weather.wind.speed} m/s</Text>
                </SafeAreaView>
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
        marginBottom: 20
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
    }
});