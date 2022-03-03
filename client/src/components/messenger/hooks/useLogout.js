import { useDispatch } from "react-redux";
import { logOut } from "../../login/userSlice";

const useLogout = () => {
    // Used to send actions to the redux store to change its state
    const dispatch = useDispatch();

    // handles logout
    // deletes access token cookie from browser
    // dispatches logOut action
    const handleLogOut = async () => {
        const res = await fetch("/api/login/auth/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        const { success } = data;

        if (success) {
            // Logs the user out.
            dispatch(logOut());
        }
    };

    return { handleLogOut };
};

export default useLogout;