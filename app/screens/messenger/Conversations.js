import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";

import { useTheme } from '../../ThemeContext';
import themes from "../../colors";
import ConversationItem from "./ConversationItem";
import Chat from "./Chat";
import { ConversationsController } from "./Controllers/ConversationController";

const ChatStack = createStackNavigator();

const Conversations = ({ token, socket, userInfo }) => {
    const darkTheme = useTheme();
    const [theme, setTheme] = useState(darkTheme ? themes.dark : themes.light);
    useEffect(() => setTheme(darkTheme ? themes.dark : themes.light), [darkTheme]);

    const [conversations, setConversations] = useState([]);

    const updateConversations = (newConversation) => {
        setConversations((conversations) => {
            return newConversation.length > 0 ? [...newConversation, ...conversations] : [...newConversation];
        });
    };

    useEffect(() => {
        // send a request to the server to get conversations and setup socket to listen
        // for conversations changes
        ConversationsController.init(socket);
        const runAsync = async () =>
            setConversations(await ConversationsController.getConversations(token, updateConversations));
        runAsync();
    }, []);

    const styles = StyleSheet.create({
        title: {
            fontSize: 32,
            color: theme.text
        },
        container: {
            backgroundColor: theme.bg
        }
    });

    const Chats = ({ navigation }) => (
        <ScrollView style={styles.container}>
            {
                conversations.map((conversation, i) => {
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Chat', {
                                conversationId: conversation.id,
                                title: conversation.title,
                                participants: conversation.participants
                            })}
                            key={i}
                        >
                            <ConversationItem
                                img={conversation.imgUrl || "https://robohash.org/" + conversation.title + "?set=set4.png"}
                                name={conversation.title}
                                lastMsg={conversation?.lastMsg ?? ""}
                                lastDate={ConversationsController.evaluateDate(conversation.lastDate)}
                                unread={conversation.unread}
                            />
                        </TouchableOpacity>
                    )
                })
            }
        </ScrollView>
    );

    return (
        <ChatStack.Navigator screenOptions={{headerShown: false}}>
            <ChatStack.Screen name="Chats" component={Chats}/>
            <ChatStack.Screen name="Chat">
                {props => <Chat {...props} token={token} socket={socket} userInfo={userInfo} />}
            </ChatStack.Screen>
        </ChatStack.Navigator>
    );
}

export default Conversations;