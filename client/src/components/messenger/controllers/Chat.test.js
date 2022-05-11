import { ChatController } from "./Chat";

describe("Test evaluateElapsed in Chat Controller", () => {
    test("passes if correct elapsed message for falsy values", async () => {
        let elapsed = ChatController.evaluateElapsed("");
        expect(elapsed).toEqual("Some time ago");

        elapsed = ChatController.evaluateElapsed();
        expect(elapsed).toEqual("Some time ago");

        elapsed = ChatController.evaluateElapsed(null);
        expect(elapsed).toEqual("Some time ago");
    });

    test("passes if correct elapsed message for times within a minute", async () => {
        let elapsed = ChatController.evaluateElapsed(Date.now() - (12 * 1000));
        expect(elapsed).toEqual("Less than a min ago");

        elapsed = ChatController.evaluateElapsed(new Date(Date.now() - (42 * 1000)));
        expect(elapsed).toEqual("Less than a min ago");
    });

    test("passes if correct elapsed message for times within an hour", async () => {
        const min = 60 * 1000;

        let elapsed = ChatController.evaluateElapsed(Date.now() - (50 * min));
        expect(elapsed).toEqual("50 mins ago");

        elapsed = ChatController.evaluateElapsed(Date.now() - min);
        expect(elapsed).toEqual("1 min ago");

        elapsed = ChatController.evaluateElapsed(new Date(Date.now() - (28 * min)));
        expect(elapsed).toEqual("28 mins ago");
    });

    test("passes if correct elapsed message for times within a day", async () => {
        const hr = 60 * 60 * 1000;

        let elapsed = ChatController.evaluateElapsed(Date.now() - (2 * hr));
        expect(elapsed).toEqual("2 hrs ago");

        elapsed = ChatController.evaluateElapsed(Date.now() - hr);
        expect(elapsed).toEqual("1 hr ago");

        elapsed = ChatController.evaluateElapsed(new Date(Date.now() - (12 * hr)));
        expect(elapsed).toEqual("12 hrs ago");
    });

    test("passes if correct elapsed message for times over days", async () => {
        const day = 24 * 60 * 60 * 1000;

        let elapsed = ChatController.evaluateElapsed(Date.now() - (5 * day));
        expect(elapsed).toEqual("5 days ago");

        elapsed = ChatController.evaluateElapsed(Date.now() - day);
        expect(elapsed).toEqual("1 day ago");

        elapsed = ChatController.evaluateElapsed(new Date(Date.now() - (49 * day)));
        expect(elapsed).toEqual("49 days ago");
    });
});