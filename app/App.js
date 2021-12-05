import React, { useEffect, useReducer, useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList  } from "@react-navigation/drawer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Text,
    StyleSheet,
    SafeAreaView,
    View,
    Platform,
    StatusBar,
    Image,
    TouchableOpacity,
    ImageBackground
} from 'react-native';

import { io } from "socket.io-client";
import config from "./config.json"

import Reducer from "./screens/login/loginReducer";
import Login from './screens/login/Login';
import SplashScreen from './SplashScreen'
import { ThemeProvider } from './ThemeContext';
import Conversations from './screens/messenger/Conversations';
import Contacts from './screens/messenger/Contacts';
import Settings from './screens/messenger/Settings';

import { useTheme } from './ThemeContext';
import themes from "./colors";

import chats from "./assets/chats.png"
import contacts from "./assets/contacts.png"
import settings from "./assets/settings.png"
import logout from "./assets/logout.png"
import profileBgImg from "./assets/bg.png"

const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawer = (props) => {
    const darkTheme = useTheme();
    const [theme, setTheme] = useState(darkTheme ? themes.dark : themes.light);
    useEffect(() => setTheme(darkTheme ? themes.dark : themes.light), [darkTheme]);

    const styles = StyleSheet.create({
        drawer: {
            backgroundColor: theme.bg2,
            color: theme.lightText
        },
        profile: {
            width: 60,
            height: 60,
            borderRadius: 50,
        },
        profilebg: {
            paddingVertical: 30,
            paddingHorizontal: 10
        },
        username: {
            color: theme.text,
            fontWeight: "600",
            fontSize: 16
        },
        items: {
            backgroundColor: theme.bg2,
            paddingTop: 10
        },
        drawerContainer: {
            flex: 1,
            backgroundColor: theme.bg2
        },
        tabContainer: {
            flexDirection: "row",
            alignItems: 'center',
            paddingVertical: 20,
            backgroundColor: 'transparent',
            paddingLeft: 20,
            paddingRight: 35,
            borderTopColor: theme.borderHover,
            borderTopWidth: 1
        },
        icon: {
            width: 25,
            height: 25,
        },
        tabName: {
            fontSize: 15,
            fontWeight: "700",
            paddingLeft: 15,
            color: theme.text
        }
    });

    const handlePress = async () => {
        await AsyncStorage.removeItem("session");
        props.loginDispatch({ type: Reducer.ACTIONS.CLEAR })
    };

    return (
        <View style={styles.drawerContainer}>
            <ImageBackground style={styles.profilebg} source={profileBgImg}>
                <Image style={styles.profile} source={{uri: props.loginState.userInfo.imageUrl}}/>
                <Text style={styles.username}>{props.loginState.userInfo.displayName}</Text>
            </ImageBackground>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.drawer}>
                <View style={styles.items}>
                    <DrawerItemList {...props}/>
                </View>
            </DrawerContentScrollView>
            <TouchableOpacity onPress={handlePress}>
                <View style={styles.tabContainer}>
                    <Image source={logout} style={styles.icon}/>
                    <Text style={styles.tabName}>Logout</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
};

export default function App() {
    const [loginState, dispatch] = useReducer(Reducer.reducer, {
        userInfo: {},
        token: "",
    });
    const [loading, setLoading] = useState(true);
    const darkTheme = useTheme();
    const [theme, setTheme] = useState(darkTheme ? themes.dark : themes.light);
    useEffect(() => {
        setTheme(darkTheme ? themes.dark : themes.light);
    }, [darkTheme])

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const value = await AsyncStorage.getItem("session");
                if(value) {
                    let session = JSON.parse(value);
                    dispatch({
                        type: Reducer.ACTIONS.USER,
                        payload: session.userInfo
                    });
                    dispatch({
                        type: Reducer.ACTIONS.TOKEN,
                        payload: session.token
                    });
                }
            } catch(e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        loadSession();
    }, []);

    useEffect(() => {
        if (loginState.token?.length > 0) {
            setSocket(io(config.SERVER_ADDR, {
                auth: {
                    token: loginState.token,
                },
            }));
        }
    }, [loginState.token]);

    const Messenger = () => {
        const styles = StyleSheet.create({
            drawerIcon: {
                width: 25,
                height: 25,
            }
        });

        return (
            <Drawer.Navigator
                initialRouteName="Conversations"
                drawerContent={props => <CustomDrawer {...props} loginState={loginState} loginDispatch={dispatch}/>}
                screenOptions={{
                    drawerLabelStyle: {marginLeft: -20},
                    drawerActiveTintColor: theme.lightText,
                    drawerActiveBackgroundColor: theme.border,
                    drawerInactiveTintColor: theme.lightText
                }}
            >
                <Drawer.Screen name="Conversations" options={{
                    drawerIcon: () => <Image source={chats} style={styles.drawerIcon}/>
                }}>
                    {props => <Conversations {...props} token={loginState.token} socket={socket} userInfo={loginState.userInfo} />}
                </Drawer.Screen>
                <Drawer.Screen name="Contacts" options={{
                    drawerIcon: () => <Image source={contacts} style={styles.drawerIcon}/>
                }}>
                    {props => <Contacts {...props} token={loginState.token} />}
                </Drawer.Screen>
                <Drawer.Screen
                    name="Settings"
                    options={{drawerIcon: () => <Image source={settings} style={styles.drawerIcon}/>}}
                    component={Settings}
                />
            </Drawer.Navigator>
        )
    };

    return (
        <ThemeProvider>
            {
                <NavigationContainer>
                <RootStack.Navigator screenOptions={{headerShown: false}}>
                    {
                        loading ?
                        <RootStack.Screen
                            name=" "
                            component={SplashScreen}
                        /> : (
                            loginState.token === "" ?
                            <RootStack.Screen name="Login">
                                {props => <Login {...props} dispatch={dispatch}/>}
                            </RootStack.Screen>
                            :
                            <RootStack.Screen name="Messenger">
                                {props => <Messenger {...props} dispatch={dispatch} loginState={loginState}/>}
                            </RootStack.Screen>
                        )
                    }
                </RootStack.Navigator>
                </NavigationContainer>
            }
        </ThemeProvider>
    );
}