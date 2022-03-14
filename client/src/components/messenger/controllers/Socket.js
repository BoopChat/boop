import store from "./../../../redux-store/store";
import { addConversation, updateConversation, updateCurrentConversation } from "../../../redux-store/conversationSlice";

export const SocketController = {
    initListeners: (socket) => {
        // Adds new conversation to conversation state.
        socket.off("newConversation").on("newConversation", (convoObject) => {
            store.dispatch(addConversation(convoObject.conversation));
            // send back the conversation to the server to join client to that socket rooms
            socket.emit("joinConversations", [convoObject.conversation.id]);
        });
        // Updates conversations with newly added participants.
        socket.off("newConversationParticipants").on("newConversationParticipants", ({ conversation }) => {
            store.dispatch(updateConversation(conversation));
            store.dispatch(updateCurrentConversation(conversation));
        });
        // Updates conversation by removing participants who left the chat.
        socket.off("leaveConversation").on("leaveConversation", ({ conversation }) => {
            store.dispatch(updateConversation(conversation));
            store.dispatch(updateCurrentConversation(conversation));
        });
    }
};