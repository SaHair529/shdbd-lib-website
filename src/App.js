import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ListPage from "./pages/ListPage/ListPage";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<ListPage />}></Route>
                </Routes>
            </Router>
        </div>
    )
}

export default App