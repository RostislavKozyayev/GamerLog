import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, LIBRARY_CATEGORIES } from '../context/AuthContext';
import GameCard from '../components/GameCard';

export default function LibraryPage({ gamesData }) {
    const { userLibrary } = useAuth();
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'playing' | 'completed' | 'planned' | 'on_hold' | 'dropped'

    // Собираем все игры, которые есть в библиотеке пользователя
    const libraryGames = useMemo(() => {
        return gamesData
            .filter((game) => Boolean(userLibrary[game.id]))
            .map((game) => ({
                ...game,
                libraryStatus: userLibrary[game.id]
            }));
    }, [gamesData, userLibrary]);

    // Фильтруем по выбранной вкладке категории
    const visibleGames = useMemo(() => {
        if (activeTab === 'all') return libraryGames;
        return libraryGames.filter((game) => game.libraryStatus === activeTab);
    }, [libraryGames, activeTab]);

    // Подсчёт количества игр по каждой категории
    const countsByCategory = useMemo(() => {
        const counts = { all: libraryGames.length };
        LIBRARY_CATEGORIES.forEach((cat) => {
            counts[cat.id] = libraryGames.filter((g) => g.libraryStatus === cat.id).length;
        });
        return counts;
    }, [libraryGames]);

    return (
        <div className="library-page">
            <div className="library-header">
                <h1>Моя библиотека</h1>
                <span className="games-count">Всего игр: {libraryGames.length}</span>
            </div>

            {/* Вкладки категорий */}
            <div className="library-tabs">
                <button
                    type="button"
                    className={`library-tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    Все игры ({countsByCategory.all})
                </button>

                {LIBRARY_CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        className={`library-tab ${activeTab === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(cat.id)}
                    >
                        {cat.label} ({countsByCategory[cat.id] || 0})
                    </button>
                ))}
            </div>

            {/* Список игр выбранной категории */}
            {visibleGames.length > 0 ? (
                <div className="catalog-grid">
                    {visibleGames.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            ) : (
                <div className="empty-catalog">
                    <p>
                        {libraryGames.length === 0
                            ? 'Ваша библиотека пока пуста. Откройте любую игру в каталоге, чтобы добавить её в список!'
                            : 'В этой категории пока нет игр.'}
                    </p>
                    <Link to="/catalog" className="reset-main-btn">
                        Перейти в каталог
                    </Link>
                </div>
            )}
        </div>
    );
}
