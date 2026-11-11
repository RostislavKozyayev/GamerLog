import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import GameCard from '../components/GameCard';

export default function Catalog({ gamesData }) {
    const [searchParams, setSearchParams] = useSearchParams();

    // Состояния фильтров
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenres, setSelectedGenres] = useState(() => {
        const genreFromUrl = searchParams.get('genre');
        return genreFromUrl ? [genreFromUrl] : [];
    });
    const [releaseStatus, setReleaseStatus] = useState('all'); // 'all' | 'released' | 'upcoming'
    const [selectedYear, setSelectedYear] = useState('all');
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('rating-desc');

    // Состояния для всех кастомных выпадающих списков ('genres' | 'year' | 'rating' | 'sort' | null)
    const [openDropdown, setOpenDropdown] = useState(null);
    const [genreSearch, setGenreSearch] = useState('');
    const sidebarRef = useRef(null);

    // Варианты для списков рейтинга и сортировки
    const ratingOptions = [
        { value: 0, label: 'Любой рейтинг' },
        { value: 70, label: 'от ⭐ 70' },
        { value: 80, label: 'от ⭐ 80' },
        { value: 85, label: 'от ⭐ 85' },
        { value: 90, label: 'от ⭐ 90' },
        { value: 95, label: 'от ⭐ 95' }
    ];

    const sortOptions = [
        { value: 'rating-desc', label: 'По рейтингу Metacritic' },
        { value: 'date-desc', label: 'Сначала новые' },
        { value: 'date-asc', label: 'Сначала старые' },
        { value: 'title-asc', label: 'По алфавиту (A-Z)' }
    ];

    // Синхронизация при переходе по ссылкам жанров из Footer
    useEffect(() => {
        const genreFromUrl = searchParams.get('genre');
        if (genreFromUrl) {
            setSelectedGenres([genreFromUrl]);
        }
    }, [searchParams]);

    // Закрытие любого открытого выпадающего списка при клике вне сайдбара
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Уникальные жанры и годы из базы данных
    const { allGenres, allYears } = useMemo(() => {
        const genresSet = new Set();
        const yearsSet = new Set();

        gamesData.forEach((game) => {
            game.genres.forEach((genre) => genresSet.add(genre));
            if (game.releaseDate) {
                yearsSet.add(game.releaseDate.slice(0, 4));
            }
        });

        return {
            allGenres: Array.from(genresSet).sort(),
            allYears: Array.from(yearsSet).sort((a, b) => b.localeCompare(a))
        };
    }, [gamesData]);

    // Жанры, отфильтрованные строкой поиска внутри выпадающего окна
    const visibleGenres = useMemo(() => {
        return allGenres.filter((genre) =>
            genre.toLowerCase().includes(genreSearch.toLowerCase())
        );
    }, [allGenres, genreSearch]);

    // Переключение жанра
    const toggleGenre = (genre) => {
        setSelectedGenres((prev) => {
            const updated = prev.includes(genre)
                ? prev.filter((g) => g !== genre)
                : [...prev, genre];

            if (searchParams.has('genre')) {
                setSearchParams({});
            }
            return updated;
        });
    };

    // Проверка, активен ли хоть один фильтр
    const hasActiveFilters =
        searchQuery !== '' ||
        selectedGenres.length > 0 ||
        releaseStatus !== 'all' ||
        selectedYear !== 'all' ||
        minRating > 0;

    // Сброс всех фильтров
    const resetFilters = () => {
        setSearchQuery('');
        setSelectedGenres([]);
        setReleaseStatus('all');
        setSelectedYear('all');
        setMinRating(0);
        setSortBy('rating-desc');
        setGenreSearch('');
        if (searchParams.has('genre')) {
            setSearchParams({});
        }
    };

    // Фильтрация и сортировка игр
    const filteredGames = useMemo(() => {
        const currentDate = new Date().toISOString().split('T')[0];

        return gamesData
            .filter((game) => {
                // Поиск по названию / студии
                const matchesSearch =
                    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    game.developer.toLowerCase().includes(searchQuery.toLowerCase());

                // Жанры
                const matchesGenres =
                    selectedGenres.length === 0 ||
                    selectedGenres.every((genre) => game.genres.includes(genre));

                // Статус выхода
                const isReleased = currentDate >= game.releaseDate;
                const matchesStatus =
                    releaseStatus === 'all' ||
                    (releaseStatus === 'released' && isReleased) ||
                    (releaseStatus === 'upcoming' && !isReleased);

                // Год выпуска
                const matchesYear =
                    selectedYear === 'all' ||
                    game.releaseDate.startsWith(selectedYear);

                // Минимальный рейтинг Metacritic
                const matchesRating =
                    minRating === 0 ||
                    (typeof game.metacriticScore === 'number' && game.metacriticScore >= minRating);

                return matchesSearch && matchesGenres && matchesStatus && matchesYear && matchesRating;
            })
            .sort((a, b) => {
                if (sortBy === 'rating-desc') {
                    return (b.metacriticScore ?? -1) - (a.metacriticScore ?? -1);
                }
                if (sortBy === 'date-desc') {
                    return b.releaseDate.localeCompare(a.releaseDate);
                }
                if (sortBy === 'date-asc') {
                    return a.releaseDate.localeCompare(b.releaseDate);
                }
                if (sortBy === 'title-asc') {
                    return a.title.localeCompare(b.title);
                }
                return 0;
            });
    }, [gamesData, searchQuery, selectedGenres, releaseStatus, selectedYear, minRating, sortBy]);

    return (
        <div className="catalog-layout">
            {/* Левая липкая панель фильтров */}
            {/* Левая липкая панель фильтров */}
            <aside className="catalog-sidebar" ref={sidebarRef}>
                <div className="sidebar-header">
                    <h2>Фильтры</h2>
                    {hasActiveFilters && (
                        <button type="button" onClick={resetFilters} className="reset-btn">
                            Сбросить
                        </button>
                    )}
                </div>

                {/* Поиск */}
                <div className="filter-group">
                    <label htmlFor="search-input">Поиск</label>
                    <input
                        id="search-input"
                        type="text"
                        placeholder="Название или студия..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="catalog-input"
                    />
                </div>

                {/* 1. Жанры */}
                <div className="filter-group">
                    <label>Жанры</label>
                    <div className="custom-dropdown">
                        <button
                            type="button"
                            className={`dropdown-trigger ${openDropdown === 'genres' ? 'open' : ''}`}
                            onClick={() => setOpenDropdown(openDropdown === 'genres' ? null : 'genres')}
                        >
                            <span>
                                {selectedGenres.length === 0
                                    ? 'Выберите жанры'
                                    : `Выбрано: ${selectedGenres.length}`}
                            </span>
                            <span className="dropdown-arrow">{openDropdown === 'genres' ? '▲' : '▼'}</span>
                        </button>

                        {openDropdown === 'genres' && (
                            <div className="dropdown-menu">
                                <input
                                    type="text"
                                    placeholder="Найти жанр..."
                                    value={genreSearch}
                                    onChange={(e) => setGenreSearch(e.target.value)}
                                    className="dropdown-search-input"
                                    autoFocus
                                />
                                <div className="dropdown-list">
                                    {visibleGenres.length > 0 ? (
                                        visibleGenres.map((genre) => (
                                            <label key={genre} className="dropdown-item">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGenres.includes(genre)}
                                                    onChange={() => toggleGenre(genre)}
                                                />
                                                <span>{genre}</span>
                                            </label>
                                        ))
                                    ) : (
                                        <div className="dropdown-empty">Жанр не найден</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {selectedGenres.length > 0 && (
                        <div className="selected-genres-tags">
                            {selectedGenres.map((genre) => (
                                <button
                                    key={genre}
                                    type="button"
                                    className="selected-genre-tag"
                                    onClick={() => toggleGenre(genre)}
                                    title="Убрать жанр"
                                >
                                    {genre} &times;
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Год выпуска */}
                <div className="filter-group">
                    <label>Год выпуска</label>
                    <div className="custom-dropdown">
                        <button
                            type="button"
                            className={`dropdown-trigger ${openDropdown === 'year' ? 'open' : ''}`}
                            onClick={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}
                        >
                            <span>{selectedYear === 'all' ? 'Любой год' : selectedYear}</span>
                            <span className="dropdown-arrow">{openDropdown === 'year' ? '▲' : '▼'}</span>
                        </button>

                        {openDropdown === 'year' && (
                            <div className="dropdown-menu">
                                <div className="dropdown-list">
                                    <button
                                        type="button"
                                        className={`dropdown-item ${selectedYear === 'all' ? 'selected' : ''}`}
                                        onClick={() => {
                                            setSelectedYear('all');
                                            setOpenDropdown(null);
                                        }}
                                    >
                                        <span>Любой год</span>
                                        {selectedYear === 'all' && <span>✓</span>}
                                    </button>
                                    {allYears.map((year) => (
                                        <button
                                            key={year}
                                            type="button"
                                            className={`dropdown-item ${selectedYear === year ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedYear(year);
                                                setOpenDropdown(null);
                                            }}
                                        >
                                            <span>{year}</span>
                                            {selectedYear === year && <span>✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Рейтинг Metacritic */}
                <div className="filter-group">
                    <label>Рейтинг Metacritic</label>
                    <div className="custom-dropdown">
                        <button
                            type="button"
                            className={`dropdown-trigger ${openDropdown === 'rating' ? 'open' : ''}`}
                            onClick={() => setOpenDropdown(openDropdown === 'rating' ? null : 'rating')}
                        >
                            <span>
                                {ratingOptions.find((opt) => opt.value === minRating)?.label}
                            </span>
                            <span className="dropdown-arrow">{openDropdown === 'rating' ? '▲' : '▼'}</span>
                        </button>

                        {openDropdown === 'rating' && (
                            <div className="dropdown-menu">
                                <div className="dropdown-list">
                                    {ratingOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`dropdown-item ${minRating === opt.value ? 'selected' : ''}`}
                                            onClick={() => {
                                                setMinRating(opt.value);
                                                setOpenDropdown(null);
                                            }}
                                        >
                                            <span>{opt.label}</span>
                                            {minRating === opt.value && <span>✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Статус выхода */}
                <div className="filter-group">
                    <label>Статус выхода</label>
                    <div className="status-buttons">
                        <button
                            type="button"
                            className={`filter-chip ${releaseStatus === 'all' ? 'active' : ''}`}
                            onClick={() => setReleaseStatus('all')}
                        >
                            Все
                        </button>
                        <button
                            type="button"
                            className={`filter-chip ${releaseStatus === 'released' ? 'active' : ''}`}
                            onClick={() => setReleaseStatus('released')}
                        >
                            🟢 Вышли
                        </button>
                        <button
                            type="button"
                            className={`filter-chip ${releaseStatus === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setReleaseStatus('upcoming')}
                        >
                            🔴 Анонсы
                        </button>
                    </div>
                </div>

                {/* 5. Сортировка */}
                <div className="filter-group">
                    <label>Сортировка</label>
                    <div className="custom-dropdown">
                        <button
                            type="button"
                            className={`dropdown-trigger ${openDropdown === 'sort' ? 'open' : ''}`}
                            onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                        >
                            <span>
                                {sortOptions.find((opt) => opt.value === sortBy)?.label}
                            </span>
                            <span className="dropdown-arrow">{openDropdown === 'sort' ? '▲' : '▼'}</span>
                        </button>

                        {openDropdown === 'sort' && (
                            <div className="dropdown-menu">
                                <div className="dropdown-list">
                                    {sortOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`dropdown-item ${sortBy === opt.value ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSortBy(opt.value);
                                                setOpenDropdown(null);
                                            }}
                                        >
                                            <span>{opt.label}</span>
                                            {sortBy === opt.value && <span>✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Правая часть: сетка игр */}
            <section className="catalog-content">
                <div className="catalog-header">
                    <h1>Каталог игр</h1>
                    <span className="games-count">Найдено: {filteredGames.length}</span>
                </div>

                {filteredGames.length > 0 ? (
                    <div className="catalog-grid">
                        {filteredGames.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-catalog">
                        <p>По выбранным фильтрам игр не найдено.</p>
                        <button type="button" onClick={resetFilters} className="reset-main-btn">
                            Сбросить фильтры
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
