import { Component, JSX } from "solid-js";

export const ScrollableContent: Component<{
    children: JSX.Element | JSX.Element[];
}> = (props) => {
    return (
        <div class="h-[calc(100vh-3rem-1px)] overflow-y-auto">
            {props.children}
        </div>
    );
};
