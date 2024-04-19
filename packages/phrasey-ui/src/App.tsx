import ContentGrid from "./components/ContentGrid";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";

function App() {
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
