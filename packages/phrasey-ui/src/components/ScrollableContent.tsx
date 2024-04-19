import { JSX } from "solid-js";

function ScrollableBody(props: {
    children: JSX.Element;
}) {
    return (
        <div class="h-[calc(100vh-3rem-1px)] overflow-y-auto">
            {props.children}
        </div>
    );
}

export default ScrollableBody;
