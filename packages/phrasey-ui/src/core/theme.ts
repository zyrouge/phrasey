import { createSignal } from "solid-js";

export class ThemeMode {
    static darkModeKey = "dark-mode";
    static darkModeClass = "dark";
    static darkMode = true;

    static initialize() {
        this.setDarkModeNoSave(this.darkMode);
    }

    static getDarkMode() {
        const stored = localStorage.getItem(this.darkModeKey);
        return stored === "true";
    }

    static setDarkMode(darkMode: boolean) {
        localStorage.setItem(this.darkModeKey, darkMode.toString());
        this.setDarkModeNoSave(darkMode);
    }

    static setDarkModeNoSave(darkMode: boolean) {
        this.darkMode = darkMode;
        this.setDarkModeSignal(darkMode);
        const htmlElement = document.body.parentElement!;
        if (darkMode) {
            htmlElement.classList.add(this.darkModeClass);
        } else {
            htmlElement.classList.remove(this.darkModeClass);
        }
    }

    static setDarkModeSignal(darkMode: boolean) {
        DarkModeSignal[1](darkMode);
    }

    static toggleDarkMode() {
        this.setDarkMode(!this.darkMode);
    }
}

const DarkModeSignal = createSignal(ThemeMode.darkMode);
export const darkMode = DarkModeSignal[0];
