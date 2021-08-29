import { render } from '@testing-library/react';
import Login from '../components/login/Login';

describe("Landing Page", () => {

    test('fails if does not renders login component', () => {
        // simply check for the expected h1 content from signup component
        const { getByText } = render(<Login />);
        const h1 = getByText(/boop chat/i);
        expect(h1).toBeInTheDocument();
    });

    test("fails if google sign in button does not exist", () => {
        const { getByText } = render(<Login />);

        let button = getByText(/continue with google/i);

        expect(button).toBeInTheDocument();
    })

    test("fails if facebook sign in button does not exist", () => {
        const { getByText } = render(<Login />);

        let button = getByText(/continue with facebook/i);

        expect(button).toBeInTheDocument();
    })

    test("fails if twitter sign in button does not exist", () => {
        const { getByText } = render(<Login />);
        let button = getByText(/continue with twitter/i);

        expect(button).toBeInTheDocument();
    })

})
