import { useEffect } from "react";
import { View } from "react-native-web";

export default function WeatherScreen() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);

    const fetchWeather = async () => {
        const response = await getWeather(city);
        setWeather(response);
    }

    useEffect(() => {
        fetchWeather();
    }, [city]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weer App</Text>
            <TextInput
                style={styles.input}
                placeholder="Voer een stad in"
                value={city}
                onChangeText={setCity}
            />
            <Button title="Weer ophalen" onPress={fetchWeather} />
            {weather && (
                <View style={styles.weatherContainer}>
                    <Text>🌡 Temperatuur: {weather.main.temp}°C</Text>
                    <Text>🌦 {weather.weather[0].description}</Text>
                    <Text>💨 Wind: {weather.wind.speed} m/s</Text>
                </View>
            )}
        </View>
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