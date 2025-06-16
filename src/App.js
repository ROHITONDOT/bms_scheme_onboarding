import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SchemeBasicInfo from "./pages/schemeregistration/SchemeBasicInfo.js";
import SchemeFormDesign from "./pages/schemeregistration/SchemeFormDesign.js";
import SchemePreview from "./pages/schemeregistration/SchemePreview.js";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./TextCaptcha.css";
import { FormDataProvider } from './pages/schemeregistration/FormDataContext';
function App() {
  return (
    <FormDataProvider>
    <Router>
      <div className="container-fluid bg-light" style={{ padding: 0 }}>
      <Header />
        <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/schemeregistration" element={<SchemeBasicInfo />} />
          <Route path="/schemeFormDesign/:schemeId" element={<SchemeFormDesign />} />
          <Route path="/SchemePreview/:schemeId" element={<SchemePreview />} />
        </Routes>
      
      <Footer />
      </div>
    </Router>
    </FormDataProvider>
  );
}

export default App;