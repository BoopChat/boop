import React, { useState, useEffect } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput
} from 'react-native';

import { useTheme } from '../../ThemeContext';
import themes from "../../colors";
import { ChatController } from "./Controllers/ChatController";
import options from "../../assets/options.png"

const Chat = ({ socket, token, userInfo, route: { params: { conversationId, title, participants }} }) => {
    const darkTheme = useTheme();
    const [theme, setTheme] = useState(darkTheme ? themes.dark : themes.light);
    useEffect(() => setTheme(darkTheme ? themes.dark : themes.light), [darkTheme]);

    const [messages, setMessages] = useState([]);
    const [text, onTextChange] = useState("");

    const styles = StyleSheet.create({
        header: {
            justifyContent: "space-between",
            padding: 10,
            backgroundColor: theme.bg3,
            borderBottomColor: theme.border,
            borderBottomWidth: 1,
            flexDirection: "row"
        },
        icon: {
            width: 30,
            height: 30,
            borderRadius: 50
        },
        container: {
            backgroundColor: theme.bg
        },
        text: {
            color: theme.text
        },
        headerTitle: {
            fontSize: 16,
            fontWeight: "700"
        },
        sendBtn: {
            backgroundColor: theme.primBlue,
            padding: 10,
        },
        textBox: {
            flex: 4,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.input,
            color: theme.text
        },
        interactions: {
            flexDirection: "row",
            height: 42,
            justifyContent: "space-between"
        },
        chatbox: {
            height: "88%"
        },
        info: {
            flexDirection: "row",
            alignItems: "center"
        },
        user: {
            color: theme.textFade,
            fontWeight: "600",
            padding: 15,
            width: "65%"
        },
        time: {
            color: theme.textFade,
            fontWeight: "400",
        },
        message: {
            padding: 5,
            marginBottom: 10
        },
        messageContent: {
            marginLeft: 30,
            color: theme.text,
            width: "80%"
        }
    });

    const handleSend = async () => {
        // if a conversation is not active, disable send button
        if (!conversationId) return;
        // if text box is empty dont bother trying to send message
        if (text?.length < 1) return;
        let result = await ChatController.sendMessage(token, conversationId, text);
        if (result.success) onTextChange(""); // clear the text box
        // scroll to the bottom of the chat where new message has been rendered
        // chatbox.current.scrollTop = chatbox.current.scrollHeight;
    };

    const addNewMessages = (messageList) => {
        // instead of repeatly calling setMessages, add valid messages to list and then call setMessages once
        let add = [];
        messageList.forEach(msg => {
            // if message is not already in the list, mark it for adding
            // reduce the search space by only search the last messageList.length - 1 messages
            if (!messages.slice(-messageList.length-1).find(({ id }) => id === msg.id))
                add.push(msg);
        });
        setMessages(prevMessages => prevMessages.length > 1 ? [...prevMessages, ...add] : add);
    };

    useEffect(() => {
        setMessages([]); // if switching conversations, clear the ui from previous messages
        ChatController.init(socket);
        ChatController.clear(); // clear previous listener if exist
        // as new messages come in from the server add them to messages list
        ChatController.listen((message) => {
            // if the new message is a message for the currently opened chat
            // if not simply ignore it in the ui
            if (message.newMessage.conversationId === conversationId.toString())
                addNewMessages([message.newMessage]);
        });

        // get all messages (this will include any live messages caught by above code)
        const runAsync = async () => {
            addNewMessages((await ChatController.getMessages(token, conversationId))?.reverse());
        };
        runAsync();
    }, [conversationId]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.icon} source={{uri: "https://picsum.photos/400"}}/>
                <Text style={[styles.text, styles.headerTitle]}>{title}</Text>
                <Image source={options} style={styles.icon}/>
            </View>
            <ScrollView style={styles.chatbox}>
                {messages?.length > 0 ? messages.map((msg) => (
                    <View style={styles.message} key={msg.id}>
                        <View style={styles.info}>
                            <Image style={styles.icon} source={{uri: msg.sender?.imageUrl}}/>
                            <Text style={styles.user}>
                                {msg.sender?.displayName}
                            </Text>
                            <Text style={styles.user}>{ChatController.evaluateElapsed(msg.createdAt)}</Text>
                        </View>
                        <Text style={styles.messageContent}>{msg.content}</Text>
                    </View>
                )): <></> }
            </ScrollView>
            <View style={styles.interactions}>
                <TextInput
                    onChangeText={onTextChange}
                    value={text}
                    placeholder="chat"
                    style={styles.textBox}
                />
                <TouchableOpacity onPress={handleSend}>
                    <View style={styles.sendBtn}>
                        <Text style={{ color: theme.lightText }}>Send</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Chat;