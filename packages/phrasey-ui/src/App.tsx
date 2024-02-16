import ContentGrid from "./components/ContentGrid";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";

function App() {
    return (
        <>
            <NavBar />
            <hr />
            <div class="h-[calc(100vh-3rem)]">
                <ContentGrid>
                    <SideBar />
                    <div>2</div>
                </ContentGrid>
            </div>
        </>
    );
}

export default App;
