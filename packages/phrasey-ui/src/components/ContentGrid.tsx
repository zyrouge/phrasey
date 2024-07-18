import { Component, JSX } from "solid-js";

export const ContentGrid: Component<{
    children: [JSX.Element, JSX.Element];
}> = (props) => {
    return (
        <div class="h-full grid grid-cols-5">
            <div class="col-span-1 border-r border-secondary-200 dark:border-secondary-800">
                {props.children[0]}
            </div>
            <div class="col-span-4">{props.children[1]}</div>
        </div>
    );
};
