import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';

import { useTheme } from '../../ThemeContext';
import themes from "../../colors";
import ContactItem from "./ContactItem";
import { ContactsController } from "./Controllers/ContactsController"

const Contacts = ({ token, navigation }) => {
    const darkTheme = useTheme();
    const [theme, setTheme] = useState(darkTheme ? themes.dark : themes.light);
    useEffect(() => setTheme(darkTheme ? themes.dark : themes.light), [darkTheme]);

    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        const runAsync = async () => {
            let contacts = await ContactsController.getContacts(token);
            setContacts(contacts.success ? contacts.contactList : []);
        }
        runAsync();
    }, []);

    const styles = StyleSheet.create({
        title: {
            fontSize: 32,
            color: theme.text
        },
        container: {
            backgroundColor: theme.bg,
        }
    });

    const refreshContactList = () => {
        const runAsync = async () => {
            let contacts = await ContactsController.getContacts(token);
            setContacts(contacts.success ? contacts.contactList : []);
        };
        runAsync();
    };

    return (
        <ScrollView style={styles.container}>
            {
                contacts.length > 0 ? contacts.map((contact, i) => {
                    return (
                        <ContactItem
                            img={contact.contactInfo.imageUrl}
                            username={contact.contactInfo.displayName}
                            status={ContactsController.evaluateStatus(contact.contactInfo.lastActive)}
                            id={contact.contactId}
                            triggerRefresh={refreshContactList}
                            key={i}
                        />
                    )
                }) : <Text>You have no contacts :(</Text>
            }
        </ScrollView>
    );
}

export default Contacts;