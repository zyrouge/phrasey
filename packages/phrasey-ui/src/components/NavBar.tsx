import { Icon } from "@iconify-icon/solid";
import { Component } from "solid-js";
import { darkMode, ThemeMode } from "../core/theme";

const NavBar: Component = () => {
    return (
        <div class="h-12 mx-2 flex items-center justify-between gap-4">
            <div class="u-flex gap-4">
                <img
                    class="h-auto w-10 invert dark:invert-0"
                    src="/icon-transparent.png"
                    alt="Logo"
                />
                <p>Phrasey</p>
            </div>
            <div class="u-flex gap-4 pr-2">
                <button
                    class="u-flex"
                    onClick={() => ThemeMode.toggleDarkMode()}
                >
                    <Icon
                        class="text-2xl"
                        icon={
                            darkMode()
                                ? "material-symbols:dark-mode-outline"
                                : "material-symbols:light-mode-outline"
                        }
                    />
                </button>
            </div>
        </div>
    );
};

export default NavBar;
