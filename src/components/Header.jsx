import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/icons/gamerlog-logo.svg';

const setActive = ({ isActive }) => (isActive ? 'active-link' : '');

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const headerRef = useRef(null);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (headerRef.current && !headerRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="user-select-none" ref={headerRef}>
            <Link to="/" className="logo-link">
                <img src={logo} alt="Логотип компании" className="logo-img" width="120" height="40" />
            </Link>

            <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
                <NavLink to="/" className={setActive}>Главная</NavLink>
                <NavLink to="/catalog" className={setActive}>Каталог</NavLink>

                {user ? (
                    <>
                        <NavLink to="/library" className={setActive}>Моя библиотека</NavLink>

                        <div className="header-auth-actions">
                            <NavLink to="/profile" className={`${setActive} profile-link`}>
                                👤 {user.name}
                            </NavLink>
                            <button type="button" onClick={handleLogout} className="logout-btn">
                                Выйти
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="header-auth-actions">
                        <NavLink to="/login" className={setActive}>Войти</NavLink>
                        <NavLink to="/register" className="profile-link">Регистрация</NavLink>
                    </div>
                )}
            </nav>

            <button
                type="button"
                className={`burger-btn ${isMenuOpen ? 'open' : ''}`}
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Открыть меню"
                aria-expanded={isMenuOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </header>
    );
}
