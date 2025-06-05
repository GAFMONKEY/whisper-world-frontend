import './App.css'
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" />
    </Routes>
  )
}

export default App
