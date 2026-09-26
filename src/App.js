import "./App.css";
import { Header } from "./components/Header";
import { AllRoutes } from "./routes/AllRoutes";
import { RouteTransitionProvider } from "./components/ui/StaggeredPageTransition";

function App() {
    return (
        <div className="App">
            <RouteTransitionProvider>
                <Header />
                <AllRoutes />
            </RouteTransitionProvider>
        </div>
    );
}

export default App;