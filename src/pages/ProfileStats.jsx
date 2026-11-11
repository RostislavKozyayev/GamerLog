import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, LIBRARY_CATEGORIES } from '../context/AuthContext';

export default function ProfileStats({ gamesData }) {
    const { userLibrary } = useAuth();

    const stats = useMemo(() => {
        const userGames = gamesData.filter((g) => Boolean(userLibrary[g.id]));
        const total = userGames.length;

        // Количество по категориям
        const byCategory = LIBRARY_CATEGORIES.map((cat) => {
            const count = userGames.filter((g) => userLibrary[g.id] === cat.id).length;
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
            return { ...cat, count, percent };
        });

        // Средний рейтинг Metacritic игр в библиотеке
        const ratedGames = userGames.filter((g) => typeof g.metacriticScore === 'number');
        const avgScore =
            ratedGames.length > 0
                ? (ratedGames.reduce((sum, g) => sum + g.metacriticScore, 0) / ratedGames.length).toFixed(1)
                : '—';

        // Подсчёт любимых жанров
        const genreCounts = {};
        userGames.forEach((game) => {
            game.genres.forEach((genre) => {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
        });

        const topGenres = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4);

        return { total, byCategory, avgScore, topGenres };
    }, [gamesData, userLibrary]);

    return (
        <div className="stats-container">
            {/* Сводные карточки */}
            <div className="stats-summary-grid">
                <div className="stat-box">
                    <span className="stat-number">{stats.total}</span>
                    <span className="stat-label">Всего игр в списках</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">
                        {stats.byCategory.find((c) => c.id === 'completed')?.count || 0}
                    </span>
                    <span className="stat-label">Пройдено игр</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">⭐ {stats.avgScore}</span>
                    <span className="stat-label">Средний рейтинг библиотеки</span>
                </div>
            </div>

            {/* Распределение по 5 категориям с прогресс-барами */}
            <div className="stats-section">
                <h2>Распределение по категориям</h2>
                <div className="category-bars">
                    {stats.byCategory.map((cat) => (
                        <div key={cat.id} className="category-bar-row">
                            <div className="category-bar-info">
                                <span>{cat.label}</span>
                                <span>
                                    <strong>{cat.count}</strong> ({cat.percent}%)
                                </span>
                            </div>
                            <div className="progress-track">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${cat.percent}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Любимые жанры */}
            <div className="stats-section">
                <h2>Любимые жанры</h2>
                {stats.topGenres.length > 0 ? (
                    <div className="top-genres-list">
                        {stats.topGenres.map(([genre, count]) => (
                            <Link
                                key={genre}
                                to={`/catalog?genre=${genre}`}
                                className="top-genre-pill"
                            >
                                <span>{genre}</span>
                                <span className="genre-count-badge">{count}</span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="muted-text">Добавьте игры в библиотеку, чтобы увидеть статистику жанров.</p>
                )}
            </div>
        </div>
    );
}
