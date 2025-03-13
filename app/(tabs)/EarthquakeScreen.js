import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Linking, StyleSheet, SafeAreaView, useWindowDimensions } from "react-native";
import moment from "moment";

import { getEarthquakeData } from "../services/earthquakeApi";

export default function EarthquakeScreen() {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const [earthquakes, setEarthquakes] = useState([]);
    useEffect(() => {
        getEarthquakeData().then(setEarthquakes);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.titleContainer, isLandscape && styles.titleLandscape]}>
                <Text style={styles.title}>🌍 Aardbevingen Vandaag</Text>
            </View>

            <FlatList
                data={earthquakes}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(item.url)}>
                        <Text style={styles.cardTitle}>{item.place}</Text>
                        <Text style={styles.magnitude}>Magnitude: {item.magnitude.toFixed(1)}</Text>
                        <Text style={styles.time}>⏳ {moment(item.time).format("LLLL")}</Text>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f4f4f4",
    },
    titleContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 10,
    },
    titleLandscape: {
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
    },
    list: {
        flexGrow: 1,
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    magnitude: {
        fontSize: 16,
        color: "red",
        fontWeight: "bold",
    },
    time: {
        fontSize: 14,
        color: "gray",
    },
});
