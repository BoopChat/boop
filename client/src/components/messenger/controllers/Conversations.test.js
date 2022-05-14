import { ConversationsController } from "./Conversations";

describe("Test evaluateElapsed in Conversations Controller", () => {
    test("passes if blank string returned for falsy values", async () => {
        let elapsed = ConversationsController.evaluateDate("");
        expect(elapsed).toEqual("");

        elapsed = ConversationsController.evaluateDate();
        expect(elapsed).toEqual("");

        elapsed = ConversationsController.evaluateDate(null);
        expect(elapsed).toEqual("");
    });

    test("passes if correct date format returned for a given time", async () => {
        const dateFormat = /\d{1,2}\s+\/\s+\d{1,2}\s+\/\s+\d{2}/;
        const timeFormat = /\d{1,2}:\d{2} (A|P)M/;

        let fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000);
        let elapsed = ConversationsController.evaluateDate(fiveDaysAgo);
        expect(elapsed).toMatch(dateFormat);

        let twentyDaysAgo = Date.now() - (20 * 24 * 60 * 60 * 1000);
        elapsed = ConversationsController.evaluateDate(twentyDaysAgo);
        expect(elapsed).toMatch(dateFormat);

        elapsed = ConversationsController.evaluateDate("2022-04-26T20:06:21.566Z");
        expect(elapsed).toMatch(dateFormat);

        elapsed = ConversationsController.evaluateDate(Date.now() - (60 * 1000));
        expect(elapsed).toMatch(timeFormat);

        elapsed = ConversationsController.evaluateDate(Date.now() - (45 * 60 * 1000));
        expect(elapsed).toMatch(timeFormat);

        elapsed = ConversationsController.evaluateDate(Date.now() - (8 * 60 * 60 * 1000));
        expect(elapsed).toMatch(timeFormat);
    });
});

describe("Test formatLastMessage in Conversations Controller", () => {
    test("passes if blank string returned for falsy values", async () => {
        let formattedMsg = ConversationsController.formatLastMessage("");
        expect(formattedMsg).toEqual("");

        formattedMsg = ConversationsController.formatLastMessage();
        expect(formattedMsg).toEqual("");

        formattedMsg = ConversationsController.formatLastMessage(null);
        expect(formattedMsg).toEqual("");
    });

    test("passes if message is truncated and ellipsis added", async () => {
        let formattedMsg = ConversationsController
            .formatLastMessage("i needed a longer than usual message to test out a stretch thing");
        expect(formattedMsg).toEqual("i needed a longer than usual message to test out...");

        formattedMsg = ConversationsController.formatLastMessage("a".repeat(100));
        expect(formattedMsg).toEqual("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa...");
    });

    test("fails if original message is not returned", async () => {
        let formattedMsg = ConversationsController.formatLastMessage("i needed a short message to test");
        expect(formattedMsg).toEqual("i needed a short message to test");

        formattedMsg = ConversationsController.formatLastMessage("b".repeat(48));
        expect(formattedMsg).toEqual("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
    });
});