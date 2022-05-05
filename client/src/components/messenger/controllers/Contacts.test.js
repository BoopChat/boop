import { ContactsController } from "./Contacts";

describe("Test evaluateStatus in Contacts Controller", () => {
    test("passes if defaults to offline when falsy value provided", async () => {
        let status = ContactsController.evaluateStatus("");
        expect(status).toEqual("offline");

        status = ContactsController.evaluateStatus();
        expect(status).toEqual("offline");

        status = ContactsController.evaluateStatus(null);
        expect(status).toEqual("offline");
    });

    test("fails if online is not returned for last active time within 15 seconds", async () => {
        let tenSecs = Date.now() - 10 * 1000;
        let status = ContactsController.evaluateStatus(new Date(tenSecs));
        expect(status).toEqual("online");

        let fiveSecs = Date.now() - 5 * 1000;
        status = ContactsController.evaluateStatus(new Date(fiveSecs));
        expect(status).toEqual("online");

        let thirteenSecs = Date.now() - 13 * 1000;
        status = ContactsController.evaluateStatus(new Date(thirteenSecs));
        expect(status).toEqual("online");

        let twoSecs = Date.now() - 2 * 1000;
        status = ContactsController.evaluateStatus(new Date(twoSecs));
        expect(status).toEqual("online");
    });

    test("fails if offline is not returned for last active time beyond 15 seconds", async () => {
        let status = ContactsController.evaluateStatus("2022-04-26T20:06:21.566Z");
        expect(status).toEqual("offline");

        status = ContactsController.evaluateStatus("2021-10-02T16:12:56.176Z");
        expect(status).toEqual("offline");

        status = ContactsController.evaluateStatus("2021-09-29T22:50:19.587Z");
        expect(status).toEqual("offline");

        let fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
        status = ContactsController.evaluateStatus(fifteenMinsAgo);
        expect(status).toEqual("offline");

        let sixteenSecsAgo = new Date(Date.now() - 16 * 1000);
        status = ContactsController.evaluateStatus(sixteenSecsAgo);
        expect(status).toEqual("offline");
    });
});

describe("Test validateBooptag in Contacts Controller", () => {
    test("fails if null or undefined provided", async () => {
        let { valid, reason } = ContactsController.validateBooptag(null);
        expect(valid).toBe(false);
        expect(reason).toEqual("Booptag does not exist");

        ({ valid, reason } = ContactsController.validateBooptag());
        expect(valid).toBe(false);
        expect(reason).toEqual("Booptag does not exist");
    });

    test("fails if blank string provided", async () => {
        let { valid, reason } = ContactsController.validateBooptag("");
        expect(valid).toBe(false);
        expect(reason).toEqual("Booptag cannot be blank");

        ({ valid, reason } = ContactsController.validateBooptag(" "));
        expect(valid).toBe(false);
        expect(reason).toEqual("Booptag cannot be blank");
    });

    test("fails if booptag is not equal to 32 characters", async () => {
        let { valid, reason } = ContactsController.validateBooptag("ffda3ac72e84ef8daf92f95870e8980d32");
        expect(valid).toBe(false);
        expect(reason).toEqual("Booptag must be 32 characters long");

        ({ valid, reason } =
            ContactsController.validateBooptag("f23b635f5c2ffe2452b76ff897922e20196096f2135ffd7b951fc138030581e2"));
        expect(valid).toBe(false);
        expect(reason).toEqual("Booptag must be 32 characters long");

        ({ valid, reason } =  ContactsController.validateBooptag("f23"));
        expect(valid).toBe(false);
        expect(reason).toEqual("Booptag must be 32 characters long");

        ({ valid, reason } =  ContactsController.validateBooptag("ffda3ac72e84ef8daf92f95870e8980d3"));
        expect(valid).toBe(false);
        expect(reason).toEqual("Booptag must be 32 characters long");

        ({ valid, reason } =  ContactsController.validateBooptag("ffda3ac72e84ef8daf92f95870e8980"));
        expect(valid).toBe(false);
        expect(reason).toEqual("Booptag must be 32 characters long");
    });

    test("fails if booptag contains invalid characters", async () => {
        let { valid, reason } = ContactsController.validateBooptag("ffda3ac72e84ef8daf92f95870e8980z");
        expect(valid).toBe(false);
        expect(reason).toEqual("Booptag contains characters that are not allowed");

        ({ valid, reason } =  ContactsController.validateBooptag("f23b635f5cgffe2452b76ff89792te20"));
        expect(valid).toBe(false);
        expect(reason).toEqual("Booptag contains characters that are not allowed");

        ({ valid, reason } =  ContactsController.validateBooptag("19609&f2135ffd7b951*c138$30581e2"));
        expect(valid).toBe(false);
        expect(reason).toEqual("Booptag contains characters that are not allowed");
    });
});