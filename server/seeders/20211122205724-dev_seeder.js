"use strict";
// environment variables configuration
const dotenv = require("dotenv");
dotenv.config();

const db = require("../models");
const User = db.User;
const SigninOption = db.SigninOption;
const Contact = db.Contact;
const Conversation = db.Conversation;
const Participant = db.Participant;
const Message = db.Message;

module.exports = {
    up: async () => {
        console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`);
        if (process.env.NODE_ENV === "development"){ // seeder can only run in development
            // delete any existing entries and reset any auto-incrementing keys
            await Message.sync({ force: true });
            await Participant.sync({ force: true });
            await Conversation.sync({ force: true });
            await Contact.sync({ force: true });
            await SigninOption.sync({ force: true });
            await User.sync({ force: true });

            console.log("All messages, conversations, contacts and users have been deleted from the database.");

            let configEmail = process.env.USER_INFO_EMAIL;
            let configFirstName = process.env.USER_INFO_FIRST_NAME;
            let configLastName = process.env.USER_INFO_LAST_NAME;

            const users = [
                {
                    displayName: `${configEmail}@gmail.com`,
                    firstName: configFirstName,
                    lastName: configLastName,
                    imageUrl: `https://robohash.org/${configEmail}`,
                },
                {
                    displayName: `${configEmail}_bff1@gmail.com`,
                    firstName: `${configFirstName}BFF1`,
                    lastName: `${configLastName}BFF1`,
                    imageUrl: `https://robohash.org/${configEmail}_bff1`,
                },
                {
                    displayName: `${configEmail}_bff2@gmail.com`,
                    firstName: `${configFirstName}BFF2`,
                    lastName: `${configLastName}BFF2`,
                    imageUrl: `https://robohash.org/${configEmail}_bff2`,
                },
                {
                    displayName: `${configEmail}_bff3@gmail.com`,
                    firstName: `${configFirstName}BFF3`,
                    lastName: `${configLastName}BFF3`,
                    imageUrl: `https://robohash.org/${configEmail}_bff3`,
                },
                {
                    displayName: `${configEmail}_bff4@gmail.com`,
                    firstName: `${configFirstName}BFF4`,
                    lastName: `${configLastName}BFF4`,
                    imageUrl: `https://robohash.org/${configEmail}_bff4`,
                },
                {
                    displayName: `${configEmail}_bff5@gmail.com`,
                    firstName: `${configFirstName}BFF5`,
                    lastName: `${configLastName}BFF5`,
                    imageUrl: `https://robohash.org/${configEmail}_bff5`,
                },
                {
                    displayName: `${configEmail}_bff6@gmail.com`,
                    firstName: `${configFirstName}BFF6`,
                    lastName: `${configLastName}BFF6`,
                    imageUrl: `https://robohash.org/${configEmail}_bff6`,
                },
                {
                    displayName: `${configEmail}_bff7@gmail.com`,
                    firstName: `${configFirstName}BFF7`,
                    lastName: `${configLastName}BFF7`,
                    imageUrl: `https://robohash.org/${configEmail}_bff7`,
                },
                {
                    displayName: `${configEmail}_bff8@gmail.com`,
                    firstName: `${configFirstName}BFF8`,
                    lastName: `${configLastName}BFF8`,
                    imageUrl: `https://robohash.org/${configEmail}_bff8`,
                },
                {
                    displayName: `${configEmail}_bff9@gmail.com`,
                    firstName: `${configFirstName}BFF9`,
                    lastName: `${configLastName}BFF9`,
                    imageUrl: `https://robohash.org/${configEmail}_bff9`,
                },
                {
                    displayName: `${configEmail}_bff10@gmail.com`,
                    firstName: `${configFirstName}BFF10`,
                    lastName: `${configLastName}BFF10`,
                    imageUrl: `https://robohash.org/${configEmail}_bff10`,
                },
            ];

            let newUsers = await User.bulkCreate(users, { returning: true });
            const mainUser = newUsers[0].id;
            const bff1 = newUsers[1].id;
            const bff2 = newUsers[2].id;
            const bff3 = newUsers[3].id;
            const bff4 = newUsers[4].id;
            const bff5 = newUsers[5].id;
            const bff6 = newUsers[6].id;
            const bff7 = newUsers[7].id;
            const bff8 = newUsers[8].id;
            const bff9 = newUsers[9].id;
            const bff10 = newUsers[10].id;

            const signinOptions = [
                {
                    serviceName: "Google",
                    email: `${configEmail}@gmail.com`,
                    userId: mainUser
                },
                {
                    serviceName: "Google",
                    email: `${configEmail}_bff1@gmail.com`,
                    userId: bff1
                },
                {
                    serviceName: "Google",
                    email: `${configEmail}_bff2@gmail.com`,
                    userId: bff2
                },
                {
                    serviceName: "Google",
                    email: `${configEmail}_bff3@gmail.com`,
                    userId: bff3
                },
                {
                    serviceName: "Google",
                    email: `${configEmail}_bff4@gmail.com`,
                    userId: bff4
                },
                {
                    serviceName: "Google",
                    email: `${configEmail}_bff5@gmail.com`,
                    userId: bff5
                },
                {
                    serviceName: "Google",
                    email: `${configEmail}_bff6@gmail.com`,
                    userId: bff6
                },
                {
                    serviceName: "Google",
                    email: `${configEmail}_bff7@gmail.com`,
                    userId: bff7
                },
                {
                    serviceName: "Google",
                    email: `${configEmail}_bff8@gmail.com`,
                    userId: bff8
                },
                {
                    serviceName: "Google",
                    email: `${configEmail}_bff9@gmail.com`,
                    userId: bff9
                },
                {
                    serviceName: "Google",
                    email: `${configEmail}_bff10@gmail.com`,
                    userId: bff10
                }
            ];

            await SigninOption.bulkCreate(signinOptions);

            let contacts = [
                {
                    userId: mainUser,
                    contactId: bff1
                },
                {
                    userId: mainUser,
                    contactId: bff2
                },
                {
                    userId: mainUser,
                    contactId: bff3
                },
                {
                    userId: mainUser,
                    contactId: bff4
                },
                {
                    userId: mainUser,
                    contactId: bff5
                }
            ];

            await Contact.bulkCreate(contacts);

            let conversations = [
                {
                    title: "Convo w/ BFF1",
                    imageUrl: `https://robohash.org/${configEmail}_bff1?set=set3`
                },
                {
                    title: "Convo w/ BFF2",
                    imageUrl: `https://robohash.org/${configEmail}_bff2?set=set3`
                },
                {
                    title: "Convo w/ BFF3",
                    imageUrl: `https://robohash.org/${configEmail}_bff3?set=set3`
                },
                {
                    title: "Convo w/ BFF4",
                    imageUrl: `https://robohash.org/${configEmail}_bff4?set=set3`
                },
                {
                    title: "Convo w/ BFF5",
                    imageUrl: `https://robohash.org/${configEmail}_bff5?set=set3`
                },
                {
                    title: "All the BFFS",
                    imageUrl: `https://robohash.org/${configEmail}?set=set3`
                }
            ];

            let newConversations = await Conversation.bulkCreate(conversations);
            let conv1 = newConversations[0].id;
            let conv2 = newConversations[1].id;
            let conv3 = newConversations[2].id;
            let conv4 = newConversations[3].id;
            let conv5 = newConversations[4].id;
            let conv6 = newConversations[5].id;

            let participants = [
                {
                    userId: mainUser,
                    conversationId: conv1,
                    isAdmin: true
                },
                {
                    userId: bff1,
                    conversationId: conv1,
                    isAdmin: true
                },

                {
                    userId: mainUser,
                    conversationId: conv2,
                    isAdmin: true
                },
                {
                    userId: bff2,
                    conversationId: conv2,
                    isAdmin: true
                },

                {
                    userId: mainUser,
                    conversationId: conv3,
                    isAdmin: true
                },
                {
                    userId: bff3,
                    conversationId: conv3,
                    isAdmin: true
                },

                {
                    userId: mainUser,
                    conversationId: conv4,
                    isAdmin: true
                },
                {
                    userId: bff4,
                    conversationId: conv4,
                    isAdmin: true
                },

                {
                    userId: mainUser,
                    conversationId: conv5,
                    isAdmin: true
                },
                {
                    userId: bff5,
                    conversationId: conv5,
                    isAdmin: true
                },

                {
                    userId: mainUser,
                    conversationId: conv6,
                    isAdmin: true
                },
                {
                    userId: bff1,
                    conversationId: conv6
                },
                {
                    userId: bff2,
                    conversationId: conv6
                },
                {
                    userId: bff3,
                    conversationId: conv6
                },
                {
                    userId: bff4,
                    conversationId: conv6
                },
                {
                    userId: bff5,
                    conversationId: conv6
                }
            ];

            await Participant.bulkCreate(participants);

            let messages = [
                {
                    senderId: mainUser,
                    conversationId: conv1,
                    content: "Hey",
                    createdAt: new Date(2021, 10, 23, 9, 0, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 0, 0, 0)
                },
                {
                    senderId: bff1,
                    conversationId: conv1,
                    content: "Hi",
                    createdAt: new Date(2021, 10, 23, 9, 1, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 1, 0, 0)
                },
                {
                    senderId: mainUser,
                    conversationId: conv1,
                    content: "How are you BFF1?",
                    createdAt: new Date(2021, 10, 23, 9, 2, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 2, 0, 0)
                },
                {
                    senderId: bff1,
                    conversationId: conv1,
                    content: "I'm good, bud",
                    createdAt: new Date(2021, 10, 23, 9, 3, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 3, 0, 0)
                },

                {
                    senderId: mainUser,
                    conversationId: conv2,
                    content: "Hey",
                    createdAt: new Date(2021, 10, 23, 9, 4, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 4, 0, 0)
                },
                {
                    senderId: bff2,
                    conversationId: conv2,
                    content: "Hi",
                    createdAt: new Date(2021, 10, 23, 9, 5, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 5, 0, 0)
                },
                {
                    senderId: mainUser,
                    conversationId: conv2,
                    content: "How are you BFF2?",
                    createdAt: new Date(2021, 10, 23, 9, 6, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 6, 0, 0)
                },
                {
                    senderId: bff2,
                    conversationId: conv2,
                    content: "I'm great, dude",
                    createdAt: new Date(2021, 10, 23, 9, 7, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 7, 0, 0)
                },

                {
                    senderId: mainUser,
                    conversationId: conv3,
                    content: "Hey",
                    createdAt: new Date(2021, 10, 23, 9, 8, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 8, 0, 0)
                },
                {
                    senderId: bff3,
                    conversationId: conv3,
                    content: "Hi",
                    createdAt: new Date(2021, 10, 23, 9, 9, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 9, 0, 0)
                },
                {
                    senderId: mainUser,
                    conversationId: conv3,
                    content: "How are you BFF3?",
                    createdAt: new Date(2021, 10, 23, 9, 10, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 10, 0, 0)
                },
                {
                    senderId: bff3,
                    conversationId: conv3,
                    content: "I'm ok, buddy",
                    createdAt: new Date(2021, 10, 23, 9, 11, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 11, 0, 0)
                },

                {
                    senderId: mainUser,
                    conversationId: conv4,
                    content: "Hey",
                    createdAt: new Date(2021, 10, 23, 9, 12, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 12, 0, 0)
                },
                {
                    senderId: bff4,
                    conversationId: conv4,
                    content: "Hi",
                    createdAt: new Date(2021, 10, 23, 9, 13, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 13, 0, 0)
                },
                {
                    senderId: mainUser,
                    conversationId: conv4,
                    content: "How are you BFF4?",
                    createdAt: new Date(2021, 10, 23, 9, 14, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 14, 0, 0)
                },
                {
                    senderId: bff4,
                    conversationId: conv4,
                    content: "Estoy bien, amigo",
                    createdAt: new Date(2021, 10, 23, 9, 15, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 15, 0, 0)
                },

                {
                    senderId: mainUser,
                    conversationId: conv5,
                    content: "Hey",
                    createdAt: new Date(2021, 10, 23, 9, 16, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 16, 0, 0)
                },
                {
                    senderId: bff5,
                    conversationId: conv5,
                    content: "Hi",
                    createdAt: new Date(2021, 10, 23, 9, 17, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 17, 0, 0)
                },
                {
                    senderId: mainUser,
                    conversationId: conv5,
                    content: "How are you BFF5?",
                    createdAt: new Date(2021, 10, 23, 9, 18, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 18, 0, 0)
                },
                {
                    senderId: bff5,
                    conversationId: conv5,
                    content: "Je vais bien, mon ami",
                    createdAt: new Date(2021, 10, 23, 9, 19, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 19, 0, 0)
                },

                {
                    senderId: mainUser,
                    conversationId: conv6,
                    content: "Hey everyone!",
                    createdAt: new Date(2021, 10, 23, 9, 20, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 20, 0, 0)
                },
                {
                    senderId: bff1,
                    conversationId: conv6,
                    content: "Hey tout moun!",
                    createdAt: new Date(2021, 10, 23, 9, 21, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 21, 0, 0)
                },
                {
                    senderId: bff2,
                    conversationId: conv6,
                    content: "Hallo allerseits!",
                    createdAt: new Date(2021, 10, 23, 9, 22, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 22, 0, 0)
                },
                {
                    senderId: bff3,
                    conversationId: conv6,
                    content: "Ei pessoal!",
                    createdAt: new Date(2021, 10, 23, 9, 23, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 23, 0, 0)
                },
                {
                    senderId: bff4,
                    conversationId: conv6,
                    content: "Hola a todos!",
                    createdAt: new Date(2021, 10, 23, 9, 24, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 24, 0, 0)
                },
                {
                    senderId: bff5,
                    conversationId: conv6,
                    content: "Salut tout le monde!",
                    createdAt: new Date(2021, 10, 23, 9, 25, 0, 0),
                    updatedAt: new Date(2021, 10, 23, 9, 25, 0, 0)
                }

            ];

            await Message.bulkCreate(messages);

            console.log("Congratulations! You now have 5 BFFS! There are 5 more waiting to be added.");
        } else {
            console.log("Seeders can only run in development");
        }
    },

    down: async () => {
        if (process.env.NODE_ENV === "development"){ // seeder can only run in development
            await Message.sync({ force: true });
            await Participant.sync({ force: true });
            await Conversation.sync({ force: true });
            await Contact.sync({ force: true });
            await SigninOption.sync({ force: true });
            await User.sync({ force: true });

            console.log("All messages, conversations, contacts and users have been deleted from the database.");
        } else {
            console.log("Seeders can only run in development");
        }
    }
};
