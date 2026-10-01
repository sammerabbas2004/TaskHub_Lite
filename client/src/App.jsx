import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}><Route path="/tasks" element={<TasksPage />} /></Route>
    <Route path="*" element={<Navigate to="/tasks" replace />} />
  </Routes>;
}
