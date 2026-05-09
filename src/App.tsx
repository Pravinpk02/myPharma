import {LoginPage} from './LoginPageComponent/LoginPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateAccount from "./LoginPageComponent/Createaccount/CreateAccount";
import './App.css'
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/Resetpassword';

function App() {
 

  return (
    <>
  
   <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
