import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Google from 'expo-google-app-auth';
import config from "../../config.json"

import themes from "../../colors";
import { useTheme } from '../../ThemeContext';
import googleLogo from "../../assets/googleLogo.png";
import Reducer from "./loginReducer";

import AsyncStorage from '@react-native-async-storage/async-storage';

const GoogleButton = ({ text, dispatch }) => {
    const [btnActive, setBtnActive] = useState(false);

    const darkTheme = useTheme();
    const [theme, setTheme] = useState(darkTheme ? themes.dark : themes.light);
    useEffect(() => {
        setTheme(darkTheme ? themes.dark : themes.light);
    }, [darkTheme]);

    const styles = StyleSheet.create({
        button: {
            backgroundColor: theme.bg,
            alignItems: "center",
            color: "#0000008a",
            fontWeight: "500",
            flexDirection: "row",
            marginBottom: 10,
            marginTop: 10,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: theme.border,
            padding: 10,
            borderRadius: 50,
        },
        buttonText: {
            fontWeight: "500",
            fontSize: 18,
            marginLeft: 15,
            color: theme.text
        },
        icon: {
            width: 20,
            height: 20
        }
    });

    const login = async googleInfo => {
        const resultCookie = await fetch(config.SERVER_ADDR + "api/login/auth/google/app", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "app",
                "X-Access-Token": JSON.stringify(googleInfo),
            },
        });
        //sends request to api which checks for the login cookie
        const res = await fetch(config.SERVER_ADDR + "api/login/auth/cookie", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": resultCookie.headers.map["set-cookie"]
            },
        });
        const data = await res.json();
        const { success } = data;

        if (success) {
            const { token, userInfo } = data;
            // Store the user Information and access token
            dispatch({
                type: Reducer.ACTIONS.USER,
                payload: userInfo
            });
            dispatch({
                type: Reducer.ACTIONS.TOKEN,
                payload: token
            });
            try {
                await AsyncStorage.setItem("session", JSON.stringify({ userInfo, token }));
            } catch (e) {
                console.log(e);
            }
        }
    }

    const handleTouch = () => {
        // disable further interaction with button until process complete
        setBtnActive(true);

        Google.logInAsync({
            iosClientId: config.IOS_CLIENT_ID,
            androidClientId: config.ANDROID_CLIENT_ID,
            scopes: ["profile", "email"]
        }).then(result => {
            if (result.type === "success")
                login(result);
            else // TODO change this to a toast
                console.log("Google sign in was cancelled")
            setBtnActive(false); // renable button
        }).catch(error => {
            console.log(error);
            setBtnActive(false); // renable button
        });
    };

    return (
        <TouchableOpacity onPress={handleTouch} disabled={btnActive}>
            <View style={styles.button}>
                <Image style={styles.icon} source={googleLogo}/>
                <Text style={styles.buttonText}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default GoogleButton;