import { SettingsController } from "./Settings";

describe("Test validateName in Settings Controller", () => {
    test("fails if blank string provided", async () => {
        let { valid, reason } = SettingsController.validateName("");
        expect(valid).toBe(false);
        expect(reason).toEqual("Name cannot be blank");

        ({ valid, reason } = SettingsController.validateName(" "));
        expect(valid).toBe(false);
        expect(reason).toEqual("Name cannot be blank");
    });

    test("fails if null or undefined provided", async () => {
        let { valid, reason } = SettingsController.validateName(null);
        expect(valid).toBe(false);
        expect(reason).toEqual("Name does not exist");

        ({ valid, reason } = SettingsController.validateName());
        expect(valid).toBe(false);
        expect(reason).toEqual("Name does not exist");
    });

    test("fails if name contains a space", async () => {
        let { valid, reason } = SettingsController.validateName("ja mes");
        expect(valid).toBe(false);
        expect(reason).toEqual("Name contains characters that are not allowed");
    });

    test("fails if name contains number", async () => {
        let { valid, reason } = SettingsController.validateName("4orce");
        expect(valid).toBe(false);
        expect(reason).toEqual("Name contains characters that are not allowed");

        ({ valid, reason } = SettingsController.validateName("co4rse"));
        expect(valid).toBe(false);
        expect(reason).toEqual("Name contains characters that are not allowed");
    });

    test("passes for hyphenated names", async () => {
        let { valid } = SettingsController.validateName("king-johnson");
        expect(valid).toBe(true);

        ({ valid } = SettingsController.validateName("King-Johnson"));
        expect(valid).toBe(true);
    });

    test("passes for names with '", async () => {
        let { valid } = SettingsController.validateName("Amar'e");
        expect(valid).toBe(true);
    });

    test("fails if name contains characters that are not allowed", async () => {
        let { valid, reason } = SettingsController.validateName("$haq");
        expect(valid).toBe(false);
        expect(reason).toEqual("Name contains characters that are not allowed");

        ({ valid, reason } = SettingsController.validateName("King.Johnson"));
        expect(valid).toBe(false);
        expect(reason).toEqual("Name contains characters that are not allowed");

        ({ valid, reason } = SettingsController.validateName("King_Johnson"));
        expect(valid).toBe(false);
        expect(reason).toEqual("Name contains characters that are not allowed");

        ({ valid, reason } = SettingsController.validateName("king,johnson"));
        expect(valid).toBe(false);
        expect(reason).toEqual("Name contains characters that are not allowed");

        ({ valid, reason } = SettingsController.validateName("*"));
        expect(valid).toBe(false);
        expect(reason).toEqual("Name contains characters that are not allowed");
    });
});

describe("Test validateDisplayName in Settings Controller", () => {
    test("fails if blank string provided", async () => {
        let { valid, reason } = SettingsController.validateDisplayName("");
        expect(valid).toBe(false);
        expect(reason).toEqual("Display name cannot be blank");

        ({ valid, reason } = SettingsController.validateDisplayName(" "));
        expect(valid).toBe(false);
        expect(reason).toEqual("Display name cannot be blank");
    });

    test("fails if null or undefined provided", async () => {
        let { valid, reason } = SettingsController.validateDisplayName(null);
        expect(valid).toBe(false);
        expect(reason).toEqual("Display name does not exist");

        ({ valid, reason } = SettingsController.validateDisplayName());
        expect(valid).toBe(false);
        expect(reason).toEqual("Display name does not exist");
    });

    test("fails if display name contains a space", async () => {
        let { valid, reason } = SettingsController.validateDisplayName("the best");
        expect(valid).toBe(false);
        expect(reason).toEqual("Display name contains characters that are not allowed");
    });

    test("passes for names with allowed symbols", async () => {
        let { valid } = SettingsController.validateDisplayName("fornite-pro.");
        expect(valid).toBe(true);

        ({ valid } = SettingsController.validateDisplayName("world_boss1"));
        expect(valid).toBe(true);

        ({ valid } = SettingsController.validateDisplayName("@goat"));
        expect(valid).toBe(true);

        ({ valid } = SettingsController.validateDisplayName("#greatest"));
        expect(valid).toBe(true);

        ({ valid } = SettingsController.validateDisplayName("jones'"));
        expect(valid).toBe(true);
    });
});
