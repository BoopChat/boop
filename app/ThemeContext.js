import React, { useContext, useState } from 'react';

const ThemeContext = React.createContext();
const ThemeUpdaterContext = React.createContext();
export const useTheme = () => useContext(ThemeContext);
export const useThemeUpdate = () => useContext(ThemeUpdaterContext);

export const ThemeProvider = ({ children }) => {
    const [darkTheme, setDarkTheme] = useState(true);

    const toggleTheme = () => setDarkTheme(prevTheme => !prevTheme);

    return (
        <ThemeContext.Provider value={darkTheme}>
            <ThemeUpdaterContext.Provider value={toggleTheme}>
                { children }
            </ThemeUpdaterContext.Provider>
        </ThemeContext.Provider>
    )
}