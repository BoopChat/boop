import config from "../../../config.json"

export const ContactsController = {
    getContacts: async token => {
        // make request for the contacts of user and wait for the json response
        const res = await fetch(config.SERVER_ADDR + "api/contacts", {
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
    },
    evaluateStatus: lastActive => {
        if (!lastActive)
            return "offline";
        // for now status is either online or offline
        // if user not active within the last 5mins - offline
        let diff = Date.now() - (new Date(lastActive)).getTime();
        return diff > (5 * 60 * 1000) ? "offline": "online";
    },
    addContact: async (token, email) => {
        const res = await fetch(config.SERVER_ADDR + "api/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                contactEmail: email
            })
        });

        const result = await res.json();
        if (res.status !== 201)
            return { // contact was not added ... return reason why
                success: false,
                msg: result.message
            };
        else // return new contact to add to the list ... add new contact to the back of the list
            return {
                success: true,
                contact: result.contact
            };
    },
    deleteContact: async (token, id) => {
        const res = await fetch(config.SERVER_ADDR + "api/contacts", {
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
            success: result.status === 200
        };
    }
};