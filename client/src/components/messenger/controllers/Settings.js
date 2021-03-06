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
        if (name === null || name === undefined) return { valid: false, reason: "Display name does not exist" };

        name = name.trim();
        if (name.length < 1)
            return { valid: false, reason: "Display name cannot be blank" };
        if (!name.match(/^[0-9a-zA-Z@._'#-]+$/))
            return { valid: false, reason: "Display name contains characters that are not allowed" };
        return { valid: true };
    },
    validateName: name => {
        if (name === null || name === undefined) return { valid: false, reason: "Name does not exist" };

        name = name.trim();
        if (name.length < 1)
            return { valid: false, reason: "Name cannot be blank" };
        if (!name.match(/^[a-zA-Z'-]+$/))
            return { valid: false, reason: "Name contains characters that are not allowed" };
        return { valid: true };
    }
};