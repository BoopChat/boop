import React, { useState, useRef } from 'react';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { io } from "socket.io-client";

import config from "../../config.json";

import { useTheme } from '../../ThemeContext';
import themes from "../../colors";
import Conversations from './Conversations';
import Contacts from './Contacts';
import Reducer from "../login/loginReducer";



const Drawer = createDrawerNavigator();

const Messenger = ({ loginState, loginDispatch }) => {
    const darkTheme = useTheme();
    const [theme] = useState(darkTheme ? themes.dark : themes.light);


    const TabButton = ({ title, icon }) => {
        const tabStyles = StyleSheet.create({
            ,
            ,
            tabName: {
                fontSize: 15,
                fontWeight: "700",
                paddingLeft: 15,
                color: currentTab == title ? theme.lightText : theme.text
            }
        });


    }

    const styles = StyleSheet.create({
        title: {
            fontSize: 32,
            color: theme.text
        },
        AndroidSafeArea: {
            flex: 1,
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight: 0,
            backgroundColor: theme.bg2,
            alignItems: "flex-start",
            justifyContent: "flex-start"
        },

        username: {
            fontSize: 14,
            fontWeight: "700",
            color: theme.text,
            margin: 5
        },
        profileContainer: {
            justifyContent: "flex-start",
            padding: 15
        },
        screenContainer: {
            flexGrow: 1,
            backgroundColor: theme.bg
        },
        header: {
            display: "flex",
            flexDirection: "row"
        }
    });

    return (
        <SafeAreaView style={styles.AndroidSafeArea}>
            <Drawer.Navigator initialRouteName="Contacts">
                <Drawer.Screen name="Conversations">
                    {props => <Conversations {...props} token={loginState.token} socket={socket}/>}
                </Drawer.Screen>
                <Drawer.Screen name="Contacts">
                    {props => <Contacts {...props} token={loginState.token}/>}
                </Drawer.Screen>
            </Drawer.Navigator>
            <View style={styles.profileContainer}>
                <Image style={styles.profile} source={{uri: loginState.userInfo.imageUrl}}/>
                <Text style={styles.username}>{loginState.userInfo.displayName}</Text>
            </View>
        </SafeAreaView>
    );
}

/*

 {
                        currentTab == TABS.Contacts ?
                            <Contacts token={loginState.token}/>
                        : <Conversations token={loginState.token} socket={socket}/>
                    }
*/

export default Messenger;