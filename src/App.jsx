import { Outlet, Routes, Route, Navigate } from 'react-router-dom';
import { gamesData } from './data/gamesData.js';
import ScrollToTop from './components/ScrollToTop';
import NotFoundPage from './pages/NotFoundPage.jsx';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/HomePage.jsx';
import GamePage from './pages/GamePage';
import CatalogPage from './pages/CatalogPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProfileStats from './pages/ProfileStats.jsx';
import ProfileSettings from './pages/ProfileSettings.jsx';

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home gamesData={gamesData} />} />
        <Route path="/games/:gameId" element={<GamePage gamesData={gamesData} />} />
        <Route path="/catalog" element={<CatalogPage gamesData={gamesData} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Личная библиотека (только для авторизованных) */}
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <LibraryPage gamesData={gamesData} />
            </ProtectedRoute>
          }
        />

        {/* Личный кабинет с вложенными маршрутами (<Outlet />) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileStats gamesData={gamesData} />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
