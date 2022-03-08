import { useState } from "react";

import sun from "../../../assets/icons/sun.svg";
import moon from "../../../assets/icons/moon.svg";

const useThemeSwitcher = () => {
    const [themeIcon, setThemeIcon] = useState(() => {
        return document.getElementsByTagName("body")[0].classList[0] === "dark" ? sun : moon;
    });
    const [isDark, setIsDark] = useState(() => document.getElementsByTagName("body")[0].classList[0] === "dark");

    const toggleTheme = () => {
        let body = document.getElementsByTagName("body")[0];
        if (body.classList[0] === "light") {
            body.classList.replace("light", "dark");
            localStorage.setItem("theme", "dark");
            setThemeIcon(sun);
            setIsDark(true);
        } else {
            body.classList.replace("dark", "light");
            localStorage.setItem("theme", "light");
            setThemeIcon(moon);
            setIsDark(false);
        }
    };

    return { toggleTheme, themeIcon, isDark };
};

export default useThemeSwitcher;