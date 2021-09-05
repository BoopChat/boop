import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Settings from '../components/messenger/Settings';

describe("Settings tab", () => {

    // test('fails if unable to change first name', async () => {
    //     const { getByPlaceholderText, getByTitle, getByText } = render(<Settings />);

    //     let editBtn = getByTitle("edit name");
    //     userEvent.click(editBtn);
        
    //     let firstNameInput = getByPlaceholderText("First Name")
    //     userEvent.type(firstNameInput, "s");
    //     userEvent.click(editBtn);

    //     let span = getByText("Cassandras Stevens")

    //     expect(span).toBeInTheDocument()
    // });

    // test('fails if unable to change last name', async () => {
    //     const { getByPlaceholderText, getByTitle, getByText } = render(<Settings />);

    //     let editBtn = getByTitle("edit name");
    //     userEvent.click(editBtn);
        
    //     let lastNameInput = getByPlaceholderText("Last Name")
    //     userEvent.clear(lastNameInput)
    //     userEvent.type(lastNameInput, "Stone");
    //     await userEvent.click(editBtn);

    //     let span = getByText("Cassandra Stone")

    //     expect(span).toBeInTheDocument()
    // });

})
