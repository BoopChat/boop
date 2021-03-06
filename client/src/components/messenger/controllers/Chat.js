export const ChatController = {
    getMessages: async (token, conversationId) => {
        if (conversationId) {
            try {
                // make request for the messages of conversationid and wait for the json response
                const res = await fetch("/api/messages/" + conversationId, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status !== 200) {
                    return {
                        success: false,
                        messages: []
                    };
                }


                const data = await res.json();
                // get the list of messages if successful
                return data ? {
                    success: true,
                    messages: data.messages,
                    firstMarked: data.firstMarked
                } : {
                    success: false,
                    messages: []
                };
            } catch (e) {
                return {
                    success: false,
                    messages: []
                };
            }
        } else return {
            success: false,
            messages: []
        };
    },
    listen: (updateMessages, socket) => socket.on("newMessage", (msg) => updateMessages(msg)),
    clear: (socket) => socket?.off("newMessage"),
    listenRead: (updateMessagesRead, socket) =>
        socket.on("readMessages", (readMessages) => updateMessagesRead(readMessages)),
    clearRead: (socket) => socket?.off("readMessages"),
    evaluateElapsed: sent => {
        if (!sent && sent !== 0)
            return "Some time ago";
        // convert timestamp into an elapsed message
        let diff = Date.now() - new Date(sent).getTime();
        if (isNaN(diff))
            return "Some time ago";
        let min = 60 * 1000;
        if (diff < min) return "Less than a min ago";
        else if (diff < 60 * min) {
            let mins = Math.floor(diff / 60 / 1000);
            return mins + " min" + (mins !== 1 ? "s" : "") + " ago";
        } else if (diff < 60 * min * 24) {
            let hrs = Math.floor(diff / 60 / 60 / 1000);
            return hrs + " hr" + (hrs !== 1 ? "s" : "") + " ago";
        } else {
            let days = Math.floor(diff / 24 / 60 / 60 / 1000);
            return days + " day" + (days !== 1 ? "s" : "") + " ago";
        }
    },
    sendMessage: async (token, conversationId, message) => {
        try {
            const res = await fetch("/api/messages/" + conversationId, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content: message,
                }),
            });

            const result = await res.json();
            if (res.status !== 201)
                return {
                    // message was not added ... return reason why
                    success: false,
                    msg: result.msg,
                };
            else
                return {
                    success: true,
                };
        } catch (e) {
            return {
                success: false,
                msg: e
            };
        }
    },
    determineRead: (list, participants) => {
        // if the number of persons who have read the message is equal the number of participants in the chat
        // then everyone has read the message
        if (list?.length === participants?.length)
            return "allRead";
        else if (list?.length > 1) // if at least 1 person (other than the sender) has read the message
            return "someRead";
        else return "noneRead";
    },
    getLastReadMessageIndex: (messages, messageId) => {
        if (messageId === -1 && messages.length > 0) // all messages already read
            return messages.length - 1; // return last message

        // start from the bottom of the chat and go up until you find the last message the user has read
        for (let i = messages.length - 1; i > -1; i--) {
            if (messages[i].id === messageId)
                return i;
        }
        return -1; // chat empty
    }
};
