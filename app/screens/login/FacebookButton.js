import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React , { useState, useEffect } from 'react';

import themes from "../../colors";
import { useTheme } from '../../ThemeContext';

const FacebookButton = ({ text }) => {
    const darkTheme = useTheme();
    const [theme, setTheme] = useState(darkTheme ? themes.dark : themes.light);
    useEffect(() => setTheme(darkTheme ? themes.dark : themes.light), [darkTheme]);

    const styles = StyleSheet.create({
        button: {
            backgroundColor: theme.white,
            alignItems: "center",
            fontWeight: "500",
            marginBottom: 10,
            marginTop: 10,
            padding: 10,
            borderRadius: 50,
            backgroundColor: "#4c69ba"
        },
        buttonText: {
            fontWeight: "600",
            fontSize: 16,
            textTransform: "uppercase",
            color: "#fff",
        }
    });

    return (
        <TouchableOpacity>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default FacebookButton;