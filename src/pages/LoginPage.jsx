import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Если пользователь уже вошёл, перенаправляем в профиль
    if (user) {
        return <Navigate to="/profile" replace />;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            setError('Введите email и пароль');
            return;
        }

        const result = login(email, password);
        if (result.success) {
            navigate('/profile');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit} noValidate>
                <h1>Вход в аккаунт</h1>
                <p className="auth-subtitle">Добро пожаловать обратно в GamerLog</p>

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-field">
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        placeholder="example@mail.ru"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError('');
                        }}
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="login-password">Пароль</label>
                    <input
                        id="login-password"
                        type="password"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError('');
                        }}
                    />
                </div>

                <button type="submit" className="auth-submit-btn">
                    Войти
                </button>

                <p className="auth-switch">
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </p>
            </form>
        </div>
    );
}
