import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const { user, register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    // Если пользователь уже вошёл, перенаправляем в профиль
    if (user) {
        return <Navigate to="/profile" replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Клиентская валидация
        if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Введите корректный адрес электронной почты');
            return;
        }

        if (formData.password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        const result = register(formData.name, formData.email, formData.password);
        if (result.success) {
            navigate('/profile');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit} noValidate>
                <h1>Регистрация</h1>
                <p className="auth-subtitle">Создайте аккаунт, чтобы вести личную библиотеку игр</p>

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-field">
                    <label htmlFor="reg-name">Имя пользователя</label>
                    <input
                        id="reg-name"
                        name="name"
                        type="text"
                        placeholder="example228"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="reg-email">Email</label>
                    <input
                        id="reg-email"
                        name="email"
                        type="email"
                        placeholder="example@mail.ru"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="reg-password">Пароль</label>
                    <input
                        id="reg-password"
                        name="password"
                        type="password"
                        placeholder="Минимум 6 символов"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="reg-confirm">Подтвердите пароль</label>
                    <input
                        id="reg-confirm"
                        name="confirmPassword"
                        type="password"
                        placeholder="Повторите пароль"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="auth-submit-btn">
                    Зарегистрироваться
                </button>

                <p className="auth-switch">
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </form>
        </div>
    );
}
