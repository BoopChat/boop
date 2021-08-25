import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from "../screens/login";

describe("Login", () => {

    test("fails if input element for username does not exist", () => {
        const { getByPlaceholderText } = render(<Login />);
        let username_input = getByPlaceholderText("username");

        expect(username_input).toBeInTheDocument();
    })

    test("fails if input element for password does not exist", () => {
        const { getByPlaceholderText } = render(<Login />);
        let password_input = getByPlaceholderText("password");

        expect(password_input).toBeInTheDocument();
    })

    test("fails if login button does not exist", () => {
        const { getByText } = render(<Login />);
        let login_btn = getByText("Login");

        expect(login_btn).toBeInTheDocument();
    })

    test('fails if user enters a blank username', () => {
        const { getByPlaceholderText, getByText } = render(<Login />);
        let username_input = getByPlaceholderText("username")
        let login_btn = getByText("Login")

        userEvent.type(username_input, "")
        userEvent.click(login_btn)

        const error_element = getByText(/Please enter your username/i);
        expect(error_element).toBeInTheDocument();
    });

    test('fails if user enters a blank password', () => {
        const { getByPlaceholderText, getByText } = render(<Login />);
        let password_input = getByPlaceholderText("password")
        let login_btn = getByText("Login")

        userEvent.type(password_input, "")
        userEvent.click(login_btn)

        const error_element = getByText(/Please enter your password/i);
        expect(error_element).toBeInTheDocument();
    });

    test("fails if user enters a password with less than 8 chars", () => {
        const { getByPlaceholderText, getByText } = render(<Login />);
        let password_input = getByPlaceholderText("password")
        let login_btn = getByText("Login")

        userEvent.type(password_input, "pasword")
        userEvent.click(login_btn)

        const error_element = getByText(/Your password is less than 8 characters long/i);
        expect(error_element).toBeInTheDocument();
    });

})
