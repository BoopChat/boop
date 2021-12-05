const ACTIONS = {
    USER: "updateUser",
    TOKEN: "updateToken",
    CLEAR: "clearData"
};

export default Reducer = {
    reducer: (state, action) => {
        switch(action.type) {
            case ACTIONS.USER:
                return {
                    ...state,
                    userInfo: action.payload
                };
            case ACTIONS.TOKEN:
                return {
                    ...state,
                    token: action.payload
                };
            case ACTIONS.CLEAR:
                return {
                    userInfo: {},
                    token: "",
                };
            default:
                return state;
        }
    },
    ACTIONS
};