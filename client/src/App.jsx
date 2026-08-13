import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Students from "./pages/Students";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>

      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/students" replace />
            : <Login />
        }
      />

      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? "/students"
                : "/login"
            }
            replace
          />
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;