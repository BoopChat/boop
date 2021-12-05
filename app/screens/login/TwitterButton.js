import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

const TwitterButton = ({ text }) => {
    return (
        <TouchableOpacity>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#0f9afb",
        alignItems: "center",
        fontWeight: "500",
        marginBottom: 10,
        marginTop: 10,
        padding: 10,
        borderRadius: 50,
    },
    buttonText: {
        fontWeight: "500",
        fontSize: 16,
        textTransform: "uppercase",
        color: "#fff",
    }
});

export default TwitterButton;