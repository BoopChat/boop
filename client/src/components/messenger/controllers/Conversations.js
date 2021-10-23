let socket;

export const ConversationsController = {
    init: (soc) => {
        socket = soc;
    },
    getConversations: async (token, updateConversation) => {
        // make request for the conversations of user and wait for the json response
        const res = await fetch("/api/conversations", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        // const result = await res.json();
        socket.on("conversationList", (list) => updateConversation(list));
        return res.status !== 200;
    },
    evaluateDate: (lastDate) => {
        // decide whether to return the date as (d/mm/yy) or as time(\d{2}:\d{2} (A|P)M)
        // if lastDate within the last 23 hrs display time else use date format
        if (lastDate) {
            lastDate = new Date(lastDate);
            let diff = Date.now() - lastDate.getTime();

            const getDate = () => `${lastDate.getDate()} / ${lastDate.getMonth() + 1}
                / ${lastDate.getFullYear().substring(2)}`;
            const getTime = () => {
                let hr = lastDate.getHours() % 12 || 12; // convert 24hr to 12hr
                // pad minutes with 0 to maintain 2 digits in mins section
                let min = (lastDate.getMinutes() < 10 ? "0" : "") + lastDate.getMinutes();
                let period = lastDate.getHours() < 11 ? "AM" : "PM"; // convert 24hr to am/pm
                return hr + ":" + min + " " + period;
            };
            return diff > 23 * 60 * 60 * 1000 ? getDate() : getTime();
        } else return "";
    },
    createConversation: async (token, participants, title, updateConversation) => {
        // make request to create a conversation with participants and title
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

        socket.on("newConversation", (list) => updateConversation([list]));
        return res.status !== 201;
    },
    leaveConversation: async (token, conversationId, successorId) => {
        // make request to leave conversation
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
        return {
            // return msg to display to user (whether success or fail)
            msg: result.msg,
            success: result.status === 200,
        };
    },
};
