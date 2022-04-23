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
    },
    validateDisplayName: name => {
        name = name.trim();
        if (name.length < 1)
            return { valid: false, reason: "Display name cannot be blank" };
        if (!name.match(/^[0-9a-zA-z@._'#-]+$/))
            return { valid: false, reason: "Display name contains characters that are not allowed" };
        return { valid: true };
    },
    validateName: name => {
        name = name.trim();
        if (name.length < 1)
            return { valid: false, reason: "Name cannot be blank" };
        if (!name.match(/^[a-zA-z'-]+$/))
            return { valid: false, reason: "Name contains characters that are not allowed" };
        console.log(name);
        return { valid: true };
    }
};