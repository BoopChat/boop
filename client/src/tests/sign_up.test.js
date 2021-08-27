import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUp from "../components/login/Login";

describe("SignUp", () => {
  test("fails if input element for username does not exist", () => {
    const { getByPlaceholderText } = render(<SignUp />);
    let username_input = getByPlaceholderText("username");

    expect(username_input).toBeInTheDocument();
  });

  test("fails if input element for password does not exist", () => {
    const { getByPlaceholderText } = render(<SignUp />);
    let password_input = getByPlaceholderText("password");

    expect(password_input).toBeInTheDocument();
  });

  test("fails if sign up button does not exist", () => {
    const { getByText } = render(<SignUp />);
    let signup_btn = getByText("Sign up");

    expect(signup_btn).toBeInTheDocument();
  });

  test("fails if user enters a blank username", () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    let username_input = getByPlaceholderText("username");
    let signup_btn = getByText("Sign up");

    userEvent.type(username_input, "");
    userEvent.click(signup_btn);

    const error_element = getByText(/Please enter a username/i);
    expect(error_element).toBeInTheDocument();
  });

  test("fails if user enters a blank password", () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    let password_input = getByPlaceholderText("password");
    let signup_btn = getByText("Sign up");

    userEvent.type(password_input, "");
    userEvent.click(signup_btn);

    const error_element = getByText(/Please enter a password/i);
    expect(error_element).toBeInTheDocument();
  });

  test("fails if user enters a password with less than 8 chars", () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    let password_input = getByPlaceholderText("password");
    let signup_btn = getByText("Sign up");

    userEvent.type(password_input, "pasword");
    userEvent.click(signup_btn);

    const error_element = getByText(
      /Your password is less than 8 characters long/i
    );
    expect(error_element).toBeInTheDocument();
  });
});
