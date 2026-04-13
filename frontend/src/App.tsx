import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Layout from './components/Layout';
import UsersPage from './pages/UsersPage';
import TokensPage from './pages/TokensPage';
import LogsPage from './pages/LogsPage';

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Login />} />
      
      {/* Protected Routes Wrapper */}
      <Route element={<Layout />}>
        <Route path="/admin/tokens" element={<TokensPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/logs" element={<LogsPage />} />
        <Route path="/admin/dashboard" element={<Navigate to="/admin/tokens" replace />} />
      </Route>

      {/* Fallbacks */}
      <Route path="/" element={<Navigate to="/admin/tokens" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default App;
