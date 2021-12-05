import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import themes from "../../colors";
import GoogleButton from './GoogleButton';
import FacebookButton from './FacebookButton';
import TwitterButton from './TwitterButton';
import { useTheme } from '../../ThemeContext';

const Login = ({ dispatch }) => {
    const darkTheme = useTheme()
    const [theme, setTheme] = useState(darkTheme ? themes.dark : themes.light);
    useEffect(() => {
        setTheme(darkTheme ? themes.dark : themes.light);
    }, [darkTheme]);

    const styles = StyleSheet.create({
        signInContainer: {
            flex: 1,
            backgroundColor: theme.bg,
            justifyContent: "center",
            alignItems: "center",
        },
        buttons: {
            marginTop: 60,
            marginBottom: 20
        },
        title: {
            fontSize: 32,
            color: theme.text
        }
    });

    return (
        <View style={styles.signInContainer}>
            <Text style={styles.title}>Boop Chat</Text>
            <View style={styles.buttons}>
                <GoogleButton text="Continue with Google" dispatch={dispatch} />
                <FacebookButton text="Continue with facebook"/>
                <TwitterButton text="Continue with twitter"/>
                <StatusBar style="auto" />
            </View>
        </View>
    );
}

export default Login;