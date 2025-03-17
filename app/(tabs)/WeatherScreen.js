import React, { useEffect, useState } from "react";
import { 
    SafeAreaView, Text, TextInput, Button, 
    StyleSheet, useWindowDimensions, ScrollView, View
} from "react-native";
import moment from "moment";
import { getWeather, getFutureWeather } from "../services/weatherApi";
import { registerForPushNotificationsAsync, sendPushNotification } from "../services/pushNotifications";

export default function WeatherScreen() {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [futureWeather, setFutureWeather] = useState([]);
    const [expoPushToken, setExpoPushToken] = useState(null);

    useEffect(() => {
       async function getPushToken() {
            const token = await registerForPushNotificationsAsync();
            console.log("Token: ", token);
            if (token) {
                console.log("✅ Ontvangen Push Token:", token);
                setExpoPushToken(token);
            } else {
                console.log("❌ Geen Push Token ontvangen");
            }
        }

        getPushToken();
    }, []);

    const fetchWeather = async () => {
        try {
            const filteredCity = city.replace(/[^A-Za-zÀ-ſ\s]/g, "").trimEnd();
            if (!filteredCity.trim()) {
                alert("Voer een geldige stad in");
                return;
            }
            const response = await getWeather(filteredCity);
            setWeather(response);
            fetchFutureWeather(filteredCity);
            sendPushNotification(expoPushToken);
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
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={[styles.content, isLandscape && styles.landscapeContent]}>
                <View style={styles.inputContainer}>
                    <Text style={styles.title}>🌍 Weer App</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Voer een stad in"
                        value={city}
                        onChangeText={setCity}
                    />
                    <Button title="Weer ophalen" onPress={fetchWeather} />
                </View>

                {weather?.name && (
                    <View style={styles.weatherCard}>
                        <Text style={styles.weatherText}>📍 {weather.name}, {weather.country}</Text>
                        <Text style={styles.weatherText}>🌡 {weather.temperature}°C, 🌦 {weather.description}</Text>
                        <Text style={styles.weatherText}>🌬 {weather.wind} m/s</Text>
                        <Text style={styles.weatherText}>🌧 {weather.rain ?? 0} mm, ❄️ {weather.snow ?? 0} mm</Text>
                    </View>
                )}

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.futureWeatherList}>
                    {futureWeather.map((item, index) => (
                        <View key={index} style={styles.futureWeatherItem}>
                            <Text style={styles.futureWeatherText}>{moment(item.time).format("dddd HH:mm")}</Text>
                            <Text style={styles.futureWeatherText}>{Math.round(item.temperature)}°C, {item.description}</Text>
                            <Text style={styles.futureWeatherText}>💨 {item.wind} m/s</Text>
                            <Text style={styles.futureWeatherText}>🌧 {item.rain ?? 0} mm, ❄️ {item.snow ?? 0} mm</Text>
                        </View>
                    ))}
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f0f4f8",
    },

    content: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    landscapeContent: {
        flexDirection: "column",
        alignItems: "center",
    },

    inputContainer: {
        alignItems: 'center',
        width: "90%",
        maxWidth: 400,
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#333",
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        width: '100%',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "#fff",
    },

    weatherCard: {
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
        maxWidth: 400,
    },

    weatherText: {
        fontSize: 16,
        marginVertical: 2,
        color: "#444",
        textAlign: "center",
    },

    futureWeatherList: {
        marginTop: 20,
        paddingBottom: 10,
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
        textAlign: "center",
    },
});