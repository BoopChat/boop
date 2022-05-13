import store from "./../../../redux-store/store";
import { addConversation, updateConversation, updateCurrentConversation } from "../../../redux-store/conversationSlice";
import { participantNamesMaxLength } from "./Conversations";

export const SocketController = {
    initListeners: (socket) => {
        // Adds new conversation to conversation state.
        socket.off("newConversation").on("newConversation", (convoObject) => {

            // if title is blank make 1 using the participant's display names
            if (!convoObject.conversation.title || convoObject.conversation.title.length < 1){
                let participantNames = convoObject.conversation.participants.reduce((result, p) => {
                    if (p.id !==  store.getState().user.userInfo.id){ result.push(p.displayName); }
                    return result;
                }, []).join(", ");
                convoObject.conversation.title = `You${participantNames.length > 0 ? "," : ""} ${participantNames
                    .substring(0, participantNamesMaxLength)}${
                    participantNames.length > participantNamesMaxLength ? "..." : ""
                }`;
            }

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