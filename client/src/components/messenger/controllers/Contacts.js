export const ContactsController = {
    getContacts: async token => {
        try {
            // make request for the contacts of user and wait for the json response
            const res = await fetch("/api/contacts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const result = await res.json();
            if (res.status !== 200)
                return { // error getting contact list ... return why
                    success: false,
                };
            else // get the list of contacts if successful
                return {
                    success: true,
                    contactList: result?.contactList ?? []
                };
        } catch (e) {
            return { success: false };
        }
    },
    evaluateStatus: lastActive => {
        if (!lastActive)
            return "offline";
        // for now status is either online or offline
        // if user not active within the last 15 seconds - offline
        let diff = Date.now() - (new Date(lastActive)).getTime();
        return diff > (15 * 1000) ? "offline": "online";
    },
    addContact: async (token, booptag) => {
        try {
            const res = await fetch("/api/contacts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    contactBooptag: booptag
                })
            });

            const result = await res.json();
            if (res.status !== 201)
                return { // contact was not added ... return reason why
                    success: false,
                    msg: result.msg
                };
            else // return new contact to add to the list ... add new contact to the back of the list
                return {
                    success: true,
                    contact: result.contact
                };
        } catch (e) {
            return {
                success: false,
                msg: e
            };
        }
    },
    startConversation: async (token, contactId) => {
        // search the database for a conversation with current user and chosen contact
        // if doesn't exist the server should create it
        // this feature is for phase 2 of the project
        const res = await fetch(null + contactId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });

        const result = await res.json();
        if (res.status !== 200)
            return {
                msg: result.msg
            };
        else
            return {
                id: result.id,
                title: result.title
            };
    },
    deleteContact: async (token, id) => {
        try {
            const res = await fetch("/api/contacts", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    contactId: id
                })
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
    validateBooptag: booptag => {
        let trimmedBooptag = booptag.trim();
        if (trimmedBooptag.length < 1)
            return { valid: false, reason: "Booptag cannot be blank" };
        if (trimmedBooptag.length !== 32)
            return { valid: false, reason: "Booptag must be 32 characters long" };
        if (!trimmedBooptag.match(/^[0-9a-fA-F]+$/))
            return { valid: false, reason: "Booptag contains characters that are not allowed" };
        return { valid: true, trimmedBooptag };
    }
};