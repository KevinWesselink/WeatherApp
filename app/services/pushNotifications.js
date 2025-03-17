import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export async function registerForPushNotificationsAsync() {
    console.log("📱 Registreren voor push-notificaties...");
    console.log("Is device: ", Device.isDevice);

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        console.log("Status bestaande toestemming:", existingStatus);

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            alert("Toestemming voor notificaties is geweigerd!");
            return null;
        }

        try {
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log("✅ Expo Push Token:", token);
            return token;
        } catch (error) {
            console.error("❌ Fout bij ophalen van Expo Push Token:", error);
            return null;
        }
    } else {
        alert("Push-notificaties werken alleen op fysieke apparaten.");
        return null;
    }
}

export async function sendPushNotification(expoPushToken) {
    if (!expoPushToken) {
        console.log("Geen Expo Push Token beschikbaar.");
        return;
    }

    try {
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-Encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: expoPushToken,
                sound: "default",
                title: "Hallo!",
                body: "Dit is een testnotificatie 🚀",
            }),
        });

        const data = await response.json();
        console.log("Push Notification Response:", data);
    } catch (error) {
        console.log("Fout bij versturen push-notificatie:", error);
    }
}
