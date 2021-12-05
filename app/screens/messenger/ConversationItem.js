import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';

import { useTheme } from '../../ThemeContext';
import themes from "../../colors";

const ConversationItem = ({ name, img, lastMsg, lastDate, unread }) => {
    const darkTheme = useTheme();
    const [theme, setTheme] = useState(darkTheme ? themes.dark : themes.light);
    useEffect(() => setTheme(darkTheme ? themes.dark : themes.light), [darkTheme]);

    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            justifyContent: "space-between"
        },
        logo: {
            width: 50,
            height: 50,
            borderRadius: 50,
            marginRight: 5,
        },
        name: {
            fontWeight: "600",
            fontSize: 16,
            color: theme.text
        },
        msg: {
            fontWeight: "500",
            fontSize: 14,
            color: theme.textFade
        },
        imgAndName: {
            flexDirection: "row",
        },
        nameAndMsg: {
           flexDirection: "row",
            alignSelf: "center"
        },
        unread: {
            backgroundColor: theme.online,
            color: theme.lightText,
            fontSize: 10,
            borderRadius: 50,
            marginTop: 5,
            padding: 4,
            width: 25,
            textAlign: "center"
        },
        dateAndCount: {
            alignItems: "center"
        },
        timestamp: {
            fontWeight: "500",
            fontSize: 12,
            color: theme.text
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.imgAndName}>
                <Image style={styles.logo} source={{uri: img}}/>
                <View style={styles.nameAndMsg}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.msg}>{lastMsg}</Text>
                </View>
            </View>
            <View style={styles.dateAndCount}>
                <Text style={styles.timestamp}>{lastDate ? lastDate : ""}</Text>
                {unread > 0 ? <Text style={styles.unread}>{unread}</Text> : <></>}
            </View>
        </View>
    );
}

export default ConversationItem;