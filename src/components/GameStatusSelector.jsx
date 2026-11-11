import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LIBRARY_CATEGORIES } from '../context/AuthContext';

export default function GameStatusSelector({ isAuth, currentStatus, onStatusChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const selectorRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectorRef.current && !selectorRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Если пользователь не вошёл в аккаунт
    if (!isAuth) {
        return (
            <div className="library-guest-prompt">
                <Link to="/login" className="add-library-btn guest">
                    + Войдите, чтобы добавить в библиотеку
                </Link>
            </div>
        );
    }

    const activeCategory = LIBRARY_CATEGORIES.find((cat) => cat.id === currentStatus);

    const handleSelect = (categoryId) => {
        onStatusChange(categoryId);
        setIsOpen(false);
    };

    return (
        <div className="library-selector" ref={selectorRef}>
            <button
                type="button"
                className={`add-library-btn ${activeCategory ? 'added' : ''}`}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span>{activeCategory ? activeCategory.label : '+ Добавить в библиотеку'}</span>
                <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="dropdown-menu library-dropdown-menu">
                    {LIBRARY_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            className={`dropdown-item ${currentStatus === cat.id ? 'selected' : ''}`}
                            onClick={() => handleSelect(cat.id)}
                        >
                            <span>{cat.label}</span>
                            {currentStatus === cat.id && <span>✓</span>}
                        </button>
                    ))}

                    {currentStatus && (
                        <>
                            <hr className="dropdown-divider" />
                            <button
                                type="button"
                                className="dropdown-item remove-item"
                                onClick={() => handleSelect(null)}
                            >
                                <span>🗑️ Убрать из библиотеки</span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
