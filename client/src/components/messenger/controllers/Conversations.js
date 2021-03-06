// the max length of participants' names used to auto generate a title
export const participantNamesMaxLength = 25;

const evaluateDate = (lastDate) => {
    // decide whether to return the date as (d/mm/yy) or as time(\d{2}:\d{2} (A|P)M)
    // if lastDate within the last 23 hrs display time else use date format
    if (lastDate) {
        lastDate = new Date(lastDate);
        let diff = Date.now() - lastDate.getTime();

        const getDate = () => `${lastDate.getDate()} / ${lastDate.getMonth() + 1}
            / ${String(lastDate.getFullYear()).substring(2)}`;
        const getTime = () => {
            let hr = lastDate.getHours() % 12 || 12; // convert 24hr to 12hr
            // pad minutes with 0 to maintain 2 digits in mins section
            let min = (lastDate.getMinutes() < 10 ? "0" : "") + lastDate.getMinutes();
            let period = lastDate.getHours() < 11 ? "AM" : "PM"; // convert 24hr to am/pm
            return hr + ":" + min + " " + period;
        };
        return diff > 23 * 60 * 60 * 1000 ? getDate() : getTime();
    } else return "";
};

export const ConversationsController = {
    getConversations: async (token, socket, userId) => {
        // make request for the conversations of user and wait for the json response
        try {
            const res = await fetch("/api/conversations", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status !== 200) {
                return {
                    success: false,
                    conversations: []
                };
            }

            const result = await res.json();

            // send back the conversations to the server to join client to the appropriate socket rooms
            socket.emit(
                "joinConversations",
                result.conversationList.map((item) => item.id)
            );
            if (result && result.conversationList){
                for (const convo of result.conversationList) {
                    // if title is blank make 1 using the participant's display names
                    if (!convo.title || convo.title.length < 1) {
                        let participantNames = convo.participants.reduce((result, p) => {
                            if (p.id !==  userId){ result.push(p.displayName); }
                            return result;
                        }, []).join(", ");
                        convo.title = `You${participantNames.length > 0 ? "," : ""} ${participantNames
                            .substring(0, participantNamesMaxLength)}${
                            participantNames.length > participantNamesMaxLength ? "..." : ""
                        }`;
                    }
                }
                return {
                    success: true,
                    conversations: result.conversationList
                };
            } else {
                return {
                    success: false,
                    conversations: []
                };
            }
        } catch (e) {
            return {
                success: false,
                conversations: []
            };
        }
    },
    evaluateDate,
    getLastMessage: chat => {
        const { messages } = chat;
        return messages?.length > 0 ? messages[0].content : "";
    },
    getLastMessageDate: chat => {
        const { messages } = chat;
        return evaluateDate(messages?.length > 0 ? messages[0].createdAt : "");
    },
    formatLastMessage: (msg) => {
        if (!msg)
            return "";

        let formatted = msg.substring(0, 48);
        if (msg.length !== formatted.length)
            formatted += "...";

        return formatted;
    },
    createConversation: async (token, participants, title) => {
        // make request to create a conversation with participants and title
        try {
            const res = await fetch("/api/conversations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    participants,
                    title,
                }),
            });
            const { id } = await res.json();
            return { success: res.status === 201, id };
        } catch (e) {
            return { success: false };
        }
    },
    leaveConversation: async (token, conversationId, successorId) => {
        // make request to leave conversation
        try {
            const res = await fetch("/api/conversations", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    conversationId,
                    successorId,
                }),
            });

            const result = await res.json();
            return { // return msg to display to user (whether success or fail)
                msg: result.msg,
                success: res.status === 200
            };
        } catch (e) {
            return {
                msg: e,
                success: false
            };
        }
    },
    addUserToConversation: async (token, conversationId, newParticipants) => {
        // make request to user(s) to the conversation
        try {
            const res = await fetch("/api/conversations", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ conversationId, newParticipants }),
            });

            const result = await res.json();
            return { // return msg to display to user (whether success or fail)
                msg: result.msg,
                success: res.status === 201
            };
        } catch (e) {
            return {
                msg: e,
                success: false
            };
        }
    }
};