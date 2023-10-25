import { Container } from "reactstrap"
import Home from "./pages/Home"
import NavBar from "./components/NavBar"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Storage from "./pages/Storage"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

function App() {

    return (
        <BrowserRouter>
            <Container className="main" fluid>
                <NavBar />
                <ToastContainer theme="colored" hideProgressBar newestOnTop className="py-5 my-5" autoClose={5000} />
                <Container style={{ marginTop: "90px" }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/storage" element={<Storage />} />
                    </Routes>
                </Container>
            </Container>
        </BrowserRouter>
    )
}

export default App
