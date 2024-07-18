import { onMount } from "solid-js";
import { ContentGrid } from "./components/ContentGrid";
import { NavBar } from "./components/NavBar";
import { SideBar } from "./components/SideBar";
import { globalState } from "./core/state";

function App() {
    onMount(() => globalState.initialize());

    return (
        <>
            <NavBar />
            <hr />
            <ContentGrid>
                <SideBar />
                <div>2</div>
            </ContentGrid>
        </>
    );
}

export default App;
