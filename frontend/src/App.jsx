import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import RegisterType from "./pages/UserType"
import Login from "./pages/Login"
import RegisterAccount from "./pages/RegisterForms/RegisterAccount"

function App() {
 
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
           <Route path="/register" element={<RegisterType/>}/>
           <Route path="/register/:accountType" element={<RegisterAccount/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
