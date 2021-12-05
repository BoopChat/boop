import React, { useEffect, useState } from 'react';
import { View, Switch, StyleSheet } from "react-native";

import { useThemeUpdate } from "../../ThemeContext";
import themes from "../../colors";
import { useTheme } from '../../ThemeContext';


const Settings = () => {
    const toggleTheme = useThemeUpdate();
    const darkTheme = useTheme();
    const [theme, setTheme] = useState(darkTheme ? themes.dark : themes.light);

    useEffect(() => {
        setTheme(darkTheme ? themes.dark : themes.light);
    }, [darkTheme])

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.bg
        }
    });

    return (
        <View style={styles.container}>
            <Switch
                trackColor={{ false: theme.bg2, true: theme.primBlue }}
                thumbColor={darkTheme ? theme.bg2 : theme.primBlue}
                ios_backgroundColor={theme.primBlue}
                onValueChange={toggleTheme}
                value={darkTheme}
            />
        </View>
    );
};

export default Settings;