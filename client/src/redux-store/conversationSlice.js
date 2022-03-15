import { createSlice } from "@reduxjs/toolkit";

// Conversation global state
export const conversationSlice = createSlice({
    name: "conversations",
    initialState: {
        conversations: [],
        currentConversation: {},
        showChat: false
    },
    reducers: {
        // Sets all conversations (UI conversation list)
        setConversations: (state, action) => {
            state.conversations = action.payload ?? [];
        },
        // Removes a conversation (UI conversation list)
        removeConversation: (state, action) => {
            state.conversations = state.conversations.filter(conversation => conversation.id !== action.payload);
        },
        // Adds a new conversation (UI conversation list)
        addConversation: (state, action) => {
            // ensure no duplicates are added
            state.conversations = state.conversations.find(convo => convo.id === action.payload.id)
                ? state.conversations : [...state.conversations, action.payload];
        },
        // Updates a conversation (UI conversation list)
        updateConversation: (state, action) => {
            state.conversations = state.conversations.map((conversation) => {
                return (conversation.id === action.payload.id) ? action.payload : conversation;
            });
        },
        // updates the last message in the conversation, when a new message arrives after fetching the convo list
        updateLastMessage: (state, action) => {
            const index = state.conversations.findIndex(({ id }) => id === action.payload.conversationId);
            state.conversations[index].messages[0] = action.payload.lastMessage;
        },
        // Sets the currently selected conversation (main chat window)
        setCurrentConversation: (state, action) => {
            state.currentConversation = state.conversations.find(convo => convo.id === action.payload);
            state.showChat = true;
        },
        // Updates the currently selected conversation (main chat window)
        updateCurrentConversation: (state, action) => {
            state.currentConversation = action.payload;
        },
        // Show/Hide the main chat window
        setShowChat: (state, action) => {
            state.showChat = action.payload;
        }
    },
});

export const {
    setConversations,
    removeConversation,
    addConversation,
    setShowChat,
    updateConversation,
    updateLastMessage,
    setCurrentConversation,
    updateCurrentConversation
} = conversationSlice.actions;
export default conversationSlice.reducer;