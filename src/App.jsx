import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';
import Dashboard from '@pages/Dashboard';
import Products from '@pages/Products';
import Profile from '@pages/Profile';
import Settings from '@pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
