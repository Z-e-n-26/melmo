import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import History from './pages/History'; // Added import for History
import Layout from './components/Layout';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* All routes under Layout should be private, so we wrap the Layout route with PrivateRoute */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/" element={<Dashboard />} /> {/* Changed index to path="/" */}
          <Route path="/category/:categoryId" element={<ProductList />} />
          <Route path="/history" element={<History />} /> {/* Added History route */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
