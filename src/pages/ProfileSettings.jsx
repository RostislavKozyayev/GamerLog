import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfileSettings() {
    const { user, updateProfileName } = useAuth();
    const [name, setName] = useState(user.name);
    const [savedMessage, setSavedMessage] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        updateProfileName(name);
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 2500);
    };

    return (
        <form className="settings-card" onSubmit={handleSubmit}>
            <h2>Настройки профиля</h2>

            <div className="auth-field">
                <label htmlFor="settings-name">Отображаемое имя</label>
                <input
                    id="settings-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="auth-field">
                <label>Email (нельзя изменить)</label>
                <input type="email" value={user.email} disabled className="disabled-input" />
            </div>

            <button type="submit" className="auth-submit-btn">
                Сохранить изменения
            </button>

            {savedMessage && <p className="settings-saved">✓ Имя успешно обновлено</p>}
        </form>
    );
}
