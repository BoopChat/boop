import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe("Landing Page", () => {

    test('fails if does not renders signup component', () => {
        // simply check for the expected h1 content from signup component
        const { getByText } = render(<App />);
        const h1 = getByText(/create account/i);
        expect(h1).toBeInTheDocument();
    });

    test('fails if does not switch to signin component', () => {
        // check for the expected h1 content of the signin component
        // after clicking the sign link
        const { getByText } = render(<App />);
        let signin_link = getByText(/sign in/i);
        
        userEvent.click(signin_link)

        const h1 = getByText(/welcome back/i);
        expect(h1).toBeInTheDocument();
    })

    test('fails if does not switch back to signup component', () => {
        // after the previous test the signin component should be rendered
        // therefore this tests ensures that the signup link will cause 
        // the signup component to be rerendered

        const { getByText } = render(<App />, );
        
        let link = getByText(/sign up/i);
        userEvent.click(link)
        
        const h1 = getByText(/create account/i);
        expect(h1).toBeInTheDocument();
    })

    test("fails if google sign in button does not exist", () => {
        const { getByText } = render(<App />);

        let link = getByText(/sign in/i);
        userEvent.click(link)

        let button = getByText(/continue with google/i);

        expect(button).toBeInTheDocument();
    })

    test("fails if facebook sign in button does not exist", () => {
        const { getByText } = render(<App />);

        let button = getByText(/continue with facebook/i);

        expect(button).toBeInTheDocument();
    })

    test("fails if twitter sign in button does not exist", () => {
        const { getByText } = render(<App />);
        let button = getByText(/continue with twitter/i);

        expect(button).toBeInTheDocument();
    })

    test("fails if google sign up button does not exist", () => {
        const { getByText } = render(<App />);
        
        let link = getByText(/sign up/i);
        userEvent.click(link)

        let button = getByText(/sign up with google/i);

        expect(button).toBeInTheDocument();
    })

    test("fails if facebook sign up button does not exist", () => {
        const { getByText } = render(<App />);

        let button = getByText(/sign up with facebook/i);

        expect(button).toBeInTheDocument();
    })

    test("fails if twitter sign up button does not exist", () => {
        const { getByText } = render(<App />);
        let button = getByText(/sign up with twitter/i);

        expect(button).toBeInTheDocument();
    })

})
