export const SettingsController = {
    updateUser: async ({ userInfo: { firstName, lastName, displayName }, token }) => {
        // make request to update user info
        try {
            const res = await fetch("/api/user", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userInfo: { firstName, lastName, displayName } }),
            });
            const { msg } = await res.json();
            return { success: res.status === 200, msg };
        } catch (e) {
            return { success: false };
        }
    }
};