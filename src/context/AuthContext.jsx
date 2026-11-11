import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Константы категорий библиотеки (единые для всего приложения)
export const LIBRARY_CATEGORIES = [
    { id: 'playing', label: '🎮 Играю', shortLabel: 'Играю' },
    { id: 'completed', label: '✅ Пройдено', shortLabel: 'Пройдено' },
    { id: 'planned', label: '📌 Хочу поиграть', shortLabel: 'Хочу поиграть' },
    { id: 'on_hold', label: '⏸️ Отложено', shortLabel: 'Отложено' },
    { id: 'dropped', label: '❌ Брошено', shortLabel: 'Брошено' }
];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('gamerlog_current_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('gamerlog_users');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });

    // Библиотека текущего пользователя: { [gameId]: categoryId }
    const [userLibrary, setUserLibrary] = useState({});

    // Загружаем библиотеку при входе/смене пользователя
    useEffect(() => {
        if (user) {
            localStorage.setItem('gamerlog_current_user', JSON.stringify(user));
            const savedLib = localStorage.getItem(`gamerlog_library_${user.id}`);
            setUserLibrary(savedLib ? JSON.parse(savedLib) : {});
        } else {
            localStorage.removeItem('gamerlog_current_user');
            setUserLibrary({});
        }
    }, [user]);

    // Сохраняем библиотеку в localStorage при её изменении
    useEffect(() => {
        if (user) {
            localStorage.setItem(`gamerlog_library_${user.id}`, JSON.stringify(userLibrary));
        }
    }, [userLibrary, user]);

    useEffect(() => {
        localStorage.setItem('gamerlog_users', JSON.stringify(users));
    }, [users]);

    const register = (name, email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        if (users.some((u) => u.email === normalizedEmail)) {
            return { success: false, message: 'Пользователь с таким email уже зарегистрирован' };
        }

        const newUser = {
            id: Date.now().toString(),
            name: name.trim(),
            email: normalizedEmail,
            password,
            createdAt: new Date().toISOString().split('T')[0]
        };

        setUsers((prev) => [...prev, newUser]);
        const { password: _, ...sessionUser } = newUser;
        setUser(sessionUser);
        return { success: true };
    };

    const login = (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const foundUser = users.find(
            (u) => u.email === normalizedEmail && u.password === password
        );

        if (!foundUser) {
            return { success: false, message: 'Неверный email или пароль' };
        }

        const { password: _, ...sessionUser } = foundUser;
        setUser(sessionUser);
        return { success: true };
    };

    const logout = () => {
        setUser(null);
    };

    // Обновление имени пользователя (для подраздела Настройки в Личном кабинете)
    const updateProfileName = (newName) => {
        if (!user || !newName.trim()) return;
        const trimmed = newName.trim();
        setUser((prev) => ({ ...prev, name: trimmed }));
        setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? { ...u, name: trimmed } : u))
        );
    };

    // Установить или удалить категорию игры в библиотеке
    const setGameCategory = (gameId, categoryId) => {
        if (!user) return;
        setUserLibrary((prev) => {
            const updated = { ...prev };
            if (!categoryId) {
                delete updated[gameId];
            } else {
                updated[gameId] = categoryId;
            }
            return updated;
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                register,
                login,
                logout,
                updateProfileName,
                userLibrary,
                setGameCategory
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
