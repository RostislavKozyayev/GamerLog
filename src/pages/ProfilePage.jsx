import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
    const { user, logout } = useAuth();

    return (
        <div className="profile-layout">
            {/* Шапка профиля */}
            <div className="profile-banner">
                <div className="profile-avatar">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-meta">
                    <h1>{user.name}</h1>
                    <p>{user.email}</p>
                    <span className="profile-date">На сайте с {user.createdAt}</span>
                </div>
                <button type="button" onClick={logout} className="profile-logout-btn">
                    Выйти из аккаунта
                </button>
            </div>

            {/* Навигация по вложенным маршрутам личного кабинета */}
            <div className="profile-subnav">
                <NavLink
                    to="/profile"
                    end
                    className={({ isActive }) => `profile-tab ${isActive ? 'active' : ''}`}
                >
                    📊 Статистика
                </NavLink>
                <NavLink
                    to="/profile/settings"
                    className={({ isActive }) => `profile-tab ${isActive ? 'active' : ''}`}
                >
                    ⚙️ Настройки
                </NavLink>
            </div>

            {/* Сюда подставляются вложенные маршруты (ProfileStats или ProfileSettings) */}
            <div className="profile-outlet-content">
                <Outlet />
            </div>
        </div>
    );
}
