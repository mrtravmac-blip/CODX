import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import ListsPage from './pages/ListsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from './context/AuthContext';

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p className="loading">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <Protected>
              <div className="page-wrap">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/lists" element={<ListsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
                <NavBar />
              </div>
            </Protected>
          }
        />
      </Routes>
    </div>
  );
}
