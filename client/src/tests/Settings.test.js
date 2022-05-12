import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import Settings from "../components/messenger/Settings";


describe("Settings tab", () => {

    let userData = {
        displayName: "Cassie",
        firstName: "Cassandra",
        lastName: "Stevens",
        imageUrl: "https://picsum.photos/200"
    };

    const updateUser = userInfo => userData = userInfo;

    test("fails if unable to change first name", async () => {
        const { getByPlaceholderText, getByTitle, getByText } = render(
            <Settings userInfo={userData} updateUser={updateUser}/>
        );

        let editBtn = getByTitle("edit name");
        userEvent.click(editBtn);

        let firstNameInput = getByPlaceholderText("First Name");
        userEvent.type(firstNameInput, "s");
        userEvent.click(editBtn);

        let span = getByText("Cassandras Stevens");

        expect(span).toBeInTheDocument();
    });

    test("fails if unable to change last name", async () => {
        const { getByPlaceholderText, getByTitle, getByText } = render(
            <Settings userInfo={userData} updateUser={updateUser} />
        );

        let editBtn = getByTitle("edit name");
        userEvent.click(editBtn);

        let lastNameInput = getByPlaceholderText("Last Name");
        userEvent.clear(lastNameInput);
        userEvent.type(lastNameInput, "Stone");
        userEvent.click(editBtn);

        let span = getByText("Cassandras Stone");

        expect(span).toBeInTheDocument();
    });

    test("fails if unable to change both first and last name", async () => {
        const { getByPlaceholderText, getByTitle, getByText } = render(
            <Settings userInfo={userData} updateUser={updateUser} />
        );

        let editBtn = getByTitle("edit name");
        userEvent.click(editBtn);

        let lastNameInput = getByPlaceholderText("Last Name");
        userEvent.clear(lastNameInput);
        userEvent.type(lastNameInput, "Selma");

        let firstNameInput = getByPlaceholderText("First Name");
        userEvent.clear(firstNameInput);
        userEvent.type(firstNameInput, "Julie");

        userEvent.click(editBtn);

        let span = getByText("Julie Selma");

        expect(span).toBeInTheDocument();
    });

    test("fails if unable to change display name", async () => {
        const { getByPlaceholderText, getByTitle, getByText } = render(
            <Settings userInfo={userData} updateUser={updateUser} />
        );

        let editBtn = getByTitle("edit display name");
        userEvent.click(editBtn);

        let displayNameInput = getByPlaceholderText("Display Name");
        userEvent.clear(displayNameInput);
        userEvent.type(displayNameInput, "Julie24");

        userEvent.click(editBtn);

        let span = getByText("Julie24");

        expect(span).toBeInTheDocument();
    });

});
