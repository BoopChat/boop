import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';

import { useTheme } from '../../ThemeContext';
import themes from "../../colors";

import trash from "../../assets/trash.png"

const ContactItem = ({ img, username, status }) => {
    const darkTheme = useTheme();
    const [theme, setTheme] = useState(darkTheme ? themes.dark : themes.light);
    useEffect(() => setTheme(darkTheme ? themes.dark : themes.light), [darkTheme]);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.bg,
            flex: 1,
            flexDirection: "row",
            marginVertical: 10,
            marginHorizontal: 5
        },
        imgAndName: {
            flexDirection: "row",
            flex: 2,
        },
        trashAndStatus: {
            flexDirection: "row",
            flex: 1,
            justifyContent: "flex-end"
        },
        status: {

        },
        img: {
            width: 40,
            height: 40,
            borderRadius: 50
        },
        username: {
            fontSize: 16,
            marginLeft: 15,
            alignSelf: "center",
            color: theme.text
        },
        trashIcon: {
            width: 30,
            height: 30
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.imgAndName}>
                <Image style={styles.img} source={{uri: img}} />
                <Text style={styles.username}>{username}</Text>
            </View>

            <View style={styles.trashAndStatus}>
                <View style={[status]}></View>
                <TouchableOpacity>
                    <Image style={styles.trashIcon} source={trash} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ContactItem;