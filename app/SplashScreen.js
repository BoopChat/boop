import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import themes from './colors';
import { useTheme } from './ThemeContext';


const SplashScreen = () => {
    const darkTheme = useTheme();
    const [theme, setTheme] = useState(darkTheme ? themes.dark : themes.light);
    useEffect(() => setTheme(darkTheme ? themes.dark : themes.light), [darkTheme]);

    const styles = StyleSheet.create({
        text: {
            fontSize: 40,
            fontWeight: "800",
            color: theme.text
        },
        boop: {
            color: theme.primBlue
        },
        splashContainer: {
            flex: 1,
            backgroundColor: theme.bg2,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        }
    });

    return (
        <View style={styles.splashContainer}>
            <Text style={[styles.text, styles.boop]}>Boop</Text>
            <Text style={styles.text}>Chat</Text>
            <StatusBar style="auto" />
        </View>
    )
}

export default SplashScreen;