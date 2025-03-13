import React, { useEffect, useState } from "react";
import { 
    SafeAreaView, Text, TextInput, Button, 
    StyleSheet, useWindowDimensions, ScrollView
} from "react-native";
import moment from "moment";
import { getWeather, getFutureWeather } from "../services/weatherApi";

export default function WeatherScreen() {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [futureWeather, setFutureWeather] = useState([]);

    const fetchWeather = async () => {
        try {
            const filteredCity = city.replace(/[^A-Za-zÀ-ÿ\s]/g, "").trimEnd();
            if (!filteredCity.trim()) {
                alert("Voer een geldige stad in");
                return;
            }
            const response = await getWeather(filteredCity);
            setWeather(response);
            fetchFutureWeather(filteredCity);
        } catch (error) {
            alert("Fout bij ophalen van weer");
            console.log('Error: ', error);
        }
    };

    const fetchFutureWeather = async (cityName) => {
        try {
            const response = await getFutureWeather(cityName);
            const now = new Date();
            const threeDaysLater = new Date();
            threeDaysLater.setDate(now.getDate() + 3);
            setFutureWeather(response.filter(item => {
                const forecastDate = new Date(item.time.replace(" ", "T"));
                return forecastDate >= now && forecastDate <= threeDaysLater;
            }));
        } catch (error) {
            alert("Fout bij ophalen toekomstige weersvoorspelling");
            console.log('Error: ', error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { flexDirection: isLandscape ? "row" : "column" }]}>
            <Text style={styles.title}>Weer App</Text>
            <TextInput
                style={styles.input}
                placeholder="Voer een stad in"
                value={city}
                onChangeText={setCity}
            />
            <Button title="Weer ophalen" onPress={fetchWeather} />
            {weather?.name && (
                <SafeAreaView style={styles.weatherCard}>
                    <Text style={styles.weatherText}>📍 {weather.name}, {weather.country}</Text>
                    <Text style={styles.weatherText}>🌡 {weather.temperature}°C, 🌦 {weather.description}</Text>
                    <Text style={styles.weatherText}>🌬 {weather.wind} m/s</Text>
                    <Text style={styles.weatherText}>🌧 {weather.rain} mm, ❄️ {weather.snow} mm</Text>
                </SafeAreaView>
            )}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {futureWeather.map((item, index) => (
                    <SafeAreaView key={index} style={styles.futureWeatherItem}>
                        <Text>{moment(item.time).format("dddd HH:mm")}</Text>
                        <Text>{Math.round(item.temperature)}°C, {item.description}</Text>
                        <Text>{item.wind} m/s</Text>
                        <Text>🌧 {item.rain} mm, ❄️ {item.snow} mm</Text>
                    </SafeAreaView>
                ))}
            </ScrollView>
        </SafeAreaView>
    );   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: "#f0f4f8",
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: "#333",
    },

    text: {
        fontSize: 16,
        marginBottom: 5,
        color: "#555",
        textAlign: "center",
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        width: '80%',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "#fff",
    },

    weatherContainer: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        width: "90%",
    },

    weatherText: {
        fontSize: 16,
        marginVertical: 2,
        color: "#444",
    },

    futureWeatherList: {
        marginTop: 20,
    },

    futureWeatherItem: {
        backgroundColor: "#dfe9f3",
        padding: 10,
        margin: 5,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 100,
    },

    futureWeatherText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },

    button: {
        marginTop: 10,
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 8,
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
