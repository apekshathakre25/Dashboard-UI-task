import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthComponents from "./Components/Authentication/AuthComponent";
import Dashboard from "./Components/Dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Notification from "./Components/Utiles/Notification";
import { UserState } from './Components/Context/UserContext';
import { Navigate } from 'react-router-dom';
 

function App() {
  const { user } = UserState();
  return (
    <>
      <Notification />
      <BrowserRouter>
        <Routes>
          <Route 
          path="/" 
          element={(user) ? <Navigate replace to="/dashboard" /> : <AuthComponents />} 
        />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;